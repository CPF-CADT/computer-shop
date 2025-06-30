import ProductRepository from "../repositories/productRepository";
import { Request, Response } from 'express';
import { ProductFeedBackRepositories } from '../repositories/productRepository';
export async function getAllProduct(req: Request, res: Response) {
    const category: string | undefined = req.query.category as string;
    const type_product: string | undefined = req.query.type_product as string;
    const brandProduct: string | undefined = req.query.brand as string;
    try {
        const product = await ProductRepository.getAllProduct(category, type_product, brandProduct);
        res.status(200).send(product);
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
    }
}
export async function getOneProduct(req: Request, res: Response) {
    try {
        const productCode = req.params.product_code;
        const product = await ProductRepository.getOneProduct(productCode);
        res.status(200).send(product);
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
    }
}
export async function getProductDetail(req: Request, res: Response) {
    try {
        const productCode = req.params.product_code;
        const product = await ProductRepository.getProductDetail(productCode);
        res.status(200).send(product);
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
    }
}
export async function addProductFeedback(req: Request, res: Response) {
    try {
        const { customer_id, product_code, rating, comment } = req.body;
        const customer_id_int  = parseInt(customer_id);
        const ratingInt = parseInt(rating);
        if (
            Number.isNaN(customer_id_int) ||
            Number.isNaN(ratingInt) ||
            typeof product_code !== 'string' ||
            typeof comment !== 'string' ||
            !product_code.trim() ||
            !comment.trim()
        ) {
         res.status(400).json({ message: 'Invalid or missing input values' });
        }
        await ProductFeedBackRepositories.addFeedback(product_code, customer_id, rating, comment);

        res.status(201).json({ message: 'Feedback added successfully.' });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: (err as Error).message });
    }
}


