import express from 'express'
import { getAllCategory,createCategory,deleteCategory,updateCategory
        ,getAllTypeProduct,createTypeProduct,deleteTypeProduct,updateTypeProduct
        ,getAllBrand ,createBrand,deleteBrand,updateBrand}
         from '../controller/category.controller';
export const categoryRouter = express.Router();
categoryRouter.get('/',getAllCategory);
categoryRouter.post('/',createCategory);
categoryRouter.put('/:id',updateCategory);
categoryRouter.delete('/:id',deleteCategory);


export const typeProducRouter = express.Router();
typeProducRouter.get('/',getAllTypeProduct);
typeProducRouter.post('/',createTypeProduct);
typeProducRouter.put('/:id',updateTypeProduct);
typeProducRouter.delete('/:id',deleteTypeProduct);


export const BrandRouter = express.Router();
BrandRouter.get('/',getAllBrand);
BrandRouter.post('/',createBrand);
BrandRouter.put('/:id',updateBrand);
BrandRouter.delete('/:id',deleteBrand);
