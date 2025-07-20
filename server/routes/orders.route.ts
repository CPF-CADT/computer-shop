import { Router } from 'express';
import { getOrders, getOrderById,getOrderSummary,updateOrderStatus} from '../controller/orders.controller';

const ordersRoute = Router();

ordersRoute.get('/', getOrders);
ordersRoute.get('/summary', getOrderSummary); 
ordersRoute.patch('/:id/status', updateOrderStatus);
ordersRoute.get('/:id', getOrderById); 
export default ordersRoute;
