import { Request, Response } from 'express';
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
        jest.clearAllMocks();
        responseJson = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson });
        mockRequest = { body: {}, params: {} };
        mockResponse = { status: responseStatus, json: responseJson };
    });

    describe('createUser', () => {
        it('[UM-001] should call UserManagement.createDatabaseUser and return 201', async () => {
            mockRequest.body = { username: 'new_db_user', password: 'db_password' };
            mockedUserManagement.createDatabaseUser.mockResolvedValue();
            await UserManagementController.createUser(mockRequest as Request, mockResponse as Response);
            expect(mockedUserManagement.createDatabaseUser).toHaveBeenCalledWith('new_db_user', 'db_password', undefined, undefined);
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: `User 'new_db_user' created successfully.` });
        });

        it('[UM-002] should return 500 if the repository throws an error', async () => {
            mockRequest.body = { username: 'new_db_user', password: 'db_password' };
            const dbError = new Error('DB connection failed');
            mockedUserManagement.createDatabaseUser.mockRejectedValue(dbError);
            await UserManagementController.createUser(mockRequest as Request, mockResponse as Response);
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Error creating database user.', error: dbError.message });
        });
    });

    describe('createRole', () => {
        it('[UM-003] should call UserManagement.createDatabaseRole and return 201', async () => {
            mockRequest.body = { roleName: 'new_app_role' };
            mockedUserManagement.createDatabaseRole.mockResolvedValue();
            await UserManagementController.createRole(mockRequest as Request, mockResponse as Response);
            expect(mockedUserManagement.createDatabaseRole).toHaveBeenCalledWith('new_app_role');
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: `Role 'new_app_role' created successfully.` });
        });
    });

    describe('grantRoleToUser', () => {
        it('[UM-004] should grant a role to a user and return 200', async () => {
            mockRequest.body = { roleName: 'app_reader', username: 'test_user' };
            mockedUserManagement.grantRoleToUser.mockResolvedValue();
            await UserManagementController.grantRoleToUser(mockRequest as Request, mockResponse as Response);
            expect(mockedUserManagement.grantRoleToUser).toHaveBeenCalledWith('app_reader', 'test_user', undefined);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: `Role 'app_reader' granted to user 'test_user' successfully.` });
        });
    });

    describe('dropUser', () => {
        it('[UM-005] should drop a database user and return 200', async () => {
            const username = 'user_to_delete';
            mockRequest.params = { username };
            mockRequest.body = { host: '%' };
            mockedUserManagement.dropDatabaseUser.mockResolvedValue();
            await UserManagementController.dropUser(mockRequest as Request, mockResponse as Response);
            expect(mockedUserManagement.dropDatabaseUser).toHaveBeenCalledWith(username, '%');
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: `User '${username}' dropped successfully.` });
        });
    });
});