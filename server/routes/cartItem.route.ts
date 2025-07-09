import express from 'express'
import {addToCart,getCart,updateQtyCartItem,removeCartItem} from '../controller/cart.controller'
export const CartItemRouter = express.Router();
CartItemRouter.get('/:customer_id',getCart);
CartItemRouter.post('/:customer_id',addToCart);
CartItemRouter.put('/:customer_id',updateQtyCartItem);
CartItemRouter.delete('/:customer_id',removeCartItem);





