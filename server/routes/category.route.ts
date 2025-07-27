import express from 'express'
import { getAllCategory,createCategory,deleteCategory,updateCategory
        ,getAllTypeProduct,createTypeProduct,deleteTypeProduct,updateTypeProduct
        ,getAllBrand ,createBrand,deleteBrand,updateBrand}
         from '../controller/category.controller';
import { authenticateToken, authorize } from '../middleware/authenticateToken.middleware';
export const categoryRouter = express.Router();
categoryRouter.get('/',getAllCategory);
categoryRouter.post('/',authenticateToken,authorize('staff'),createCategory);
categoryRouter.put('/:id',authenticateToken,authorize('staff'),updateCategory);
categoryRouter.delete('/:id',authenticateToken,authorize('admin'),deleteCategory);


export const typeProducRouter = express.Router();
typeProducRouter.get('/',getAllTypeProduct);
typeProducRouter.post('/',authenticateToken,authorize('staff'),createTypeProduct);
typeProducRouter.put('/:id',authenticateToken,authorize('staff'),updateTypeProduct);
typeProducRouter.delete('/:id',authenticateToken,authorize('admin'),deleteTypeProduct);


export const BrandRouter = express.Router();
BrandRouter.get('/',getAllBrand);
BrandRouter.post('/',authenticateToken,authorize('staff'),createBrand);
BrandRouter.put('/:id',authenticateToken,authorize('staff'),updateBrand);
BrandRouter.delete('/:id',authenticateToken,authorize('admin'),deleteBrand);
