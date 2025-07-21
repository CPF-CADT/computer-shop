import { Request, Response } from 'express';
import * as CheckoutController from '../controller/checkout.controller'; 
import { OrderRepositories, PaymentTransactionRepositories } from '../repositories/checkout.repository';
import { AddressRepository } from '../repositories/address.repository'; 
import { Customer, Orders, OrderItem, Address } from '../db/models'; 
import { TelegramBot } from '../service/TelgramBot'; 
import KHQR from '../service/BakongKHQR'; 
import * as TwoFA from '../service/TwoFA'; 

jest.mock('../repositories/checkout.repository');
jest.mock('../repositories/address.repository');
jest.mock('../db/models');
jest.mock('../service/TelgramBot');
jest.mock('../service/BakongKHQR');
jest.mock('../service/TwoFA');

const mockedOrderRepo = OrderRepositories as jest.Mocked<typeof OrderRepositories>;
const mockedPaymentRepo = PaymentTransactionRepositories as jest.Mocked<typeof PaymentTransactionRepositories>;
const mockedAddressRepo = AddressRepository as jest.Mocked<typeof AddressRepository>;
const mockedCustomerModel = Customer as jest.Mocked<typeof Customer>;
const mockedOrdersModel = Orders as jest.Mocked<typeof Orders>;
const mockedOrderItemModel = OrderItem as jest.Mocked<typeof OrderItem>;
const mockedKHQR = KHQR as jest.MockedClass<typeof KHQR>;
const mockedTelegramBot = TelegramBot as jest.MockedClass<typeof TelegramBot>;
const mockedTwoFA = TwoFA as jest.Mocked<typeof TwoFA>;

