import { getAllProduct,getOneProduct,getProductDetail,addProductFeedback,addNewProduct,updateProduct } from '../controller/product.controller';
import express from 'express'
const productRouter = express.Router();

productRouter.get('/', getAllProduct);
productRouter.post('/', addNewProduct);
productRouter.get('/:product_code', getOneProduct);
productRouter.get('/:product_code/detail', getProductDetail);
productRouter.post('/:product_code/feedback', addProductFeedback);
productRouter.put('/:productCode', updateProduct);

export default productRouter;

