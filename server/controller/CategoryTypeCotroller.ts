import { Request, Response } from 'express';
import { CategoryRepository,TypeProductRepository,BrandRepository } from '../repositories/CategoryAndTypeRepository';
export async function getAllCategory(req:Request,res:Response) {
    try{
        const category = await CategoryRepository.getAllCategory();
        res.status(200).json(category);
    }catch (err){
        res.status(404).json({message:'Get category Error'+err});
    }
}
export async function getAllTypeProduct(req:Request,res:Response) {
    try{
        const typeProduct = await TypeProductRepository.getAllTypeProduct();
        res.status(200).json(typeProduct);
    }catch (err){
        res.status(404).json({message:'Get type product Error'+err});
    }
}
export async function getAllBrand(req:Request,res:Response){
    try{
        const brand = await BrandRepository.getAllBrand();
        res.status(200).json(brand);
    }catch (err){
        res.status(404).json({message:'Get Brand Error'+err});
    }
}