describe('Checkout Controller - Unit Tests', () => {
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

    describe('placeOrder', () => {
        it('[CO-001] should place an order successfully and return order details', async () => {
            // Updated mockRequest.body to include express_handle
            mockRequest.body = { customer_id: 1, address_id: 1, express_handle: 'VET' }; // Assuming 'VET' is a valid handle
            
            const fakeOrderItems = [
                { order_id: 99, product_code: 'P1', qty: 2, price_at_purchase: 100 },
                { order_id: 99, product_code: 'P2', qty: 1, price_at_purchase: 50 },
            ];
            
            mockedCustomerModel.findByPk.mockResolvedValue({ name: 'Test' } as Customer);
            mockedAddressRepo.getAddressById.mockResolvedValue({} as Address);
            mockedOrderRepo.placeAnOrder.mockResolvedValue(fakeOrderItems as any[]);
            
            await CheckoutController.placeOrder(mockRequest, mockResponse);
            
            expect(mockedOrderRepo.placeAnOrder).toHaveBeenCalledWith(1, 1, 'VET'); 
            
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                order_id: 99,
                amount_pay: 250, // (2*100) + (1*50) = 250
                message: 'Order placed successfully'
            });
        });

        it('[CO-002] should return 400 if the order fails (e.g., missing express_handle)', async () => {
            mockRequest.body = { customer_id: 1, address_id: 1 }; // Missing express_handle
            
            await CheckoutController.placeOrder(mockRequest, mockResponse);
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: "Invalid input data" }); 
        });
        it('[CO-002-2] should return 400 if customer or address IDs are invalid/missing', async () => {
            mockRequest.body = { customer_id: 'abc', address_id: 1, express_handle: 'VET' }; // Invalid customer_id
            await CheckoutController.placeOrder(mockRequest, mockResponse);
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: "Invalid input data" }); 
        });

        it('[CO-002-3] should return 400 if order fails (e.g. no order items returned)', async () => {
            mockRequest.body = { customer_id: 1, address_id: 1, express_handle: 'VET' };
            mockedCustomerModel.findByPk.mockResolvedValue({ name: 'Test' } as Customer);
            mockedAddressRepo.getAddressById.mockResolvedValue({} as Address);
            mockedOrderRepo.placeAnOrder.mockResolvedValue(null); // Simulate failure in repository
            
            await CheckoutController.placeOrder(mockRequest, mockResponse);
            
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: "Order failed. Please check customer, address, or cart items." });
        });
    });

   describe('createQrPayment', () => {
        it('[CO-003] should generate a KHQR string and update transaction status', async () => {
            mockRequest.body = { order_id: 1, amount_pay: 2400.00, typeCurrency: 'USD' };
            
            // CORRECTED: Mock generateBillNumber to return ONLY the raw number part
            mockedTwoFA.generateBillNumber.mockReturnValue('12345'); 
            
            mockedKHQR.prototype.createQR.mockReturnValue('mock_khqr_string');
            mockedKHQR.prototype.generateMD5.mockReturnValue('mock_md5_hash');
            mockedPaymentRepo.updatePaymentStatus.mockResolvedValue(true);
            
            // Mock console.error to prevent it from polluting test output if you have console.error in controller
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            // Mock process.env variables used by KHQR constructor and createQR
            process.env.BAKONG_TOKEN = 'mock_bakong_token';
            process.env.BAKONG_BANK_ACCOUNT = 'mock_bank_account';
            process.env.MERCHANT_NAME = 'mock_merchant_name';
            process.env.MERCHANT_CITY = 'mock_merchant_city';
            process.env.PHONE_NUMBER = 'mock_phone_number';

            await CheckoutController.createQrPayment(mockRequest, mockResponse);
            
            expect(mockedTwoFA.generateBillNumber).toHaveBeenCalled(); // Ensure it was called
            expect(mockedKHQR).toHaveBeenCalledWith('mock_bakong_token'); // Ensure KHQR is instantiated with token
            expect(mockedKHQR.prototype.createQR).toHaveBeenCalledWith({
                bankAccount: 'mock_bank_account',
                merchantName: 'mock_merchant_name',
                merchantCity: 'mock_merchant_city',
                amount: 2400.00, // Should be 2400.00 for USD
                currency: 'USD',
                storeLabel: "ComputerShop",
                phoneNumber: 'mock_phone_number',
                billNumber: 'TRX1', // 'TRX' + orderID.toString()
                terminalLabel: "Online PAY",
                isStatic: false,
            });
            expect(mockedKHQR.prototype.generateMD5).toHaveBeenCalledWith('mock_khqr_string');
            expect(mockedPaymentRepo.updatePaymentStatus).toHaveBeenCalledWith(1, 'Pending');
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                khqr_string: 'mock_khqr_string',
                unique_md5: 'mock_md5_hash',
                order_id: 1,
                amount: 2400.00,
                bill_number: 'BILL12345' // Now this should match
            });
            consoleErrorSpy.mockRestore(); // Restore console.error
        });

        it('[CO-004] should return 400 for an invalid currency type', async () => {
            mockRequest.body = { order_id: 1, amount_pay: 2400, typeCurrency: 'EUR' };
            await CheckoutController.createQrPayment(mockRequest, mockResponse);
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: "Invalid currency type. Must be 'USD' or 'KHR'." });
        });
    });

    describe('checkPayment', () => {
        it('[CO-005] should confirm payment, update status, and send notification if PAID', async () => {
            mockRequest.body = { unique_md5: 'paid_md5_hash', order_id: 99 };
            mockedPaymentRepo.getTransactionByOrderId.mockResolvedValue({ status: 'Pending' } as any);
            mockedKHQR.prototype.checkPayment.mockResolvedValue('PAID');
            mockedPaymentRepo.updatePaymentStatus.mockResolvedValue(true);
            mockedOrdersModel.findByPk.mockResolvedValue({ customer_id: 1, address_id: 1 } as Orders);
            mockedCustomerModel.findByPk.mockResolvedValue({ name: 'Test User', phone_number: '0123' } as Customer);
            mockedAddressRepo.getAddressById.mockResolvedValue({ street_line: 'St 1', district: 'BKK', province: 'PP' } as Address);
            mockedOrderItemModel.findAll.mockResolvedValue([{ product_code: 'P1', price_at_purchase: 1200, qty: 2 }] as any[]);
            await CheckoutController.checkPayment(mockRequest, mockResponse);
            expect(mockedKHQR.prototype.checkPayment).toHaveBeenCalledWith('paid_md5_hash');
            expect(mockedPaymentRepo.updatePaymentStatus).toHaveBeenCalledWith(99, 'Completed');
            expect(mockedTelegramBot).toHaveBeenCalled();
            expect(mockedTelegramBot.prototype.sendOrderNotification).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ payment_status: 'Completed' });
        });

        it('[CO-006] should return Pending status if payment is UNPAID', async () => {
            mockRequest.body = { unique_md5: 'unpaid_md5_hash', order_id: 100 };
            mockedPaymentRepo.getTransactionByOrderId.mockResolvedValue({ status: 'Pending' } as any);
            mockedKHQR.prototype.checkPayment.mockResolvedValue('UNPAID');
            await CheckoutController.checkPayment(mockRequest, mockResponse);
            expect(mockedKHQR.prototype.checkPayment).toHaveBeenCalledWith('unpaid_md5_hash');
            expect(mockedPaymentRepo.updatePaymentStatus).not.toHaveBeenCalled();
            expect(mockedTelegramBot.prototype.sendOrderNotification).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ payment_status: 'Pending' });
        });

        it('[CO-007] should return Completed if transaction is already marked as Completed in DB', async () => {
            mockRequest.body = { unique_md5: 'some_hash', order_id: 101 };
            mockedPaymentRepo.getTransactionByOrderId.mockResolvedValue({ status: 'Completed' } as any);
            await CheckoutController.checkPayment(mockRequest, mockResponse);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                payment_status: 'Completed',
                message: 'This order has already been marked as paid.'
            });
        });
    });
});