import { Request, Response } from 'express';
import { createStaff, getAllStaff, getStaffById, updateStaff, deactivateStaff } from '../controller/staff.controller';
import { StaffRepository } from '../repositories/staff.repository';
import { Staff } from '../db/models/Staff';

jest.mock('../repositories/staff.repository');

const mockedStaffRepo = StaffRepository as jest.Mocked<typeof StaffRepository>;

describe('Staff Controller - Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let responseSend: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson, send: responseSend });
    responseSend = jest.fn().mockReturnValue({});
    mockRequest = {};
    mockResponse = {
      status: responseStatus,
      json: responseJson,
      send: responseSend,
    };
  });

  describe('createStaff', () => {
    it('[SC-001] should create staff and call res.status(201)', async () => {
      mockRequest.body = {
        name: 'John Doe',
        phone_number: '555-1234',
        salary: 50000,
        work_schedule: 'Mon-Fri',
        hire_date: '2023-01-01',
        position: 'Developer',
      };
      mockedStaffRepo.create.mockResolvedValue({ id: 1, ...mockRequest.body } as any);

      await createStaff(mockRequest as Request, mockResponse as Response);

      expect(mockedStaffRepo.create).toHaveBeenCalledWith(expect.any(Object));
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it('[SC-002] should return 400 if required fields are missing', async () => {
      mockRequest.body = { name: 'John Doe' };
      await createStaff(mockRequest as Request, mockResponse as Response);
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Missing required fields.' });
    });

    it('[SC-003] should return 409 if phone number already exists', async () => {
      mockRequest.body = {
        name: 'John Doe',
        phone_number: '555-1234',
        salary: 50000,
        work_schedule: 'Mon-Fri',
        hire_date: '2023-01-01',
        position: 'Developer',
      };
      const error = new Error() as any;
      error.name = 'SequelizeUniqueConstraintError';
      mockedStaffRepo.create.mockRejectedValue(error);

      await createStaff(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(409);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Phone number already exists.' });
    });
  });

  describe('getAllStaff', () => {
    it('[SC-004] should return staff list and call res.status(200)', async () => {
      mockRequest.query = {};
      jest.spyOn(Staff, 'findAndCountAll').mockResolvedValueOnce({
        count: 1,
        rows: [{ id: 1, name: 'John Doe' }],
      } as any);

      await getAllStaff(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        meta: expect.objectContaining({ totalItems: 1 }),
        data: [{ id: 1, name: 'John Doe' }],
      }));
    });
  });

  describe('getStaffById', () => {
    it('[SC-005] should return staff data with res.status(200)', async () => {
      mockRequest.params = { id: '1' };
      mockedStaffRepo.findById.mockResolvedValue({ id: 1, name: 'John Doe' } as any);

      await getStaffById(mockRequest as Request, mockResponse as Response);

      expect(mockedStaffRepo.findById).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it('[SC-006] should return 404 if staff not found', async () => {
      mockRequest.params = { id: '1' };
      mockedStaffRepo.findById.mockResolvedValue(null);

      await getStaffById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Staff member not found.' });
    });

    it('[SC-007] should return 400 if staff ID invalid', async () => {
      mockRequest.params = { id: 'abc' };

      await getStaffById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid staff ID.' });
    });
  });

  describe('updateStaff', () => {
    it('[SC-008] should update staff and call res.status(200)', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'Jane Doe' };
      mockedStaffRepo.update.mockResolvedValue({ id: 1, name: 'Jane Doe' } as any);

      await updateStaff(mockRequest as Request, mockResponse as Response);

      expect(mockedStaffRepo.update).toHaveBeenCalledWith(1, { name: 'Jane Doe' });
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({ name: 'Jane Doe' }));
    });

    it('[SC-009] should return 404 if staff not found', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'Jane Doe' };
      mockedStaffRepo.update.mockResolvedValue(null);

      await updateStaff(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Staff member not found.' });
    });

    it('[SC-010] should return 400 if staff ID invalid', async () => {
      mockRequest.params = { id: 'abc' };
      await updateStaff(mockRequest as Request, mockResponse as Response);
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid staff ID.' });
    });
  });

  describe('deactivateStaff', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseStatus: jest.Mock;
    let responseSend: jest.Mock;
    let responseJson: jest.Mock;

    beforeEach(() => {
        responseSend = jest.fn();
        responseJson = jest.fn();
        responseStatus = jest.fn().mockReturnValue({
            send: responseSend,
            json: responseJson,
        });

        mockRequest = {};
        mockResponse = {
            status: responseStatus,
        };
    });

    it('[SC-011] should deactivate staff and call res.status(204).send()', async () => {
        mockRequest.params = { id: '1' };
        jest.spyOn(StaffRepository, 'deactivate').mockResolvedValue({} as any);

        await deactivateStaff(mockRequest as Request, mockResponse as Response);

        expect(StaffRepository.deactivate).toHaveBeenCalledWith(1);
        expect(responseStatus).toHaveBeenCalledWith(204);
        expect(responseSend).toHaveBeenCalled();
    });

    it('[SC-012] should return 404 if staff not found', async () => {
        mockRequest.params = { id: '999' };
        jest.spyOn(StaffRepository, 'deactivate').mockResolvedValue(null);

        await deactivateStaff(mockRequest as Request, mockResponse as Response);

        expect(responseStatus).toHaveBeenCalledWith(404);
        expect(responseJson).toHaveBeenCalledWith({
            message: 'Staff member not found.'
        });
    });
});

});
