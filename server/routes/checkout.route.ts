// routes/checkout.route.ts
import { Router } from 'express';
import { placeOrder, createQrPayment, checkPayment } from '../controller/checkout.controller';
import { TelegramBot } from "../service/TelegramBot"; 

export const CheckoutRouter = (telegramBotInstance: TelegramBot) => {
    const router = Router();

    router.post('/place-order', placeOrder);
    router.post('/get-khqr', createQrPayment);
    router.post('/check-payment', (req, res) => checkPayment(req, res, telegramBotInstance));

    return router;
};