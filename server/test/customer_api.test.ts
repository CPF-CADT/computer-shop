import { Request, Response } from 'express';
import { createUser, customerLogin } from '../controller/user.controller';
import { CusomerRepository } from '../repositories/user.repository';
import { Encryption } from '../service/encription';
import JWT from '../service/JWT';

jest.mock('../repositories/user.repository');
jest.mock('../service/encription');
jest.mock('../service/JWT');

const mockedUserRepo = CusomerRepository as jest.Mocked<typeof CusomerRepository>;
const mockedEncryption = Encryption as jest.Mocked<typeof Encryption>;
const mockedJwt = JWT as jest.Mocked<typeof JWT>;

describe('Customer Controller - Unit Tests', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        responseJson = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson });
        mockRequest = { body: {}, params: {} };
        mockResponse = { status: responseStatus, json: responseJson };
        process.env.IS_CHECK_2FA = '0'; 
    });

    describe('createUser', () => {
        it('[UC-001] should create a new customer and return 201', async () => {
            mockRequest.body = { name: 'John Doe', phone_number: '012345678', password: 'password123' };
            mockedEncryption.hashPassword.mockReturnValue('hashed_password_string');
            mockedUserRepo.createNewUser.mockResolvedValue(true);
            await createUser(mockRequest as Request, mockResponse as Response);
            expect(mockedEncryption.hashPassword).toHaveBeenCalledWith('password123');
            expect(mockedUserRepo.createNewUser).toHaveBeenCalledWith('John Doe', '012345678', null, 'hashed_password_string');
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: 'user create success ' });
        });

        it('[UC-002] should return 400 if required fields are missing', async () => {
            mockRequest.body = { name: 'John Doe' }; 
            await createUser(mockRequest as Request, mockResponse as Response);
            expect(mockedUserRepo.createNewUser).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ error: 'cannot get the information of user' });
        });
    });

    describe('customerLogin', () => {
        const fakeUser = {
            id: 1,
            customer_id: 1,
            name: 'Test User',
            phone_number: '098765432',
            password: 'hashed_correct_password',
            is_verifyed: true,
            profile_img_path: null,
        };
        
        it('[UC-003] should login a verified user and return a token', async () => {
            mockRequest.body = { phone_number: '098765432', password: 'correctpassword' };
            mockedUserRepo.login.mockResolvedValue(fakeUser as any);
            mockedEncryption.verifyPassword.mockReturnValue(true);
            mockedJwt.create.mockReturnValue('fake_jwt_token');
            await customerLogin(mockRequest as Request, mockResponse as Response);
            expect(mockedUserRepo.login).toHaveBeenCalledWith('098765432');
            expect(mockedEncryption.verifyPassword).toHaveBeenCalledWith('hashed_correct_password', 'correctpassword');
            expect(mockedJwt.create).toHaveBeenCalledWith({ customer_id: 1, customer_phone_number: '098765432' });
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                success: true,
                message: 'Login successful',
                token: 'fake_jwt_token',
                user: { id: 1, phone_number: '098765432', name: 'Test User', profile_img_path: null }
            });
        });

        it('[UC-004] should return 400 for incorrect password', async () => {
            mockRequest.body = { phone_number: '098765432', password: 'wrongpassword' };
            mockedUserRepo.login.mockResolvedValue(fakeUser as any);
            mockedEncryption.verifyPassword.mockReturnValue(false);
            await customerLogin(mockRequest as Request, mockResponse as Response);
            expect(mockedEncryption.verifyPassword).toHaveBeenCalledWith('hashed_correct_password', 'wrongpassword');
            expect(mockedJwt.create).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ success: false, message: 'Password incorrect' });
        });

        it('[UC-005] should return 400 if user does not exist', async () => {
            mockRequest.body = { phone_number: '000000000', password: 'anypassword' };
            mockedUserRepo.login.mockResolvedValue(null);
            await customerLogin(mockRequest as Request, mockResponse as Response);
            expect(mockedUserRepo.login).toHaveBeenCalledWith('000000000');
            expect(mockedEncryption.verifyPassword).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ success: false, message: 'User not found' });
        });
    });
});