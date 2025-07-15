import { Request, Response } from 'express';

import * as ApiControllers from '../controller/category.controller';

import { CategoryRepository, BrandRepository, TypeProductRepository } from '../repositories/categoryAndTypeProduct.repository';
import { BrandStructure, CategoryStructure, TypeProductStructure } from '../model/CategoryAndTypeModel';

jest.mock('../repositories/categoryAndTypeProduct.repository');

const mockedCategoryRepo = CategoryRepository as jest.Mocked<typeof CategoryRepository>;
const mockedBrandRepo = BrandRepository as jest.Mocked<typeof BrandRepository>;
const mockedTypeProductRepo = TypeProductRepository as jest.Mocked<typeof TypeProductRepository>;

describe('API Controllers - Unit Tests 🧪', () => {
    let mockRequest: Request;
    let mockResponse: Response;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        
        responseJson = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson });
        mockRequest = {
            params: {},
            body: {}
        } as Request;

        mockResponse = {
            status: responseStatus,
            json: responseJson,
        } as unknown as Response;
    });

    describe('Category Controller', () => {
        it('POST / -> should create a new category', async () => {
            mockRequest.body = { title: 'Graphics Cards', description: 'GPUs for gaming' };
            mockedCategoryRepo.createCategory.mockResolvedValue(true);

            await ApiControllers.createCategory(mockRequest, mockResponse);

            expect(mockedCategoryRepo.createCategory).toHaveBeenCalledWith('Graphics Cards', 'GPUs for gaming');
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: 'create category successful' });
        });

        it('GET / -> should get all categories', async () => {
            // Arrange
            const fakeData:CategoryStructure[] = [{ id: 1, title: 'CPUs', description: 'Central Processing Units' }];
            mockedCategoryRepo.getAllCategory.mockResolvedValue(fakeData);

            // Act
            await ApiControllers.getAllCategory(mockRequest, mockResponse);

            // Assert
            expect(mockedCategoryRepo.getAllCategory).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(fakeData);
        });

        it('PUT /:id -> should update a category', async () => {
            // Arrange
            mockRequest.params.id = '1';
            mockRequest.body = { title: 'RAM' };
            mockedCategoryRepo.updateCategory.mockResolvedValue(true);

            // Act
            await ApiControllers.updateCategory(mockRequest, mockResponse);

            // Assert
            expect(mockedCategoryRepo.updateCategory).toHaveBeenCalledWith(1, { title: 'RAM', description: undefined });
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Category updated successfully.' });
        });

        it('DELETE /:id -> should delete a category', async () => {
            // Arrange
            mockRequest.params.id = '1';
            mockedCategoryRepo.deleteCategory.mockResolvedValue(true);
            
            // Act
            await ApiControllers.deleteCategory(mockRequest, mockResponse);

            // Assert
            expect(mockedCategoryRepo.deleteCategory).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Category deleted successfully.' });
        });
        
        it('DELETE /:id -> should return 404 if category to delete is not found', async () => {
            // Arrange
            mockRequest.params.id = '999';
            mockedCategoryRepo.deleteCategory.mockResolvedValue(false); // Simulate category not found
            
            // Act
            await ApiControllers.deleteCategory(mockRequest, mockResponse);

            // Assert
            expect(mockedCategoryRepo.deleteCategory).toHaveBeenCalledWith(999);
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Category not found.' });
        });
    });

    // --- BRAND CONTROLLER ---
    describe('Brand Controller', () => {
        it('POST / -> should create a new brand', async () => {
            // Arrange
            mockRequest.body = { name: 'NVIDIA', country: 'USA' };
            mockedBrandRepo.createBrand.mockResolvedValue(true);

            // Act
            await ApiControllers.createBrand(mockRequest, mockResponse);

            // Assert
            expect(mockedBrandRepo.createBrand).toHaveBeenCalledWith('NVIDIA', undefined, undefined, 'USA');
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Brand created successfully.' });
        });

        it('GET / -> should get all brands', async () => {
            // Arrange
            const fakeData: BrandStructure[] = [{
                id: 1, name: 'AMD', country: 'USA',
                url_logo: '',
                website: ''
            }];
            mockedBrandRepo.getAllBrand.mockResolvedValue(fakeData);

            // Act
            await ApiControllers.getAllBrand(mockRequest, mockResponse);

            // Assert
            expect(mockedBrandRepo.getAllBrand).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(fakeData);
        });
        
        it('PUT /:id -> should update a brand', async () => {
            // Arrange
            mockRequest.params.id = '1';
            mockRequest.body = { country: 'Taiwan' };
            mockedBrandRepo.updateBrand.mockResolvedValue(true);
            
            // Act
            await ApiControllers.updateBrand(mockRequest, mockResponse);

            // Assert
            expect(mockedBrandRepo.updateBrand).toHaveBeenCalledWith(1, { country: 'Taiwan' });
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Brand updated successfully.' });
        });

        it('DELETE /:id -> should delete a brand', async () => {
            // Arrange
            mockRequest.params.id = '1';
            mockedBrandRepo.deleteBrand.mockResolvedValue(true);
            
            // Act
            await ApiControllers.deleteBrand(mockRequest, mockResponse);

            // Assert
            expect(mockedBrandRepo.deleteBrand).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Brand deleted successfully.' });
        });
    });

    // --- TYPE PRODUCT CONTROLLER ---
    describe('TypeProduct Controller', () => {
        it('POST / -> should create a new type product', async () => {
            // Arrange
            mockRequest.body = { name: 'CPU', description: 'The brain of the computer' };
            mockedTypeProductRepo.createTypeProduct.mockResolvedValue(true);

            // Act
            await ApiControllers.createTypeProduct(mockRequest, mockResponse);

            // Assert
            expect(mockedTypeProductRepo.createTypeProduct).toHaveBeenCalledWith('CPU', 'The brain of the computer');
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Product type created successfully.' });
        });

        it('GET / -> should get all product types', async () => {
            // Arrange
            const fakeData:TypeProductStructure[] = [{ id: 1, name: 'GPU', description: 'Graphics Processing Unit' }];
            mockedTypeProductRepo.getAllTypeProduct.mockResolvedValue(fakeData);

            // Act
            await ApiControllers.getAllTypeProduct(mockRequest, mockResponse);

            // Assert
            expect(mockedTypeProductRepo.getAllTypeProduct).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(fakeData);
        });

        it('PUT /:id -> should update a type product', async () => {
            // Arrange
            mockRequest.params.id = '1';
            mockRequest.body = { description: 'The official brain of the computer' };
            mockedTypeProductRepo.updateTypeProduct.mockResolvedValue(true);
            
            // Act
            await ApiControllers.updateTypeProduct(mockRequest, mockResponse);

            // Assert
            expect(mockedTypeProductRepo.updateTypeProduct).toHaveBeenCalledWith(1, { description: 'The official brain of the computer' });
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Product type updated successfully.' });
        });

        it('DELETE /:id -> should delete a type product', async () => {
            // Arrange
            mockRequest.params.id = '1';
            mockedTypeProductRepo.deleteTypeProduct.mockResolvedValue(true);
            
            // Act
            await ApiControllers.deleteTypeProduct(mockRequest, mockResponse);

            // Assert
            expect(mockedTypeProductRepo.deleteTypeProduct).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Product type deleted successfully.' });
        });
    });
});