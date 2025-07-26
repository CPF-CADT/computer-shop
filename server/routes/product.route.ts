import { getAllProduct, getOneProduct, getProductDetail, addProductFeedback, addNewProduct, updateProduct, deleteProduct } from '../controller/product.controller';
import express from 'express'
import { authenticateToken, authorize } from '../middleware/authenticateToken.middleware';
const productRouter = express.Router();

productRouter.get('/', getAllProduct);
productRouter.get('/:product_code', authenticateToken, getOneProduct);
productRouter.get('/:product_code/detail', getProductDetail);
productRouter.post('/', authenticateToken, authorize('staff'), addNewProduct);
productRouter.post('/:product_code/feedback', authenticateToken, authorize('staff'), addProductFeedback);
productRouter.put('/:productCode', authenticateToken, authorize('staff'), updateProduct);
productRouter.delete('/:productCode', authenticateToken, authorize('staff'), deleteProduct);

export default productRouter;

