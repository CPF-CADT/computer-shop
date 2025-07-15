import { Request, Response } from 'express';

// Import controller functions to be tested
import { createUser, customerLogin } from '../controller/user.controller';

// Import dependencies that need to be mocked
import { CusomerRepository } from '../repositories/user.repository';
import { Encryption } from '../service/encription';
import JWT from '../service/JWT';

// Mock the external modules/dependencies
jest.mock('../repositories/user.repository');
jest.mock('../service/encription');
jest.mock('../service/JWT');

// Create typed mock variables for easier use
const mockedUserRepo = CusomerRepository as jest.Mocked<typeof CusomerRepository>;
const mockedEncryption = Encryption as jest.Mocked<typeof Encryption>;
const mockedJwt = JWT as jest.Mocked<typeof JWT>;

describe('Customer Controller - Unit Tests', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;

    beforeEach(() => {
        // Reset mocks and create fresh req/res objects for each test
        jest.clearAllMocks();

        responseJson = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson });

        mockRequest = {
            body: {},
            params: {},
        };
        mockResponse = {
            status: responseStatus,
            json: responseJson,
        };
        // Ensure the environment variable is reset or set to a default for tests
        process.env.IS_CHECK_2FA = '0'; 
    });

    // --- Tests for createUser (Register) ---
    describe('createUser', () => {
        it('should create a new customer and return 201', async () => {
            // Arrange
            mockRequest.body = {
                name: 'John Doe',
                phone_number: '012345678',
                password: 'password123',
            };

            mockedEncryption.hashPassword.mockReturnValue('hashed_password_string');
            mockedUserRepo.createNewUser.mockResolvedValue(true);

            // Act
            await createUser(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedEncryption.hashPassword).toHaveBeenCalledWith('password123');
            expect(mockedUserRepo.createNewUser).toHaveBeenCalledWith('John Doe', '012345678', null, 'hashed_password_string');
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: 'user create success ' });
        });

        it('should return 400 if required fields are missing', async () => {
            // Arrange
            mockRequest.body = { name: 'John Doe' }; 

            // Act
            await createUser(mockRequest as Request, mockResponse as Response);
            
            // Assert
            expect(mockedUserRepo.createNewUser).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ error: 'cannot get the information of user' });
        });
    });

    // --- Tests for customerLogin ---
    describe('customerLogin', () => {
        const fakeUser = {
            id: 1,
            customer_id: 1, // Ensure all potential ID fields are present
            name: 'Test User',
            phone_number: '098765432',
            password: 'hashed_correct_password',
            is_verifyed: true,
            profile_img_path: null,
        };
        
        it('should login a verified user and return a token', async () => {
            // Arrange
            mockRequest.body = { phone_number: '098765432', password: 'correctpassword' };

            mockedUserRepo.login.mockResolvedValue(fakeUser as any);
            mockedEncryption.verifyPassword.mockReturnValue(true);
            mockedJwt.create.mockReturnValue('fake_jwt_token');

            // Act
            await customerLogin(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedUserRepo.login).toHaveBeenCalledWith('098765432');
            expect(mockedEncryption.verifyPassword).toHaveBeenCalledWith('hashed_correct_password', 'correctpassword');
            expect(mockedJwt.create).toHaveBeenCalledWith({ customer_id: 1, customer_phone_number: '098765432' });
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                success: true,
                message: 'Login successful',
                token: 'fake_jwt_token',
                user: {
                    id: 1,
                    phone_number: '098765432',
                    name: 'Test User',
                    profile_img_path: null,
                }
            });
        });

        it('should return 400 for incorrect password', async () => {
            // Arrange
            mockRequest.body = { phone_number: '098765432', password: 'wrongpassword' };
            
            mockedUserRepo.login.mockResolvedValue(fakeUser as any);
            mockedEncryption.verifyPassword.mockReturnValue(false); // Simulate password mismatch

            // Act
            await customerLogin(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedEncryption.verifyPassword).toHaveBeenCalledWith('hashed_correct_password', 'wrongpassword');
            expect(mockedJwt.create).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ success: false, message: 'Password incorrect' });
        });

        it('should return 400 if user does not exist', async () => {
            // Arrange
            mockRequest.body = { phone_number: '000000000', password: 'anypassword' };
            mockedUserRepo.login.mockResolvedValue(null); // Simulate user not found

            // Act
            await customerLogin(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedUserRepo.login).toHaveBeenCalledWith('000000000');
            expect(mockedEncryption.verifyPassword).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ success: false, message: 'User not found' });
        });
    });
});