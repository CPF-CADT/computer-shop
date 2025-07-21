// test/orders.test.ts
import { Request, Response } from 'express';
import { Op, QueryTypes } from 'sequelize'; // Import Op and QueryTypes for mocking
import { OrderStatus } from '../db/models/Enums'; // Adjust path if necessary

jest.mock('../db/sequelize', () => {
    const mockSequelizeFn = jest.fn((func, col) => ({
        _is        : 'sequelize.fn',
        fn         : func,
        args       : [col],
        as         : undefined,
        toString   : () => `${func}(${col})`
    }));

    const mockSequelizeCol = jest.fn(colName => ({
        _is        : 'sequelize.col',
        col        : colName,
        toString   : () => colName
    }));

    return {
        sequelize: {
            query: jest.fn(),
            fn: mockSequelizeFn,
            col: mockSequelizeCol,
        },
    };
});
jest.mock('../db/models/Orders', () => ({
    Orders: {
        count: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
}));
jest.mock('../db/models/Customer', () => ({ Customer: {} }));
jest.mock('../db/models/Address', () => ({ Address: {} }));
jest.mock('../db/models/Product', () => ({ Product: {} }));
jest.mock('../db/models/OrderItem', () => ({ OrderItem: {} }));


// Import the controller functions AFTER mocks are set up
import {
    getOrders,
    getOrdersByCustomerId,
    getOrderById,
    getOrderSummary,
    updateOrderStatus
} from '../controller/orders.controller'; // Adjust path if necessary

// Get the mocked modules
const mockedOrdersModel = require('../db/models/Orders').Orders as jest.Mocked<any>;
const mockedCustomerModel = require('../db/models/Customer').Customer as jest.Mocked<any>;
const mockedAddressModel = require('../db/models/Address').Address as jest.Mocked<any>;
const mockedProductModel = require('../db/models/Product').Product as jest.Mocked<any>;
const mockedOrderItemModel = require('../db/models/OrderItem').OrderItem as jest.Mocked<any>;
const mockedSequelize = require('../db/sequelize').sequelize as jest.Mocked<any>;


describe('Orders Controller - Unit Tests', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;

    // --- Fixed date for consistent testing ---
    const MOCK_DATE = new Date('2025-07-21T07:14:02.096Z'); // Fixed date for all tests

    beforeEach(() => {
        jest.clearAllMocks();
        responseJson = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson });
        mockRequest = { query: {}, params: {}, body: {} };
        mockResponse = { status: responseStatus, json: responseJson };

        // Default mock implementations for common model methods
        mockedOrdersModel.count.mockResolvedValue(100); // For getOrders and getOrderSummary
        mockedOrdersModel.findAll.mockResolvedValue([]); // Default empty array
        mockedOrdersModel.findByPk.mockResolvedValue(null); // Default null for findByPk
    });

    // --- getOrders Tests ---
    describe('getOrders', () => {
        const mockOrderData = [
            {
                order_id: 1,
                order_date: MOCK_DATE, // Use the fixed mock date
                order_status: OrderStatus.PENDING,
                customer: { name: 'John Doe', phone_number: '12345' },
                address: { street_line: '123 Main St', district: 'DP', province: 'PP' },
                toJSON: () => ({ // Ensure toJSON also returns the fixed date string
                    order_id: 1,
                    order_date: MOCK_DATE.toISOString(),
                    order_status: OrderStatus.PENDING,
                    customer: { name: 'John Doe', phone_number: '12345' },
                    address: { street_line: '123 Main St', district: 'DP', province: 'PP' },
                }),
            },
        ];

        it('[OC-001] should retrieve all orders with default parameters and return 200', async () => {
            mockedOrdersModel.findAll.mockResolvedValue(mockOrderData);
            mockedSequelize.query.mockResolvedValue([{ order_id: 1, totalMoney: 150 }]);

            await getOrders(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.count).toHaveBeenCalledTimes(1);
            expect(mockedOrdersModel.findAll).toHaveBeenCalledWith({
                include: [
                    { model: mockedCustomerModel, attributes: ['name', 'phone_number'] },
                    { model: mockedAddressModel, attributes: ['street_line', 'district', 'province'] },
                ],
                order: [['order_date', 'ASC']],
                limit: 10,
                offset: 0,
            });
            expect(mockedSequelize.query).toHaveBeenCalledTimes(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                meta: { totalItems: 100, page: 1, totalPages: 10 },
                data: [{ ...mockOrderData[0].toJSON(), totalMoney: 150 }],
            });
        });

        it('[OC-002] should retrieve orders with sorting and include items and return 200', async () => {
            mockRequest.query = { sortBy: 'price', sortType: 'DESC', includeItems: 'true', page: '1', limit: '5' };
            const mockOrderDataWithItems = [
                {
                    order_id: 2,
                    order_date: MOCK_DATE, // Use the fixed mock date
                    order_status: OrderStatus.DELIVERED,
                    customer: { name: 'Jane Doe', phone_number: '54321' },
                    address: { street_line: '456 Oak Ave', district: 'PP', province: 'PP' },
                    items: [
                        { product_code: 'P001', name: 'Prod A', OrderItem: { qty: 1, price_at_purchase: 100 } }
                    ],
                    toJSON: () => ({ // Ensure toJSON also returns the fixed date string
                        order_id: 2,
                        order_date: MOCK_DATE.toISOString(),
                        order_status: OrderStatus.DELIVERED,
                        customer: { name: 'Jane Doe', phone_number: '54321' },
                        address: { street_line: '456 Oak Ave', district: 'PP', province: 'PP' },
                        items: [
                            { product_code: 'P001', name: 'Prod A', OrderItem: { qty: 1, price_at_purchase: 100 } }
                        ],
                    }),
                },
            ];
            mockedOrdersModel.findAll.mockResolvedValue(mockOrderDataWithItems);
            mockedSequelize.query.mockResolvedValue([{ order_id: 2, totalMoney: 100 }]);
            mockedOrdersModel.count.mockResolvedValue(50); // Simulate different total

            await getOrders(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findAll).toHaveBeenCalledWith({
                include: [
                    { model: mockedCustomerModel, attributes: ['name', 'phone_number'] },
                    { model: mockedAddressModel, attributes: ['street_line', 'district', 'province'] },
                    {
                        model: mockedProductModel,
                        attributes: ['product_code', 'name'],
                        through: { attributes: ['qty', 'price_at_purchase'] },
                    },
                ],
                order: [['total_price', 'DESC']],
                limit: 5,
                offset: 0,
            });
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                meta: { totalItems: 50, page: 1, totalPages: 10 },
                data: [{ ...mockOrderDataWithItems[0].toJSON(), totalMoney: 100 }],
            });
        });

        it('[OC-003] should return 200 with empty data if no orders are found', async () => {
            mockedOrdersModel.findAll.mockResolvedValue([]);
            mockedSequelize.query.mockResolvedValue([]); // No order totals
            mockedOrdersModel.count.mockResolvedValue(0);

            await getOrders(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                meta: { totalItems: 0, page: 1, totalPages: 0 },
                data: [],
            });
        });

        it('[OC-004] should handle errors during order retrieval and return 500', async () => {
            const errorMessage = 'Database error fetching orders';
            mockedOrdersModel.findAll.mockRejectedValue(new Error(errorMessage));

            await getOrders(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Failed to fetch orders' });
        });
    });

    // --- getOrdersByCustomerId Tests ---
    describe('getOrdersByCustomerId', () => {
        const mockCustomerOrders = [
            {
                order_id: 101,
                order_date: MOCK_DATE,
                order_status: OrderStatus.DELIVERED,
                address: { street_line: 'Customer St', district: 'DP', province: 'PP' },
                customer: { name: 'Test Customer' },
                items: [{ product_code: 'PROD1', name: 'Item One', OrderItem: { qty: 1, price_at_purchase: 10 } }],
            },
        ];

        it('[OC-005] should retrieve orders for a specific customer and return 200', async () => {
            mockRequest.params = { customer_id: '1' };
            // First call to findAll for order_ids
            mockedOrdersModel.findAll.mockResolvedValueOnce([{ order_id: 101 }, { order_id: 102 }]);
            // Second call to findAll for full order data
            mockedOrdersModel.findAll.mockResolvedValueOnce(mockCustomerOrders);

            await getOrdersByCustomerId(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findAll).toHaveBeenNthCalledWith(1, {
                where: { customer_id: 1 },
                attributes: ['order_id']
            });
            expect(mockedOrdersModel.findAll).toHaveBeenNthCalledWith(2, {
                where: {
                    order_id: {
                        [Op.in]: [101, 102]
                    }
                },
                include: [
                    { model: mockedCustomerModel, attributes: ['name'] },
                    { model: mockedAddressModel, attributes: ['street_line', 'district', 'province'] },
                    {
                        model: mockedProductModel,
                        attributes: ['product_code', 'name'],
                        through: { attributes: ['qty', 'price_at_purchase'] },
                    },
                ],
            });
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockCustomerOrders);
        });

        it('[OC-006] should return 400 for an invalid customer ID', async () => {
            mockRequest.params = { customer_id: 'abc' };

            await getOrdersByCustomerId(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findAll).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid customer ID' });
        });

        it('[OC-007] should return 404 if no orders are found for the customer', async () => {
            mockRequest.params = { customer_id: '999' };
            mockedOrdersModel.findAll.mockResolvedValueOnce([]); // No order_ids found

            await getOrdersByCustomerId(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findAll).toHaveBeenCalledWith({
                where: { customer_id: 999 },
                attributes: ['order_id']
            });
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: 'No orders found for this customer' });
        });

        it('[OC-008] should handle errors during customer order retrieval and return 500', async () => {
            mockRequest.params = { customer_id: '1' };
            const errorMessage = 'DB error fetching customer orders';
            mockedOrdersModel.findAll.mockRejectedValue(new Error(errorMessage));

            await getOrdersByCustomerId(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Failed to fetch orders' });
        });
    });

    // --- getOrderById Tests ---
    describe('getOrderById', () => {
        const mockSingleOrder = {
            order_id: 1,
            order_date: MOCK_DATE,
            order_status: OrderStatus.PENDING,
            customer: { name: 'Single Order Cust', phone_number: '111222' },
            address: { street_line: 'Single St', district: 'SingleD', province: 'SingleP' },
            items: [
                { product_code: 'P-ABC', name: 'Product ABC', OrderItem: { qty: 1, price_at_purchase: 50 } }
            ],
        };

        it('[OC-009] should retrieve a single order by ID and return 200', async () => {
            mockRequest.params = { id: '1' };
            mockedOrdersModel.findByPk.mockResolvedValue(mockSingleOrder);

            await getOrderById(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findByPk).toHaveBeenCalledWith(1, {
                include: [
                    { model: mockedCustomerModel, attributes: ['name', 'phone_number'] },
                    { model: mockedAddressModel, attributes: ['street_line', 'district', 'province'] },
                    {
                        model: mockedProductModel,
                        attributes: ['product_code', 'name'],
                        through: { attributes: ['qty', 'price_at_purchase'] },
                    },
                ],
            });
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockSingleOrder);
        });

        it('[OC-010] should return 400 for an invalid order ID', async () => {
            mockRequest.params = { id: 'invalid' };

            await getOrderById(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findByPk).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid order ID' });
        });

        it('[OC-011] should return 404 if the order is not found', async () => {
            mockRequest.params = { id: '999' };
            mockedOrdersModel.findByPk.mockResolvedValue(null);

            await getOrderById(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findByPk).toHaveBeenCalledWith(999, expect.any(Object));
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Order not found' });
        });

        it('[OC-012] should handle errors during single order retrieval and return 500', async () => {
            mockRequest.params = { id: '1' };
            const errorMessage = 'DB error fetching single order';
            mockedOrdersModel.findByPk.mockRejectedValue(new Error(errorMessage));

            await getOrderById(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Failed to fetch order' });
        });
    });

    // --- getOrderSummary Tests ---
   describe('getOrderSummary', () => {
        it('[OC-013] should return order summary with total orders and status counts', async () => {
            mockedOrdersModel.findAll.mockResolvedValueOnce([
                { order_status: OrderStatus.PENDING, dataValues: { count: '10' } },
                { order_status: OrderStatus.PROCESSING, dataValues: { count: '15' } },
                { order_status: OrderStatus.DELIVERED, dataValues: { count: '20' } },
            ]);
            mockedOrdersModel.count.mockResolvedValueOnce(45); // Total count from previous mock

            await getOrderSummary(mockRequest as Request, mockResponse as Response);

            // Corrected: Use expect.any(Object) for the complex sequelize function parts
            const expectedAttributes = [
                'order_status',
                [
                    // This tells Jest to expect an object here,
                    // without strictly checking its internal function references or `toString` outputs.
                    expect.objectContaining({
                        _is: 'sequelize.fn',
                        fn: 'COUNT',
                        args: [
                            expect.objectContaining({ // Also for sequelize.col
                                _is: 'sequelize.col',
                                col: 'order_status'
                            })
                        ]
                    }),
                    'count'
                ]
            ];


            expect(mockedOrdersModel.findAll).toHaveBeenCalledWith({
                attributes: expectedAttributes,
                group: ['order_status'],
            });
            expect(mockedOrdersModel.count).toHaveBeenCalledTimes(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                totalOrders: 45,
                counts: {
                    [OrderStatus.PENDING]: 10,
                    [OrderStatus.PROCESSING]: 15,
                    [OrderStatus.DELIVERED]: 20,
                    [OrderStatus.CANCELLED]: 0,
                },
            });
        });

        it('[OC-014] should handle cases with no orders and return 0 counts', async () => {
            mockedOrdersModel.findAll.mockResolvedValueOnce([]); // No status counts
            mockedOrdersModel.count.mockResolvedValueOnce(0); // No total orders

            await getOrderSummary(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                totalOrders: 0,
                counts: {
                    [OrderStatus.PENDING]: 0,
                    [OrderStatus.PROCESSING]: 0,
                    [OrderStatus.DELIVERED]: 0,
                    [OrderStatus.CANCELLED]: 0,
                },
            });
        });

        it('[OC-015] should handle errors during order summary retrieval and return 500', async () => {
            const errorMessage = 'DB error fetching summary';
            mockedOrdersModel.findAll.mockRejectedValue(new Error(errorMessage));

            await getOrderSummary(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Failed to fetch order summary' });
        });
    });

    // --- updateOrderStatus Tests ---
    describe('updateOrderStatus', () => {
        const mockOrderToUpdate = {
            order_id: 1,
            order_status: OrderStatus.PENDING,
            save: jest.fn().mockResolvedValue(true), // Mock the save method
        };

        it('[OC-016] should update order status successfully and return 200', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { order_status: OrderStatus.DELIVERED };
            mockedOrdersModel.findByPk.mockResolvedValue(mockOrderToUpdate);

            await updateOrderStatus(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findByPk).toHaveBeenCalledWith(1);
            // The order_status on the mock object should be updated
            expect(mockOrderToUpdate.order_status).toBe(OrderStatus.DELIVERED);
            expect(mockOrderToUpdate.save).toHaveBeenCalledTimes(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                message: 'Order status updated successfully',
                order: {
                    order_id: 1,
                    order_status: OrderStatus.DELIVERED,
                },
            });
        });

        it('[OC-017] should return 400 for an invalid order ID', async () => {
            mockRequest.params = { id: 'abc' };
            mockRequest.body = { order_status: OrderStatus.PROCESSING };

            await updateOrderStatus(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findByPk).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid order ID' });
        });

        it('[OC-018] should return 400 for an invalid order status', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { order_status: 'INVALID_STATUS' };

            await updateOrderStatus(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findByPk).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid order status' });
        });

        it('[OC-019] should return 404 if the order to update is not found', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = { order_status: OrderStatus.CANCELLED };
            mockedOrdersModel.findByPk.mockResolvedValue(null);

            await updateOrderStatus(mockRequest as Request, mockResponse as Response);

            expect(mockedOrdersModel.findByPk).toHaveBeenCalledWith(999);
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Order not found' });
        });

        it('[OC-020] should handle errors during order status update and return 500', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { order_status: OrderStatus.DELIVERED };
            const errorMessage = 'DB error during status update';
            mockedOrdersModel.findByPk.mockResolvedValue(mockOrderToUpdate);
            // Reset the save mock to simulate an error
            mockOrderToUpdate.save.mockRejectedValue(new Error(errorMessage));

            await updateOrderStatus(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Failed to update order status' });
        });
    });
});