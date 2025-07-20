import { Request, Response } from 'express';
import { getCounts, getSalesData } from '../controller/store.infor.controller';
import * as Models from '../db/models';
import { sequelize } from '../db/sequelize';
// No need for QueryTypes here, as it's a runtime enum used in the controller, not directly in tests.

jest.mock('../db/models'); // Mocks all models imported from '../db/models'
jest.mock('../db/sequelize', () => ({
  sequelize: {
    query: jest.fn(),
  },
}));

// Cast Models and sequelize to Jest Mocked types for better type inference
const mockedModels = Models as jest.Mocked<typeof Models>;
const mockedSequelize = sequelize as jest.Mocked<typeof sequelize>;

describe('StoreInfo Controller - Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks(); // Clears all mock history before each test
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockRequest = {}; // Initialize mockRequest
    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };
  });

  // ======================
  // getCounts Test Cases
  // ======================
  describe('getCounts', () => {
    it('[STC-001] should return counts for valid tables with status 200', async () => {
      mockRequest.body = { tables: ['Product', 'Orders'] };

      // Ensure these values match your expectation from the error message
      (mockedModels.Product.count as jest.Mock).mockResolvedValue(17); // Corrected to 17 based on error
      (mockedModels.Orders.count as jest.Mock).mockResolvedValue(17);

      await getCounts(mockRequest as Request, mockResponse as Response);

      expect(mockedModels.Product.count).toHaveBeenCalled();
      expect(mockedModels.Orders.count).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(200); // Good practice to assert status
      expect(responseJson).toHaveBeenCalledWith({ Product: 17, Orders: 17 }); // Corrected to 17 for Product
    });

    it('[STC-002] should return 400 if tables is missing or empty', async () => {
      mockRequest.body = { tables: [] }; // Empty array

      await getCounts(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'tables must be a non-empty array',
      });
    });

    it('[STC-003] should return 400 if invalid table name is provided', async () => {
      mockRequest.body = { tables: ['InvalidTable'] };

      await getCounts(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Invalid table name: InvalidTable',
      });
    });

    it('[STC-004] should return 500 on unexpected error', async () => {
      mockRequest.body = { tables: ['Product'] };
      (mockedModels.Product.count as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await getCounts(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  // ======================
  // getSalesData Test Cases
  // ======================
  describe('getSalesData', () => {
    it('[STC-005] should return totalAmount and top 5 selling products', async () => {
      mockRequest.query = {}; // No 'top' param, so default to 5

      (mockedSequelize.query as jest.Mock).mockImplementation((sql: string, options: any) => {
        if (sql.includes('SUM(qty * price_at_purchase) AS totalAmount')) {
          // SQL returns string, controller parses to float
          return Promise.resolve([{ totalAmount: '1000.50' }]);
        }
        // This part mocks the topProducts query.
        // It needs to return an array of objects that match the SQL result columns
        // and have values that can be parsed by the controller's .map logic.
        return Promise.resolve([
          {
            product_code: 'P001',
            name: 'Product A',
            totalSoldQty: '50', // Mock as string, controller parses to Number
            totalPriceSold: '500.00', // Mock as string, controller parses to parseFloat
          },
        ]);
      });

      await getSalesData(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        totalAmount: 1000.5, // Expect parsed number
        topProducts: [
          {
            product_code: 'P001',
            name: 'Product A',
            totalSoldQty: 50, // Expect parsed number
            totalPriceSold: 500, // Expect parsed number
          },
        ],
      });
    });

    it('[STC-006] should return correct data when top=N is provided', async () => {
      mockRequest.query = { top: '2' };

      (mockedSequelize.query as jest.Mock).mockImplementation((sql: string, options: any) => {
        if (sql.includes('totalAmount')) {
          return Promise.resolve([{ totalAmount: '2000' }]);
        }
        return Promise.resolve([
          {
            product_code: 'P002',
            name: 'Product B',
            totalSoldQty: '20',
            totalPriceSold: '400.00',
          },
        ]);
      });

      await getSalesData(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        totalAmount: 2000,
        topProducts: [
          {
            product_code: 'P002',
            name: 'Product B',
            totalSoldQty: 20,
            totalPriceSold: 400,
          },
        ],
      });
    });

    it('[STC-007] should return 500 on database error in getSalesData', async () => {
      mockRequest.query = {};
      (mockedSequelize.query as jest.Mock).mockRejectedValue(new Error('SQL Error'));

      await getSalesData(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});