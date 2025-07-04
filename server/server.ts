import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from './routes/ProductRouter';
import { customerRouter } from './routes/UserRoute';
import { BrandRouter, categoryRouter, typeProducRouter } from './routes/CategoryTypeRoute';
import { connectToDatabase } from './db/sequelize';
import { CartItemRouter } from './routes/CartItemRoute';
import {AddressRouter } from './routes/AddressRouter'
import { CheckoutRouter } from './routes/CheckoutRoutes';
import { TelegramBot } from './service/TelgramBot';
import ServiceRouter from './routes/ServiceRoute'
import {userManagementRouter} from './routes/userManagementRoute';
import {swaggerSpec} from './service/swaggerConfig'
import swaggerUi from 'swagger-ui-express';
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
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();