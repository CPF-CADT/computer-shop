import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from './routes/product.route';
import { customerRouter } from './routes/user.route';
import { BrandRouter, categoryRouter, typeProducRouter } from './routes/category.route';
import { connectToDatabase } from './db/sequelize';
import { CartItemRouter } from './routes/cartItem.route';
import {AddressRouter } from './routes/address.route'
import { CheckoutRouter } from './routes/checkout.route';
import { TelegramBot } from './service/TelgramBot';
import ServiceRouter from './routes/service.route'
import {userManagementRouter} from './routes/userManagement.route';
import {swaggerSpec} from './service/swaggerConfig'
import swaggerUi from 'swagger-ui-express';
import {FileStructure, getFileNames} from './service/FilePreparation'
import {recoveryDBRouter} from './routes/recovery.route'
// import JWT from './logic/JWT'; 
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;
const bot = new TelegramBot();
(async () => {
  try {
    await connectToDatabase();
    bot.startPolling();
    app.use('/api/product', productRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/type-product', typeProducRouter);
    app.use('/api/brand', BrandRouter);
    app.use('/api/user', customerRouter);
    app.use('/api/cart-item',CartItemRouter)
    app.use('/api/service',ServiceRouter)
    app.use('/api/address-customer',AddressRouter)
    app.use('/api/checkout',CheckoutRouter)
    app.use('/api/db',userManagementRouter)
    app.use('/api/recovery-db',recoveryDBRouter)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();