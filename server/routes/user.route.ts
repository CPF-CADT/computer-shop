import express from 'express'
import {createUser,customerLogin} from '../controller/user.controller'
export const customerRouter = express.Router();
customerRouter.post('/register',createUser);
customerRouter.post('/login',customerLogin);
// customerRouter.post('/request-otp',sendVerificationCode);
// customerRouter.post('/verify-otp',verifyTwoFaCode);
