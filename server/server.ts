import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import productRouter from './routes/product.route';
import { customerRouter } from './routes/user.route';
import { BrandRouter, categoryRouter, typeProducRouter } from './routes/category.route';
import { CartItemRouter } from './routes/cartItem.route';
import { AddressRouter } from './routes/address.route';
import { CheckoutRouter } from './routes/checkout.route';
import ServiceRouter from './routes/service.route';
import { userManagementRouter } from './routes/userManagement.route';
import { recoveryDBRouter } from './routes/recovery.route';

import { swaggerSpec } from './service/swaggerConfig';
import { connectToDatabase } from './db/sequelize';
import { TelegramBot } from './service/TelgramBot';
import { PromotionRouter } from './routes/promotion.route';
import { staffRouter } from './routes/staff.route';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  

const app = express();

app.use(cors());
app.use(express.json());

try {
  await connectToDatabase();
  console.log('Database connected successfully.');
  
  const bot = new TelegramBot();
  bot.startPolling();
  console.log('Telegram Bot is polling for updates.');
    app.use('/api/service', express.raw({ type: 'application/octet-stream', limit: '100mb' }));
    app.use('/api/product', productRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/type-product', typeProducRouter);
    app.use('/api/brand', BrandRouter);
    app.use('/api/user', customerRouter);
    app.use('/api/cart-item', CartItemRouter);
    app.use('/api/address-customer', AddressRouter);
    app.use('/api/checkout', CheckoutRouter);
    app.use('/api/db', userManagementRouter);
    app.use('/api/recovery-db', recoveryDBRouter);
    app.use('/api/service', ServiceRouter);
    app.use('/api/service', PromotionRouter);
    app.use('/api/staff',staffRouter );
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); 
  }
};

startServer();