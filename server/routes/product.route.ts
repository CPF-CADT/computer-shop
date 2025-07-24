import { getAllProduct,getOneProduct,getProductDetail,addProductFeedback,addNewProduct,updateProduct } from '../controller/product.controller';
import express from 'express'
import { authenticateToken, authorize } from '../middleware/authenticateToken.middleware';
const productRouter = express.Router();

productRouter.get('/', getAllProduct);
productRouter.post('/',authenticateToken,authorize('staff'), addNewProduct);
productRouter.get('/:product_code',authenticateToken,authorize('staff'), getOneProduct);
productRouter.get('/:product_code/detail',authenticateToken,authorize('staff'), getProductDetail);
productRouter.post('/:product_code/feedback',authenticateToken,authorize('staff'), addProductFeedback);
productRouter.put('/:productCode',authenticateToken,authorize('staff'), updateProduct);

export default productRouter;

