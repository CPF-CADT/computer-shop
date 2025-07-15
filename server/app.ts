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

const app = express();

app.use(cors());
app.use(express.json());
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;