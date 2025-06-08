import { Request, Response } from 'express';
import { CategoryModel,TypeProductModel,BrandModel } from '../model/CategoryAndTypeModel';
export async function getAllCategory(req:Request,res:Response) {
    try{
        const category = await CategoryModel.getAllCategory();
        res.status(200).json(category);
    }catch (err){
        res.status(404).json({message:'Get category Error'+err});
    }
}
export async function getAllTypeProduct(req:Request,res:Response) {
    try{
        const typeProduct = await TypeProductModel.getAllTypeProduct();
        res.status(200).json(typeProduct);
    }catch (err){
        res.status(404).json({message:'Get type product Error'+err});
    }
}
export async function getAllBrand(req:Request,res:Response){
    try{
        const brand = await BrandModel.getAllBrand();
        res.status(200).json(brand);
    }catch (err){
        res.status(404).json({message:'Get Brand Error'+err});
    }
}