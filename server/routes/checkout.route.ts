import express from 'express'
import { placeOrder,createQrPayment,checkPayment } from '../controller/checkout.controller';
export const CheckoutRouter = express.Router();
CheckoutRouter.post('/place-order',placeOrder);
CheckoutRouter.post('/get-khqr',createQrPayment)
CheckoutRouter.post('/check-payment',checkPayment)





