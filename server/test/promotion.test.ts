import { Request, Response } from 'express';
import * as promotionController from '../controller/promotion.controller';
import { PromotionRepository } from '../repositories/promotion.repository';

jest.mock('../repositories/promotion.repository');

const mockedPromotionRepo = PromotionRepository as jest.Mocked<typeof PromotionRepository>;

describe('Promotion Controller', () => {
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

    mockRequest = {};
    mockResponse = {
      status: responseStatus,
      json: responseJson,
      send: responseSend,
    };
  });

  // createPromotion tests
  describe('createPromotion', () => {
    it('should create promotion and return 201', async () => {
      mockRequest.body = {
        title: 'Summer Sale',
        discount_type: 'percentage',
        discount_value: 10,
        start_date: '2025-07-01',
        end_date: '2025-07-31',
      };
      const fakePromotion = { id: 1, ...mockRequest.body };
      mockedPromotionRepo.createNewPromotion.mockResolvedValue(fakePromotion as any);

      await promotionController.createPromotion(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.createNewPromotion).toHaveBeenCalledWith(expect.objectContaining(mockRequest.body));
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(fakePromotion);
    });

    it('should return 400 if required fields missing', async () => {
      mockRequest.body = { title: 'Sale' }; // incomplete

      await promotionController.createPromotion(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.createNewPromotion).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Missing required promotion fields.' });
    });

    it('should return 500 on repository error', async () => {
      mockRequest.body = {
        title: 'Sale',
        discount_type: 'percentage',
        discount_value: 10,
        start_date: '2025-07-01',
        end_date: '2025-07-31',
      };
      mockedPromotionRepo.createNewPromotion.mockRejectedValue(new Error('DB Error'));

      await promotionController.createPromotion(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('updatePromotion', () => {
    it('should update promotion and return 200', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'Updated Sale' };
      const updatedPromotion = { promotion_id: 1, title: 'Updated Sale' };
      mockedPromotionRepo.updatePromotion.mockResolvedValue(updatedPromotion as any);

      await promotionController.updatePromotion(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.updatePromotion).toHaveBeenCalledWith(1, mockRequest.body);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(updatedPromotion);
    });

    it('should return 400 if promotion ID invalid', async () => {
      mockRequest.params = { id: 'abc' };

      await promotionController.updatePromotion(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.updatePromotion).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid promotion ID.' });
    });

    it('should return 404 if promotion not found', async () => {
      mockRequest.params = { id: '1' };
      mockedPromotionRepo.updatePromotion.mockResolvedValue(null);

      await promotionController.updatePromotion(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Promotion with ID 1 not found.' });
    });

    it('should return 500 on repository error', async () => {
      mockRequest.params = { id: '1' };
      mockedPromotionRepo.updatePromotion.mockRejectedValue(new Error('DB Error'));

      await promotionController.updatePromotion(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('removePromotion', () => {
    it('should delete promotion and return 204', async () => {
      mockRequest.params = { id: '1' };
      mockedPromotionRepo.removePromotion.mockResolvedValue(1);

      await promotionController.removePromotion(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.removePromotion).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(204);
      expect(responseSend).toHaveBeenCalled();
    });

    it('should return 400 if promotion ID invalid', async () => {
      mockRequest.params = { id: 'abc' };

      await promotionController.removePromotion(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.removePromotion).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid promotion ID.' });
    });

    it('should return 404 if promotion not found', async () => {
      mockRequest.params = { id: '1' };
      mockedPromotionRepo.removePromotion.mockResolvedValue(0);

      await promotionController.removePromotion(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Promotion with ID 1 not found.' });
    });

    it('should return 500 on repository error', async () => {
      mockRequest.params = { id: '1' };
      mockedPromotionRepo.removePromotion.mockRejectedValue(new Error('DB Error'));

      await promotionController.removePromotion(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  // applyPromotionToProduct tests
  describe('applyPromotionToProduct', () => {
    it('should apply promotion and return 201 if created', async () => {
      mockRequest.body = { productCode: 'ABC123', promotionId: 1 };
      const fakeAssoc = { id: 1, product_code: 'ABC123', promotion_id: 1 };
      mockedPromotionRepo.applyForProduct.mockResolvedValue([fakeAssoc as any, true]);

      await promotionController.applyPromotionToProduct(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.applyForProduct).toHaveBeenCalledWith('ABC123', 1);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Promotion applied successfully.',
        data: fakeAssoc,
      });
    });

    it('should return 200 if promotion already applied', async () => {
      mockRequest.body = { productCode: 'ABC123', promotionId: 1 };
      const fakeAssoc = { id: 1, product_code: 'ABC123', promotion_id: 1 };
      mockedPromotionRepo.applyForProduct.mockResolvedValue([fakeAssoc as any, false]);

      await promotionController.applyPromotionToProduct(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Promotion was already applied.',
        data: fakeAssoc,
      });
    });

    it('should return 400 if missing fields', async () => {
      mockRequest.body = { productCode: 'ABC123' }; // missing promotionId

      await promotionController.applyPromotionToProduct(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.applyForProduct).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'productCode and promotionId are required.' });
    });

    it('should return 500 on repo error', async () => {
      mockRequest.body = { productCode: 'ABC123', promotionId: 1 };
      mockedPromotionRepo.applyForProduct.mockRejectedValue(new Error('DB Error'));

      await promotionController.applyPromotionToProduct(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  // revokePromotionFromProduct tests
  describe('revokePromotionFromProduct', () => {
    it('should revoke promotion and return 204', async () => {
      mockRequest.params = { promotionId: '1', productCode: 'ABC123' };
      mockedPromotionRepo.revokePromotionForProduct.mockResolvedValue(1);

      await promotionController.revokePromotionFromProduct(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.revokePromotionForProduct).toHaveBeenCalledWith('ABC123', 1);
      expect(responseStatus).toHaveBeenCalledWith(204);
      expect(responseSend).toHaveBeenCalled();
    });

    it('should return 400 if invalid inputs', async () => {
      mockRequest.params = { promotionId: 'abc', productCode: '' };

      await promotionController.revokePromotionFromProduct(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.revokePromotionForProduct).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Valid promotionId and productCode are required in the URL.' });
    });

    it('should return 404 if association not found', async () => {
      mockRequest.params = { promotionId: '1', productCode: 'ABC123' };
      mockedPromotionRepo.revokePromotionForProduct.mockResolvedValue(0);

      await promotionController.revokePromotionFromProduct(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Association between product and promotion not found.' });
    });

    it('should return 500 on repo error', async () => {
      mockRequest.params = { promotionId: '1', productCode: 'ABC123' };
      mockedPromotionRepo.revokePromotionForProduct.mockRejectedValue(new Error('DB Error'));

      await promotionController.revokePromotionFromProduct(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  // deletePromotion tests (alias of removePromotion in your code)
  describe('deletePromotion', () => {
    it('should delete promotion and return 204', async () => {
      mockRequest.params = { id: '1' };
      mockedPromotionRepo.removePromotion.mockResolvedValue(1);

      await promotionController.deletePromotion(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.removePromotion).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(204);
      expect(responseSend).toHaveBeenCalled();
    });

    it('should return 400 if invalid id', async () => {
      mockRequest.params = { id: 'abc' };

      await promotionController.deletePromotion(mockRequest as Request, mockResponse as Response);

      expect(mockedPromotionRepo.removePromotion).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid promotion ID.' });
    });

    it('should return 404 if promotion not found', async () => {
      mockRequest.params = { id: '1' };
      mockedPromotionRepo.removePromotion.mockResolvedValue(0);

      await promotionController.deletePromotion(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Promotion with ID 1 not found.' });
    });

    it('should return 500 on repo error', async () => {
      mockRequest.params = { id: '1' };
      mockedPromotionRepo.removePromotion.mockRejectedValue(new Error('DB Error'));

      await promotionController.deletePromotion(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});
