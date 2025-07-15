import { Request, Response } from 'express';
import {
    getAllProduct,
    addNewProduct,
    getOneProduct,
    addProductFeedback,
    updateProduct
} from '../controller/product.controller';

import ProductRepository, { ProductFeedBackRepositories } from '../repositories/product.repository';

jest.mock('../repositories/product.repository');

const mockedProductRepo = ProductRepository as jest.Mocked<typeof ProductRepository>;
const mockedFeedbackRepo = ProductFeedBackRepositories as jest.Mocked<typeof ProductFeedBackRepositories>;


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

        mockRequest = {
            params: {},
            query: {},
            body: {},
        };
        mockResponse = {
            status: responseStatus,
            json: responseJson,
            send: responseSend,
        };
    });

    // --- Tests for getAllProduct ---
    describe('getAllProduct', () => {
        it('should call repository with default parameters and return products', async () => {
            const fakeProducts = [{ product_code: 'P1001', name: 'Intel Core i9' }];
            mockedProductRepo.getAllProduct.mockResolvedValue(fakeProducts as any);

            await getAllProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepo.getAllProduct).toHaveBeenCalledWith(undefined, 'asc', 'name', undefined, undefined, undefined, 1, 10);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseSend).toHaveBeenCalledWith(fakeProducts);
        });

        it('should pass filter and pagination parameters to the repository', async () => {
            mockRequest.query = {
                name: 'i7',
                limit: '5',
                page: '2',
                sort: 'desc',
                order_column: 'price'
            };
            mockedProductRepo.getAllProduct.mockResolvedValue([]);

            await getAllProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepo.getAllProduct).toHaveBeenCalledWith('i7', 'desc', 'price', undefined, undefined, undefined, 2, 5);
        });
    });

    // --- Tests for addNewProduct ---
    describe('addNewProduct', () => {
        it('should add a new product and return 201', async () => {
            mockRequest.body = { Code: 'P2001', name: 'AMD Ryzen 7', price: 450 };
            mockedProductRepo.addProduct.mockResolvedValue(true);

            await addNewProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepo.addProduct).toHaveBeenCalledWith(mockRequest.body);
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Product added successfully.' });
        });

        it('should return 400 if required product data is missing', async () => {
            mockRequest.body = { name: 'Incomplete Product' }; // Missing Code and price

            await addNewProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepo.addProduct).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Missing required product data.' });
        });
    });
    
    // --- Tests for getOneProduct ---
    describe('getOneProduct', () => {
        it('should return a single product by its code', async () => {
            const fakeProduct = { product_code: 'P1001', name: 'Intel Core i9' };
            mockRequest.params = { product_code: 'P1001' };
            mockedProductRepo.getOneProduct.mockResolvedValue(fakeProduct as any);

            await getOneProduct(mockRequest as Request, mockResponse as Response);

            expect(mockedProductRepo.getOneProduct).toHaveBeenCalledWith('P1001');
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseSend).toHaveBeenCalledWith(fakeProduct);
        });

        it('should return the repository response even if it is empty/falsy', async () => {
            mockRequest.params = { product_code: 'P9999' };
            mockedProductRepo.getOneProduct.mockResolvedValue(null as any);

            await getOneProduct(mockRequest as Request, mockResponse as Response);
            
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseSend).toHaveBeenCalledWith(null);
        });
    });

    // --- Tests for addProductFeedback ---
    describe('addProductFeedback', () => {
        it('should add feedback for an authenticated user', async () => {
            mockRequest.params = { product_code: 'P1001' };
            mockRequest.body = {
                rating: '5',
                comment: 'Excellent performance!',
                // Simulate the JWT middleware adding the auth payload
                auth_payload: { customer_id: 1 } 
            };
            mockedFeedbackRepo.addFeedback.mockResolvedValue(true);

            await addProductFeedback(mockRequest as Request, mockResponse as Response);

            expect(mockedFeedbackRepo.addFeedback).toHaveBeenCalledWith('P1001', 1, 5, 'Excellent performance!');
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Feedback added successfully.' });
        });

        it('should return 400 for invalid feedback data', async () => {
            mockRequest.params = { product_code: 'P1001' };
            mockRequest.body = {
                // Missing rating and comment
                auth_payload: { customer_id: 1 }
            };

            await addProductFeedback(mockRequest as Request, mockResponse as Response);

            expect(mockedFeedbackRepo.addFeedback).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid or missing input values' });
        });

        it('should return 401 if user is not authenticated (no auth_payload)', async () => {
            mockRequest.params = { product_code: 'P1001' };
            mockRequest.body = { // Missing auth_payload
                rating: '5',
                comment: 'This should fail.'
            };

            await addProductFeedback(mockRequest as Request, mockResponse as Response);

            expect(mockedFeedbackRepo.addFeedback).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(401);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Unauthorized: No customer ID found in token.' });
        });
    });

    describe('updateProduct', () => {
        it('should update a product and return 200', async () => {
            // Arrange
            const productCode = 'P1001';
            const updateData = { name: 'Intel Core i9 Gen 12', price: 600 };
            mockRequest.params = { productCode };
            mockRequest.body = updateData;
            mockedProductRepo.updateProduct.mockResolvedValue(true);

            // Act
            await updateProduct(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedProductRepo.updateProduct).toHaveBeenCalledWith(productCode, updateData);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Product updated successfully.' });
        });

        it('should return 404 if product to update is not found', async () => {
            // Arrange
            const productCode = 'P9999';
            const updateData = { name: 'Non-existent product' };
            mockRequest.params = { productCode };
            mockRequest.body = updateData;
            mockedProductRepo.updateProduct.mockResolvedValue(false);

            // Act
            await updateProduct(mockRequest as Request, mockResponse as Response);
            
            // Assert
            expect(mockedProductRepo.updateProduct).toHaveBeenCalledWith(productCode, updateData);
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: `Product with code ${productCode} not found or no changes made.` });
        });

        it('should return 400 if the update data is empty', async () => {
            // Arrange
            const productCode = 'P1001';
            mockRequest.params = { productCode };
            mockRequest.body = {}; 

            // Act
            await updateProduct(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedProductRepo.updateProduct).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'No update data provided.' });
        });
    });

});