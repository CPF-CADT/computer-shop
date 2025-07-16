import express from 'express';
import { getCounts,getSalesData } from '../controller/store.infor.controller';

export const storeInforRouter = express.Router();

storeInforRouter.post('/counts', getCounts);
storeInforRouter.get('/sales', getSalesData);

