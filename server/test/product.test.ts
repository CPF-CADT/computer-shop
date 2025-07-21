import { Request, Response } from 'express';
import ProductRepository, { ProductFeedBackRepositories } from '../repositories/product.repository';
import { Product as ProductModel } from '../db/models'; // Renamed to avoid conflict

jest.mock('../db/sequelize', () => ({
    sequelize: {
        query: jest.fn(), // Mock the query method used by ProductRepository
        authenticate: jest.fn().mockResolvedValue(true),
        sync: jest.fn().mockResolvedValue(true),
    },
    initializeDatabase: jest.fn(),
}));

jest.mock('../repositories/product.repository');
jest.mock('../db/models', () => ({
    Product: {
        count: jest.fn(), 
        create: jest.fn(),
        update: jest.fn(),
    },
    ProductFeedback: {
        create: jest.fn(),
    }
}));
const mockedProductRepository = ProductRepository as jest.Mocked<typeof ProductRepository>;
const mockedProductFeedBackRepositories = ProductFeedBackRepositories as jest.Mocked<typeof ProductFeedBackRepositories>;
const mockedProductModel = ProductModel as jest.Mocked<typeof ProductModel>;


import {
    getAllProduct,
    getOneProduct,
    getProductDetail,
    addNewProduct,
    addProductFeedback,
    updateProduct
} from '../controller/product.controller';

