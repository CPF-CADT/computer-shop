import { Router } from 'express';
import { getOrders, getOrderById,getOrderSummary} from '../controller/orders.controller';

const ordersRoute = Router();

ordersRoute.get('/', getOrders);
ordersRoute.get('/summary', getOrderSummary); 
ordersRoute.get('/:id', getOrderById); 

export default ordersRoute;
