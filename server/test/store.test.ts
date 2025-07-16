import { Request, Response } from 'express';
import { getCounts } from '../controller/store.infor.controller';
import * as Models from '../db/models';

jest.mock('../db/models'); 

const mockedModels = Models as jest.Mocked<typeof Models>;

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
    it('[STC-001] should return counts for selected tables with status 200', async () => {
      mockRequest.body = { tables: ['Product', 'Orders'] };
      
      (mockedModels.Product.count as jest.Mock).mockResolvedValue(42);
    (mockedModels.Orders.count as jest.Mock).mockResolvedValue(17);

      await getCounts(mockRequest as Request, mockResponse as Response);

      expect(mockedModels.Product.count).toHaveBeenCalled();
      expect(mockedModels.Orders.count).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ Product: 42, Orders: 17 });
    });

    it('[STC-002] should return 400 if tables is missing or empty', async () => {
      mockRequest.body = { tables: [] };

      await getCounts(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'tables must be a non-empty array' });
    });

    it('[STC-003] should return 400 if invalid table name is provided', async () => {
      mockRequest.body = { tables: ['NonExistentTable'] };

      await getCounts(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid table name: NonExistentTable' });
    });

    it('[STC-004] should return 500 on unexpected error', async () => {
      mockRequest.body = { tables: ['Product'] };
      
      (mockedModels.Product.count as jest.Mock).mockRejectedValue(new Error('DB error'));

      await getCounts(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});