describe('Product Controller - Unit Tests', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;
    let responseSend: jest.Mock;


    beforeEach(() => {
        jest.clearAllMocks();
        responseJson = jest.fn();
        responseSend = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson, send: responseSend });
        mockRequest = { query: {}, params: {}, body: {} };
        mockResponse = { status: responseStatus, json: responseJson, send: responseSend };

        // Mock ProductModel.count for getAllProduct tests
        mockedProductModel.count = jest.fn().mockResolvedValue(100);
    });

    // --- getAllProduct Tests ---
    describe('getAllProduct', () => {
        it('[PC-001] should retrieve all products with default pagination and return 200', async () => {
            const mockProducts = [{ product_code: 'P001', name: 'Product 1' }];
            mockedProductRepository.getAllProduct.mockResolvedValue(mockProducts as any);

            await getAllProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.getAllProduct).toHaveBeenCalledWith(
                undefined, 'asc', 'name', undefined, undefined, undefined, undefined, undefined, 1, 10
            );
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                meta: { totalItems: 100, page: 1, totalPages: 10 },
                data: mockProducts
            });
        });

         it('[PC-002] should retrieve products with search and filter parameters and return 200', async () => {
            mockRequest.query = {
                name: 'Laptop',
                sort: 'desc',
                order_column: 'price',
                category: 'Electronics',
                type_product: 'Laptop',
                brand: 'Dell',
                price_min: '500',
                price_max: '1500',
                page: '2',
                limit: '5'
            };
            const mockProducts = [{ product_code: 'P002', name: 'Dell XPS 15', price: { amount: 1200, currency: 'USD' } }];
            mockedProductRepository.getAllProduct.mockResolvedValue(mockProducts as any);

            await getAllProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.getAllProduct).toHaveBeenCalledWith(
                'Laptop', 'desc', 'price', 'Electronics', 'Laptop', 'Dell', 500, 1500, 2, 5
            );
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                meta: { totalItems: 100, page: 2, totalPages: 20 }, // Corrected: totalPages should be 20 (100 total items / 5 limit per page)
                data: mockProducts
            });
        });
        it('[PC-003] should return 404 if no products are found', async () => {
            mockedProductRepository.getAllProduct.mockResolvedValue(null);
            mockedProductModel.count.mockResolvedValue(0); // No products found, so totalItems is 0

            await getAllProduct(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(200); // Controller returns 200 with empty array if null
            expect(responseJson).toHaveBeenCalledWith({
                meta: { totalItems: 0, page: 1, totalPages: 0 },
                data: null
            });
        });

        it('[PC-004] should handle errors during product retrieval and return 404', async () => {
            const errorMessage = 'Database error';
            mockedProductRepository.getAllProduct.mockRejectedValue(new Error(errorMessage));

            await getAllProduct(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // --- getOneProduct Tests ---
    describe('getOneProduct', () => {
        it('[PC-005] should retrieve a single product by code and return 200', async () => {
            mockRequest.params = { product_code: 'P001' };
            const mockProduct = { product_code: 'P001', name: 'Test Product' };
            mockedProductRepository.getOneProduct.mockResolvedValue(mockProduct as any);

            await getOneProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.getOneProduct).toHaveBeenCalledWith('P001');
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseSend).toHaveBeenCalledWith(mockProduct);
        });

        it('[PC-006] should return 404 if the product is not found', async () => {
            mockRequest.params = { product_code: 'P999' };
            mockedProductRepository.getOneProduct.mockResolvedValue(null);

            await getOneProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.getOneProduct).toHaveBeenCalledWith('P999');
            expect(responseStatus).toHaveBeenCalledWith(200); // Controller sends null with 200
            expect(responseSend).toHaveBeenCalledWith(null);
        });

        it('[PC-007] should handle errors during single product retrieval and return 404', async () => {
            mockRequest.params = { product_code: 'P001' };
            const errorMessage = 'Product not found in DB';
            mockedProductRepository.getOneProduct.mockRejectedValue(new Error(errorMessage));

            await getOneProduct(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // --- getProductDetail Tests ---
    describe('getProductDetail', () => {
        const mockProductWithFeedback = {
            product_code: 'P001',
            name: 'Test Product',
            customerFeedback: [
                { feedback_id: 1, rating: 5, comment: 'Great!', customerName: 'Alice' }
            ]
        };
        const mockProductWithoutFeedback = {
            product_code: 'P002',
            name: 'Another Product',
            customerFeedback: []
        };

        it('[PC-008] should retrieve product details with feedback and return 200', async () => {
            mockRequest.params = { product_code: 'P001' };
            mockedProductRepository.getProductDetail.mockResolvedValue(mockProductWithFeedback as any);

            await getProductDetail(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.getProductDetail).toHaveBeenCalledWith('P001');
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseSend).toHaveBeenCalledWith(mockProductWithFeedback);
        });

        it('[PC-009] should retrieve product details without feedback and return 200', async () => {
            mockRequest.params = { product_code: 'P002' };
            mockedProductRepository.getProductDetail.mockResolvedValue(mockProductWithoutFeedback as any);

            await getProductDetail(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.getProductDetail).toHaveBeenCalledWith('P002');
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseSend).toHaveBeenCalledWith(mockProductWithoutFeedback);
        });

        it('[PC-010] should return 404 if product for detail is not found', async () => {
            mockRequest.params = { product_code: 'P999' };
            mockedProductRepository.getProductDetail.mockResolvedValue(null);

            await getProductDetail(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.getProductDetail).toHaveBeenCalledWith('P999');
            expect(responseStatus).toHaveBeenCalledWith(200); // Controller sends null with 200
            expect(responseSend).toHaveBeenCalledWith(null);
        });

        it('[PC-011] should handle errors during product detail retrieval and return 404', async () => {
            mockRequest.params = { product_code: 'P001' };
            const errorMessage = 'Detail fetch error';
            mockedProductRepository.getProductDetail.mockRejectedValue(new Error(errorMessage));

            await getProductDetail(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // --- addNewProduct Tests ---
    describe('addNewProduct', () => {
        const productData = {
            Code: 'NEW001',
            name: 'New Gadget',
            price: 99.99,
            quantity: 10,
            description: 'A cool new gadget',
            category: 1,
            brand: 1,
            type_product: 1,
            image: 'path/to/image.jpg'
        };

        it('[PC-012] should add a new product and return 201', async () => {
            mockRequest.body = productData;
            mockedProductRepository.addProduct.mockResolvedValue(true);

            await addNewProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.addProduct).toHaveBeenCalledWith(productData);
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Product added successfully.' });
        });

        it('[PC-013] should return 400 if required product data is missing', async () => {
            mockRequest.body = { name: 'Partial Product', price: 10.00 }; // Missing Code and quantity
            await addNewProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.addProduct).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Missing required product data.' });
        });

        it('[PC-014] should return 409 if product already exists or failed to add', async () => {
            mockRequest.body = productData;
            mockedProductRepository.addProduct.mockResolvedValue(false);

            await addNewProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.addProduct).toHaveBeenCalledWith(productData);
            expect(responseStatus).toHaveBeenCalledWith(409);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Product already exists or failed to add.' });
        });

        it('[PC-015] should handle internal server errors during product addition and return 500', async () => {
            mockRequest.body = productData;
            const errorMessage = 'DB insertion failed';
            mockedProductRepository.addProduct.mockRejectedValue(new Error(errorMessage));

            await addNewProduct(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // --- addProductFeedback Tests ---
    describe('addProductFeedback', () => {
        const productCode = 'P001';
        const customerId = 123;
        const feedbackData = {
            rating: 5,
            comment: 'Excellent product!',
            auth_payload: { customer_id: customerId } // Mocking auth_payload from JWT middleware
        };

        it('[PC-016] should add product feedback and return 201', async () => {
            mockRequest.params = { product_code: productCode };
            mockRequest.body = feedbackData;
            mockedProductFeedBackRepositories.addFeedback.mockResolvedValue(true);

            await addProductFeedback(mockRequest as Request, mockResponse as Response);

            expect(mockedProductFeedBackRepositories.addFeedback).toHaveBeenCalledWith(
                productCode, customerId, feedbackData.rating, feedbackData.comment
            );
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Feedback added successfully.' });
        });

        it('[PC-017] should return 401 if customer_id is missing from auth_payload', async () => {
            mockRequest.params = { product_code: productCode };
            mockRequest.body = { rating: 4, comment: 'Good product', auth_payload: {} }; // Missing customer_id

            await addProductFeedback(mockRequest as Request, mockResponse as Response);

            expect(mockedProductFeedBackRepositories.addFeedback).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(401);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Unauthorized: No customer ID found in token.' });
        });

        it('[PC-018] should return 400 for invalid or missing rating', async () => {
            mockRequest.params = { product_code: productCode };
            mockRequest.body = { rating: 'invalid', comment: 'Okay', auth_payload: { customer_id: customerId } };

            await addProductFeedback(mockRequest as Request, mockResponse as Response);

            expect(mockedProductFeedBackRepositories.addFeedback).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid or missing input values' });
        });

        it('[PC-019] should return 400 for invalid or missing comment', async () => {
            mockRequest.params = { product_code: productCode };
            mockRequest.body = { rating: 3, comment: '', auth_payload: { customer_id: customerId } }; // Empty comment

            await addProductFeedback(mockRequest as Request, mockResponse as Response);

            expect(mockedProductFeedBackRepositories.addFeedback).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid or missing input values' });
        });

        it('[PC-020] should handle internal server errors during feedback addition and return 500', async () => {
            mockRequest.params = { product_code: productCode };
            mockRequest.body = feedbackData;
            const errorMessage = 'Feedback DB error';
            mockedProductFeedBackRepositories.addFeedback.mockRejectedValue(new Error(errorMessage));

            await addProductFeedback(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    describe('updateProduct', () => {
        const productCode = 'UPD001';
        const updateData = {
            name: 'Updated Product Name',
            price: 150.00,
            quantity: 50
        };

        it('[PC-021] should update an existing product and return 200', async () => {
            mockRequest.params = { productCode: productCode };
            mockRequest.body = updateData;
            mockedProductRepository.updateProduct.mockResolvedValue(true);

            await updateProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.updateProduct).toHaveBeenCalledWith(productCode, updateData);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Product updated successfully.' });
        });

        it('[PC-022] should return 400 if no update data is provided', async () => {
            mockRequest.params = { productCode: productCode };
            mockRequest.body = {}; // Empty body

            await updateProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.updateProduct).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'No update data provided.' });
        });

        it('[PC-023] should return 404 if product to update is not found or no changes made', async () => {
            mockRequest.params = { productCode: productCode };
            mockRequest.body = updateData;
            mockedProductRepository.updateProduct.mockResolvedValue(false);

            await updateProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepository.updateProduct).toHaveBeenCalledWith(productCode, updateData);
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: `Product with code ${productCode} not found or no changes made.` });
        });

        it('[PC-024] should handle internal server errors during product update and return 500', async () => {
            mockRequest.params = { productCode: productCode };
            mockRequest.body = updateData;
            const errorMessage = 'Update DB error';
            mockedProductRepository.updateProduct.mockRejectedValue(new Error(errorMessage));

            await updateProduct(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
        });
    });
});