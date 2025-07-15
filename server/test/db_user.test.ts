import { Request, Response } from 'express';
// Import the controller class to be tested
import { UserManagementController } from '../controller/userManagement.controller';
import { UserManagement } from '../repositories/userManagement.repository';

jest.mock('../repositories/userManagement.repository');

const mockedUserManagement = UserManagement as jest.Mocked<typeof UserManagement>;

describe('User Management Controller - Unit Tests', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;

    beforeEach(() => {
        // Clear all mock history before each test
        jest.clearAllMocks();

        // Set up fresh mock request and response objects
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
    });

    describe('createUser', () => {
        it('should call UserManagement.createDatabaseUser and return 201', async () => {
            // Arrange
            mockRequest.body = { username: 'new_db_user', password: 'db_password' };
            mockedUserManagement.createDatabaseUser.mockResolvedValue(); // Resolves with no value (void)

            // Act
            await UserManagementController.createUser(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedUserManagement.createDatabaseUser).toHaveBeenCalledWith(
                'new_db_user',
                'db_password',
                undefined,
                undefined  
            );
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: `User 'new_db_user' created successfully.` });
        });

        it('should return 500 if the repository throws an error', async () => {
            // Arrange
            mockRequest.body = { username: 'new_db_user', password: 'db_password' };
            const dbError = new Error('DB connection failed');
            mockedUserManagement.createDatabaseUser.mockRejectedValue(dbError);

            // Act
            await UserManagementController.createUser(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({
                message: 'Error creating database user.',
                error: dbError.message,
            });
        });
    });

    describe('createRole', () => {
        it('should call UserManagement.createDatabaseRole and return 201', async () => {
            // Arrange
            mockRequest.body = { roleName: 'new_app_role' };
            mockedUserManagement.createDatabaseRole.mockResolvedValue();

            // Act
            await UserManagementController.createRole(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedUserManagement.createDatabaseRole).toHaveBeenCalledWith('new_app_role');
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: `Role 'new_app_role' created successfully.` });
        });
    });

    describe('grantRoleToUser', () => {
        it('should grant a role to a user and return 200', async () => {
            // Arrange
            mockRequest.body = { roleName: 'app_reader', username: 'test_user' };
            mockedUserManagement.grantRoleToUser.mockResolvedValue();

            // Act
            await UserManagementController.grantRoleToUser(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedUserManagement.grantRoleToUser).toHaveBeenCalledWith('app_reader', 'test_user', undefined);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: `Role 'app_reader' granted to user 'test_user' successfully.` });
        });
    });

    describe('dropUser', () => {
        it('should drop a database user and return 200', async () => {
            // Arrange
            const username = 'user_to_delete';
            mockRequest.params = { username };
            mockRequest.body = { host: '%' };
            mockedUserManagement.dropDatabaseUser.mockResolvedValue();

            // Act
            await UserManagementController.dropUser(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockedUserManagement.dropDatabaseUser).toHaveBeenCalledWith(username, '%');
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: `User '${username}' dropped successfully.` });
        });
    });
});