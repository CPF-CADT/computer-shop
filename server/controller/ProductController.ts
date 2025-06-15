import ProductRepository from "../repositories/productRepository";
import { Request, Response } from 'express';
export async function getAllProduct(req:Request,res:Response){
    const category: string | undefined = req.query.category as string;
    const type_product: string | undefined = req.query.type_product as string;
    const brandProduct: string | undefined = req.query.brand as string;
    try{
        const product = await ProductRepository.getAllProduct(category,type_product,brandProduct);
        res.status(200).send(product);
    }catch(err){
        res.status(404).json({message:'Get product Error'+err});
    }
}
export async function getOneProduct(req:Request,res:Response){
    try{
        const productCode = req.params.product_code;
        const product = await ProductRepository.getOneProduct(productCode);
        res.status(200).send(product);
    }catch(err){
        res.status(404).json({message:'Get product Error'+err});
    }
}
export async function getProductDetail(req:Request,res:Response){
    try{
        const productCode = req.params.product_code;
        const product = await ProductRepository.getProductDetail(productCode);
        res.status(200).send(product);
    }catch(err){
        res.status(404).json({message:'Get product Error'+err});
    }
}