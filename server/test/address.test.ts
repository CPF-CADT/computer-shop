import { Request, Response } from 'express';
import { addCustomerAddress, getCustomerAddresses, updateCustomerAddress, deleteCustomerAddress } from '../controller/address.controller';
import { AddressRepository } from '../repositories/address.repository';

jest.mock('../repositories/address.repository');

const mockedAddressRepository = AddressRepository as jest.Mocked<typeof AddressRepository>;

describe('Address Controller - Unit Tests', () => {
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

    describe('addCustomerAddress', () => {
        it('[AC-001] should add an address and call res.status(201)', async () => {
            mockRequest.body = {
                customer_id: '1',
                street_line: '123 Main St',
                district: 'Daun Penh',
                province: 'Phnom Penh',
            };
            mockedAddressRepository.addNewAddress.mockResolvedValue({ address_id: 1, ...mockRequest.body } as any);
            await addCustomerAddress(mockRequest as Request, mockResponse as Response);
            expect(mockedAddressRepository.addNewAddress).toHaveBeenCalledWith(expect.any(Object));
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({ message: 'Address added successfully.' }));
        });

        it('[AC-002] should return 400 if required fields are missing', async () => {
            mockRequest.body = { customer_id: '1' };
            await addCustomerAddress(mockRequest as Request, mockResponse as Response);
            expect(mockedAddressRepository.addNewAddress).not.toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Missing or invalid required fields.' });
        });
    });

    describe('getCustomerAddresses', () => {
        it('[AC-003] should get addresses for a customer and call res.status(200)', async () => {
            mockRequest.params = { customer_id: '1' };
            const fakeAddresses = [{ address_id: 1, street_line: 'Home' }];
            mockedAddressRepository.getCustomerAddress.mockResolvedValue(fakeAddresses as any);
            await getCustomerAddresses(mockRequest as Request, mockResponse as Response);
            expect(mockedAddressRepository.getCustomerAddress).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ data: fakeAddresses });
        });
    });

    describe('updateCustomerAddress', () => {
        it('[AC-004] should update an address and call res.status(200)', async () => {
            mockRequest.params = { address_id: '1' };
            mockRequest.body = { province: 'Kandal' };
            mockedAddressRepository.updateAddress.mockResolvedValue([1] as any);
            mockedAddressRepository.getAddressById.mockResolvedValue({ address_id: 1, province: 'Kandal' } as any);
            await updateCustomerAddress(mockRequest as Request, mockResponse as Response);
            expect(mockedAddressRepository.updateAddress).toHaveBeenCalledWith(1, { province: 'Kandal' });
            expect(responseStatus).toHaveBeenCalledWith(200);
        });

        it('[AC-005] should return 404 if address to update is not found', async () => {
            mockRequest.params = { address_id: '999' };
            mockRequest.body = { province: 'Kandal' };
            mockedAddressRepository.updateAddress.mockResolvedValue([0] as any); 
            await updateCustomerAddress(mockRequest as Request, mockResponse as Response);
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Address not found or no changes made.' });
        });
    });

    describe('deleteCustomerAddress', () => {
        it('[AC-006] should delete an address and call res.status(200)', async () => {
            mockRequest.params = { address_id: '1' };
            mockedAddressRepository.deleteAddress.mockResolvedValue(1); 
            await deleteCustomerAddress(mockRequest as Request, mockResponse as Response);
            expect(mockedAddressRepository.deleteAddress).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
        });

        it('[AC-007] should return 404 if address to delete is not found', async () => {
            mockRequest.params = { address_id: '999' };
            mockedAddressRepository.deleteAddress.mockResolvedValue(0); 
            await deleteCustomerAddress(mockRequest as Request, mockResponse as Response);
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Address not found.' });
        });
    });
});