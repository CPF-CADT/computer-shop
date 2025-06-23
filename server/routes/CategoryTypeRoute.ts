import express from 'express'
import { getAllCategory,getAllTypeProduct,getAllBrand } from '../controller/CategoryTypeCotroller';
export const categoryRouter = express.Router();
categoryRouter.get('/',getAllCategory);

export const typeProducRouter = express.Router();
typeProducRouter.get('/',getAllTypeProduct);

export const BrandRouter = express.Router();
BrandRouter.get('/',getAllBrand);