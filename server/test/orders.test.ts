import { Request, Response } from 'express';
import * as orderController from '../controller/orders.controller'; // Adjust path if needed
import { Orders } from '../db/models/Orders'; // Still needed for the 'typeof Orders' cast

// IMPORTANT: This Jest mock setup directly replaces the 'Orders' module.
// It provides mock functions for static methods (findByPk, findAll, count).
// For instance methods (save, toJSON), they will be part of the objects
// returned by the mocked static methods.
jest.mock('../db/models/Orders', () => ({
  // The 'Orders' property here corresponds to the named export 'Orders'
  Orders: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    // Add other static methods your controller might call (e.g., create, update, destroy)
  },
}));

// Mock the sequelize instance itself, as it's used for raw queries
jest.mock('../db/sequelize', () => ({
  sequelize: {
    query: jest.fn(),
    fn: jest.fn(), // If your controller uses sequelize.fn, keep it.
    col: jest.fn()  // If your controller uses sequelize.col, keep it.
  }
}));

// We still cast Orders to JestMocked type for better type inference on mock functions
const mockedOrders = Orders as jest.Mocked<typeof Orders>;

describe('Order Controller - Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks(); // Clears all mock history before each test
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockRequest = { body: {}, params: {}, query: {} };
    mockResponse = { status: responseStatus, json: responseJson };
  });

  describe('getOrders', () => {
    it('[OR-001] should return paginated orders with totalMoney and 200 status', async () => {
      mockRequest.query = { page: '1', limit: '2', sortBy: 'date', sortType: 'ASC', includeItems: 'false' };

      // Mock objects returned by findAll don't need to be instances of Model
      // Just ensure they have the properties your controller accesses
      const mockOrdersData = [
        {
          order_id: 1,
          order_date: '2025-07-16',
          order_status: 'PENDING',
          // Add toJSON if your controller implicitly or explicitly calls it on the result of findAll
          toJSON: jest.fn().mockImplementation(function (this: any) {
            return { order_id: this.order_id, order_date: this.order_date, order_status: this.order_status };
          })
        },
        {
          order_id: 2,
          order_date: '2025-07-17',
          order_status: 'PROCESSING',
          toJSON: jest.fn().mockImplementation(function (this: any) {
            return { order_id: this.order_id, order_date: this.order_date, order_status: this.order_status };
          })
        }
      ];

      mockedOrders.count.mockResolvedValue(3);
      // Casting to 'any' here as the mock data does not fully conform to Model<any, any>[]
      mockedOrders.findAll.mockResolvedValue(mockOrdersData as any);

      const sequelizeQueryMock = require('../db/sequelize').sequelize.query;
      sequelizeQueryMock.mockResolvedValue([
        { order_id: 1, totalMoney: 100 },
        { order_id: 2, totalMoney: 150 }
      ]);

      await orderController.getOrders(mockRequest as Request, mockResponse as Response);

      expect(mockedOrders.count).toHaveBeenCalled();
      expect(mockedOrders.findAll).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        meta: expect.objectContaining({ totalItems: 3, page: 1, totalPages: 2 }),
        data: expect.any(Array)
      }));
    });
  });

  describe('getOrdersByCustomerId', () => {
    it('[OR-003] should return 400 if customer_id param is invalid', async () => {
      mockRequest.params = { customer_id: 'abc' };

      await orderController.getOrdersByCustomerId(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid customer ID' });
    });

    it('[OR-004] should return 404 if no orders found for customer', async () => {
      mockRequest.params = { customer_id: '1' };
      mockedOrders.findAll.mockResolvedValue([]); // Empty array is assignable

      await orderController.getOrdersByCustomerId(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'No orders found for this customer' });
    });

    it('[OR-005] should return 200 and orders for valid customer', async () => {
      mockRequest.params = { customer_id: '1' };

      mockedOrders.findAll.mockResolvedValueOnce([
        { order_id: 1 }
      ] as any); // Cast here as it's a minimal object, not a full Model instance

      mockedOrders.findAll.mockResolvedValueOnce([
        {
          order_id: 1,
          customer: {}, // Mock related objects if the controller accesses their properties
          address: {},
          items: [],
          toJSON: jest.fn().mockImplementation(function (this: any) {
            return { order_id: this.order_id, customer: this.customer, address: this.address, items: this.items };
          })
        },
      ] as any); // Cast here too

      await orderController.getOrdersByCustomerId(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(expect.any(Array));
    });

    it('[OR-006] should handle errors and return 500 status', async () => {
      mockRequest.params = { customer_id: '1' };
      mockedOrders.findAll.mockRejectedValue(new Error('DB failure'));

      await orderController.getOrdersByCustomerId(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Failed to fetch orders' });
    });
  });

  describe('getOrderById', () => {
    it('[OR-007] should return 400 for invalid order id', async () => {
      mockRequest.params = { id: 'abc' };

      await orderController.getOrderById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid order ID' });
    });

    it('[OR-008] should return 404 if order not found', async () => {
      mockRequest.params = { id: '1' };
      mockedOrders.findByPk.mockResolvedValue(null);

      await orderController.getOrderById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Order not found' });
    });

    it('[OR-009] should return 200 and order details if found', async () => {
      mockRequest.params = { id: '1' };
      const mockOrderInstance = {
        order_id: 1,
        order_status: 'PENDING',
        // Assuming toJSON is called by the controller if it's sending a Sequelize instance
        toJSON: jest.fn().mockImplementation(function (this: any) {
          return { order_id: this.order_id, order_status: this.order_status };
        }),
      };
      // Cast here for the single instance
      mockedOrders.findByPk.mockResolvedValue(mockOrderInstance as any);

      await orderController.getOrderById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({ order_id: 1 }));
      // This assertion is conditional. If your controller does NOT explicitly call .toJSON(), remove it.
      // Based on typical Express behavior with Sequelize, .toJSON() is often implicitly called.
      expect(mockOrderInstance.toJSON).toHaveBeenCalled();
    });

    it('[OR-010] should handle errors and return 500 status', async () => {
      mockRequest.params = { id: '1' };
      mockedOrders.findByPk.mockRejectedValue(new Error('DB failure'));

      await orderController.getOrderById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Failed to fetch order' });
    });
  });

  describe('getOrderSummary', () => {
    it('[OR-011] should return order counts summary', async () => {
      // Sequelize's aggregate results often come with a `dataValues` property
      const mockRawCounts = [
        { order_status: 'PENDING', dataValues: { count: 5 } },
        { order_status: 'DELIVERED', dataValues: { count: 3 } }
      ];
      // Cast here as these are plain objects with dataValues, not full Model instances
      mockedOrders.findAll.mockResolvedValue(mockRawCounts as any);
      mockedOrders.count.mockResolvedValue(8);

      await orderController.getOrderSummary(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        totalOrders: 8,
        counts: expect.objectContaining({
          // Adjust these keys if your controller transforms them (e.g., to 'Pending', 'Delivered')
          PENDING: 5,
          DELIVERED: 3,
          PROCESSING: 0,
          CANCELLED: 0,
        }),
      });
    });

    it('[OR-012] should handle errors and return 500 status', async () => {
      mockedOrders.findAll.mockRejectedValue(new Error('DB failure'));

      await orderController.getOrderSummary(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Failed to fetch order summary' });
    });
  });

  describe('updateOrderStatus', () => {
    it('[OR-013] should return 400 for invalid order ID', async () => {
      mockRequest.params = { id: 'abc' }; // This should trigger the 400 'Invalid order ID'
      mockRequest.body = { order_status: 'DELIVERED' };

      await orderController.updateOrderStatus(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid order ID' });
    });

    it('[OR-014] should return 400 for invalid order status', async () => {
      mockRequest.params = { id: '1' }; // Valid ID format
      mockRequest.body = { order_status: 'INVALID_STATUS' }; // This should trigger the 400 'Invalid order status'

      await orderController.updateOrderStatus(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid order status' });
    });

    it('[OR-015] should return 404 if order not found', async () => {
      mockRequest.params = { id: '1' }; // Valid ID format
      mockRequest.body = { order_status: 'DELIVERED' }; // Valid status
      mockedOrders.findByPk.mockResolvedValue(null); // Simulate order not found

      await orderController.updateOrderStatus(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Order not found' });
    });

    it('[OR-016] should update order status and return 200', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { order_status: 'DELIVERED' };

      const mockOrderInstance = {
        order_id: 1,
        order_status: 'PENDING', // Initial status before update
        save: jest.fn().mockImplementation(function (this: any) {
          // Simulate update: change the status on the mock object itself
          this.order_status = mockRequest.body.order_status;
          return Promise.resolve(this); // save() typically resolves with the instance itself
        }),
        toJSON: jest.fn().mockImplementation(function (this: any) {
          // toJSON should reflect the current state of the mock object
          return { order_id: this.order_id, order_status: this.order_status };
        }),
      };
      // Cast here as this is a plain object acting as a Model instance
      mockedOrders.findByPk.mockResolvedValue(mockOrderInstance as any);

      await orderController.updateOrderStatus(mockRequest as Request, mockResponse as Response);

      expect(mockOrderInstance.save).toHaveBeenCalled();
      expect(mockOrderInstance.order_status).toBe('DELIVERED'); // Assert that the mock object's status was updated
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Order status updated successfully',
        order: { order_id: 1, order_status: 'DELIVERED' }, // Ensure the response reflects the updated status
      });
      expect(mockOrderInstance.toJSON).toHaveBeenCalled();
    });

    it('[OR-017] should handle errors and return 500 status', async () => {
      mockRequest.params = { id: '1' }; // Valid ID format
      mockRequest.body = { order_status: 'DELIVERED' }; // Valid status
      mockedOrders.findByPk.mockRejectedValue(new Error('DB failure')); // Simulate DB error

      await orderController.updateOrderStatus(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Failed to update order status' });
    });
  });
});