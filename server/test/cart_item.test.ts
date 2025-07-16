import { Request, Response } from 'express';
import * as CartController from '../controller/cart.controller'; 
import { CartItemRepository } from '../repositories/cartItem.repository'; 

jest.mock('../repositories/cartItem.repository');

const mockedCartRepo = CartItemRepository as jest.Mocked<typeof CartItemRepository>;

describe('Cart Controller - Unit Tests', () => {
    let mockRequest: Request;
    let mockResponse: Response;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        responseJson = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson });
        mockRequest = { params: {}, body: {} } as Request;
        mockResponse = { status: responseStatus, json: responseJson } as unknown as Response;
    });

    describe('addToCart', () => {
        it('[CC-001] should add an item to the cart and return 200', async () => {
            mockRequest.params.customer_id = '1';
            mockRequest.body = { product_code: 'PROD123', qty: 2, price_at_purchase: 100.00 };
            mockedCartRepo.addToCart.mockResolvedValue(true);
            await CartController.addToCart(mockRequest, mockResponse);
            expect(mockedCartRepo.addToCart).toHaveBeenCalledWith(1, 'PROD123', 2, 100.00);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Item added to cart successfully.' });
        });

        it('[CC-002] should return 400 for invalid input data', async () => {
            mockRequest.params.customer_id = '1';
            mockRequest.body = { product_code: 'PROD123' }; 
            await CartController.addToCart(mockRequest, mockResponse);
            expect(mockedCartRepo.addToCart).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid input data' });
        });
        
        it('[CC-003] should return 500 if the repository throws an error', async () => {
            const errorMessage = 'Database connection failed';
            mockRequest.params.customer_id = '1';
            mockRequest.body = { product_code: 'PROD123', qty: 1, price_at_purchase: 100 };
            mockedCartRepo.addToCart.mockRejectedValue(new Error(errorMessage));
            await CartController.addToCart(mockRequest, mockResponse);
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    describe('getCart', () => {
        it('[CC-004] should retrieve all cart items and return 200', async () => {
            const fakeCartData = [{ product_code: 'PROD123', qty: 5 }];
            mockRequest.params.customer_id = '1';
            mockedCartRepo.getCart.mockResolvedValue(fakeCartData as any);
            await CartController.getCart(mockRequest, mockResponse);
            expect(mockedCartRepo.getCart).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(fakeCartData);
        });

        it('[CC-005] should return 400 for an invalid customer ID', async () => {
            mockRequest.params.customer_id = 'abc'; // Invalid ID
            await CartController.getCart(mockRequest, mockResponse);
            expect(mockedCartRepo.getCart).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid Customer ID' });
        });
    });

    describe('updateQtyCartItem', () => {
        it('[CC-006] should update item quantity and return 200', async () => {
            mockRequest.params.customer_id = '1';
            mockRequest.body = { product_code: 'PROD123', qty: 10 };
            mockedCartRepo.setQuantity.mockResolvedValue(true);
            await CartController.updateQtyCartItem(mockRequest, mockResponse);
            expect(mockedCartRepo.setQuantity).toHaveBeenCalledWith(1, 'PROD123', 10);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Cart item quantity updated successfully.' });
        });

        it('[CC-007] should return 404 if the item to update is not found', async () => {
            mockRequest.params.customer_id = '1';
            mockRequest.body = { product_code: 'PROD-NOT-EXIST', qty: 10 };
            mockedCartRepo.setQuantity.mockResolvedValue(false); 
            await CartController.updateQtyCartItem(mockRequest, mockResponse);
            expect(mockedCartRepo.setQuantity).toHaveBeenCalledWith(1, 'PROD-NOT-EXIST', 10);
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Cart item not found.' });
        });
    });

    describe('removeCartItem', () => {
        it('[CC-008] should remove an item and return 200', async () => {
            mockRequest.params.customer_id = '1';
            mockRequest.body = { product_code: 'PROD123' };
            mockedCartRepo.remove.mockResolvedValue(true);
            await CartController.removeCartItem(mockRequest, mockResponse);
            expect(mockedCartRepo.remove).toHaveBeenCalledWith(1, 'PROD123');
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Cart item removed successfully.' });
        });

        it('[CC-009] should return 404 if the item to remove is not found', async () => {
            mockRequest.params.customer_id = '1';
            mockRequest.body = { product_code: 'PROD-NOT-EXIST' };
            mockedCartRepo.remove.mockResolvedValue(false); 
            await CartController.removeCartItem(mockRequest, mockResponse);
            expect(mockedCartRepo.remove).toHaveBeenCalledWith(1, 'PROD-NOT-EXIST');
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Cart item not found.' });
        });
    });
});