import express from 'express'
import { placeOrder } from '../controller/CheckoutController';
export const CheckoutRouter = express.Router();
CheckoutRouter.post('/place-order',placeOrder);




