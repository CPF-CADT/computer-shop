import express from 'express'
import {createUser} from '../controller/UserController'
export const customerRouter = express.Router();
customerRouter.post('/',createUser);