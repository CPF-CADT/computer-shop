import ProductModel from "../model/ProductModel";
import { Request, Response } from 'express';
export async function getAllProduct(req:Request,res:Response){
    try{
        const product = await ProductModel.getAllProduct();
        res.status(200).send(product);
    }catch(err){
        res.status(404).json({message:'Get product Error'+err});
    }
}
export async function getOneProduct(req:Request,res:Response){
    try{
        const productCode = req.params.product_code;
        const product = await ProductModel.getOneProduct(productCode);
        res.status(200).send(product);
    }catch(err){
        res.status(404).json({message:'Get product Error'+err});
    }
}
export async function getProductDetail(req:Request,res:Response){
    try{
        const productCode = req.params.product_code;
        const product = await ProductModel.getProductDetail(productCode);
        res.status(200).send(product);
    }catch(err){
        res.status(404).json({message:'Get product Error'+err});
    }
}