import { getAllProduct,getOneProduct,getProductDetail } from '../controller/ProductController';
import express from 'express'
const productRouter = express.Router();
productRouter.get('/',getAllProduct)
productRouter.get('/:product_code',getOneProduct)
productRouter.get('/:product_code/detail',getProductDetail)

export default productRouter;   
