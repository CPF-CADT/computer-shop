import express from 'express'
import {createUser,customerLogin,updateCustomerInfor,getAllCustomer} from '../controller/user.controller'
export const customerRouter = express.Router();
customerRouter.get('/all',getAllCustomer)
customerRouter.post('/register',createUser);
customerRouter.post('/login',customerLogin);
customerRouter.put('/:customer_id',updateCustomerInfor)
// customerRouter.post('/request-otp',sendVerificationCode);
// customerRouter.post('/verify-otp',verifyTwoFaCode);
