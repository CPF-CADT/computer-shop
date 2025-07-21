import { Request, Response } from 'express';
import { getCounts, getSalesData } from '../controller/store.infor.controller';
import * as Models from '../db/models';
import { sequelize } from '../db/sequelize';

jest.mock('../db/models');
jest.mock('../db/sequelize', () => ({
  sequelize: {
    query: jest.fn(),
  },
}));

const mockedModels = Models as jest.Mocked<typeof Models>;
const mockedSequelize = sequelize as jest.Mocked<typeof sequelize>;

describe('StoreInfo Controller - Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockRequest = {};
    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };
  });

  describe('getCounts', () => {
    it('[STC-001] should return counts for valid tables with status 200', async () => {
      mockRequest.body = { tables: ['Product', 'Orders'] };

      (mockedModels.Product.count as jest.Mock).mockResolvedValue(17);
      (mockedModels.Orders.count as jest.Mock).mockResolvedValue(17);

      await getCounts(mockRequest as Request, mockResponse as Response);

      expect(mockedModels.Product.count).toHaveBeenCalled();
      expect(mockedModels.Orders.count).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ Product: 17, Orders: 17 });
    });

    it('[STC-002] should return 400 if tables is missing or empty', async () => {
      mockRequest.body = { tables: [] };

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

  describe('getSalesData', () => {
    it('[STC-005] should return totalAmount and top 5 selling products', async () => {
      mockRequest.query = {};

      (mockedSequelize.query as jest.Mock).mockImplementation((sql: string, options: any) => {
        if (sql.includes('SUM(qty * price_at_purchase) AS totalAmount')) {
          return Promise.resolve([{ totalAmount: '1000.50' }]);
        }
        return Promise.resolve([
          {
            product_code: 'P001',
            name: 'Product A',
            totalSoldQty: '50',
            totalPriceSold: '500.00',
          },
        ]);
      });

      await getSalesData(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        totalAmount: 1000.5,
        topProducts: [
          {
            product_code: 'P001',
            name: 'Product A',
            totalSoldQty: 50,
            totalPriceSold: 500,
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