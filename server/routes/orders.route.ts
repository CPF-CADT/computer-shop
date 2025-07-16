import { Router } from 'express';
import { getOrders, getOrderById } from '../controller/orders.controller';

const ordersRoute = Router();

ordersRoute.get('/', getOrders);
ordersRoute.get('/:id', getOrderById); 

export default ordersRoute;
