import express,{ Request, Response } from 'express'
import {createUser,customerLogin,updateCustomerInfor,getAllCustomer,sendVerificationCode,verifyTwoFaCode} from '../controller/user.controller'
import {getOrdersByCustomerId} from '../controller/orders.controller'
export const customerRouter = express.Router();
customerRouter.get('/all',getAllCustomer )
customerRouter.post('/register',createUser);
customerRouter.post('/login',customerLogin);
customerRouter.get('/:customer_id/orders',getOrdersByCustomerId)
customerRouter.put('/:customer_id',updateCustomerInfor)
customerRouter.post('/request-otp',sendVerificationCode);
customerRouter.post('/verify-otp',verifyTwoFaCode);
