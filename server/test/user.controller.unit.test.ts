// tests/user.controller.unit.test.ts
import { Request, Response } from 'express';
import { createUser, customerLogin } from '../controller/user.controller';
import { CusomerRepository } from '../repositories/user.repository';
import { Encryption } from '../service/encription';
import JWT from '../service/JWT';

jest.mock('../repositories/user.repository');
jest.mock('../service/encription');
jest.mock('../service/JWT');

const mockRequest = (body: any = {}) => ({
  body,
}) as Request;

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};


describe('User Controller (Unit Tests)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully and return 201', async () => {
      const req = mockRequest({
        name: 'Test User',
        phone_number: '123456789',
        password: 'password123',
      });
      const res = mockResponse();

      (Encryption.hashPassword as jest.Mock).mockReturnValue('hashed_password');
      // Mock the repository to resolve successfully
      (CusomerRepository.createNewUser as jest.Mock).mockResolvedValue(true);

      // Act: Call the controller function
      await createUser(req, res);

      // Assert: Check if the correct functions were called with the correct data
      expect(CusomerRepository.createNewUser).toHaveBeenCalledWith(
        'Test User',
        '123456789',
        null, // because profile_url was not provided
        'hashed_password' // Ensure the hashed password was used
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'user create success ' });
    });

    it('should return 400 if required information is missing', async () => {
      // Arrange
      const req = mockRequest({ name: 'Test User' }); // Missing phone and password
      const res = mockResponse();

      // Act
      await createUser(req, res);

      // Assert
      expect(CusomerRepository.createNewUser).not.toHaveBeenCalled(); // Should not try to create a user
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'cannot get the information of user' });
    });
  });

  describe('customerLogin', () => {
    it('should login a user and return a JWT token on success', async () => {
        // Arrange
        const req = mockRequest({ phone_number: '123456789', password: 'password123' });
        const res = mockResponse();
        const mockCustomer = { id: 1, phone_number: '123456789', password: 'hashed_password', name: 'Test User' };

        (CusomerRepository.login as jest.Mock).mockResolvedValue(mockCustomer);
        (Encryption.verifyPassword as jest.Mock).mockReturnValue(true); // Password is correct
        (JWT.create as jest.Mock).mockReturnValue('fake_jwt_token');

        // Act
        await customerLogin(req, res);

        // Assert
        expect(CusomerRepository.login).toHaveBeenCalledWith('123456789');
        expect(Encryption.verifyPassword).toHaveBeenCalledWith('hashed_password', 'password123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            token: 'fake_jwt_token'
        }));
    });

    it('should return 400 if the user is not found', async () => {
        // Arrange
        const req = mockRequest({ phone_number: '123456789', password: 'password123' });
        const res = mockResponse();

        (CusomerRepository.login as jest.Mock).mockResolvedValue(null); // Simulate user not found

        // Act
        await customerLogin(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User not found' });
    });
  });
});
