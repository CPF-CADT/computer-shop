import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import productRouter from './routes/product.route';
import { customerRouter } from './routes/user.route';
import { BrandRouter, categoryRouter, typeProducRouter } from './routes/category.route';
import { CartItemRouter } from './routes/cartItem.route';
import { AddressRouter } from './routes/address.route';
import ServiceRouter from './routes/service.route';
import { userManagementRouter } from './routes/userManagement.route';
import { recoveryDBRouter } from './routes/recovery.route';
import { swaggerSpec } from './service/swaggerConfig';
import { connectToDatabase } from './db/sequelize';
import { TelegramBot } from './service/TelegramBot';
import { PromotionRouter } from './routes/promotion.route';
import { staffRouter } from './routes/staff.route';
import { storeInforRouter } from './routes/store.infor.route';
import ordersRoute from './routes/orders.route';
import { CheckoutRouter } from './routes/checkout.route'; 
import {authenticateToken,authorize} from './middleware/authenticateToken.middleware'
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

export let telegramBotInstance: TelegramBot; 

connectToDatabase()
  .then(() => {
    console.log('Database connected successfully.');

    telegramBotInstance = new TelegramBot();
    telegramBotInstance.startPolling();
    console.log('Telegram Bot is polling for updates.');

    app.use('/api/service', authenticateToken,express.raw({ type: 'application/octet-stream', limit: '100mb' }));
    app.use('/api/product', productRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/type-product', typeProducRouter);
    app.use('/api/brand', BrandRouter);
    app.use('/api/user', customerRouter);
    app.use('/api/cart-item',authenticateToken ,CartItemRouter);
    app.use('/api/address-customer',authenticateToken, AddressRouter);
    app.use('/api/checkout',authenticateToken, CheckoutRouter(telegramBotInstance));
    app.use('/api/db',authenticateToken,authorize('admin'), userManagementRouter);
    app.use('/api/recovery-db',authenticateToken,authorize('admin'), recoveryDBRouter);
    app.use('/api/service',authenticateToken,authorize('staff'), ServiceRouter);
    app.use('/api/staff', staffRouter);
    app.use('/api/store-infor',authenticateToken,authorize('staff'), storeInforRouter);
    app.use('/api/promotions',authenticateToken,authorize('staff'), PromotionRouter);
    app.use('/api/order', authenticateToken,ordersRoute);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    // console.log(Encryption.hashPassword('cadt2025'))
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });