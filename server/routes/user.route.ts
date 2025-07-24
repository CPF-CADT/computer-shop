import express from 'express'
import {createUser,customerLogin,updateCustomerInfor,getAllCustomer,sendVerificationCode,verifyTwoFaCode} from '../controller/user.controller'
import {getOrdersByCustomerId} from '../controller/orders.controller'
import { authenticateToken } from '../middleware/authenticateToken.middleware';
export const customerRouter = express.Router();
customerRouter.get('/all',authenticateToken,getAllCustomer )
customerRouter.post('/register',createUser);
customerRouter.post('/login',customerLogin);
customerRouter.get('/:customer_id/orders',authenticateToken,getOrdersByCustomerId)
customerRouter.put('/:customer_id',authenticateToken,updateCustomerInfor)
customerRouter.post('/request-otp',sendVerificationCode);
customerRouter.post('/verify-otp',verifyTwoFaCode);
