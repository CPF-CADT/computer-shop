import { Request, Response } from 'express';
import { CartItemRepository } from '../repositories/CartItemRepositories';

export async function getCart(req: Request, res: Response) {
    try {
        const { customer_id } = req.body;
        const customer_id_int = parseInt(customer_id);
        if (Number.isNaN(customer_id_int)) {
            res.status(400).json({ message: 'Invalid Customer ID' });
        } else {
            const cartItem = await CartItemRepository.getCart(customer_id_int);
            res.status(200).json(cartItem);
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}

export async function updateQtyCartItem(req: Request, res: Response) {
    try {
        const { customer_id, product_code, qty } = req.body;
        const customer_id_int = parseInt(customer_id);
        const qty_int = parseInt(qty);

        if (Number.isNaN(customer_id_int) || Number.isNaN(qty_int) || !product_code) {
            res.status(400).json({ message: 'Invalid Customer ID Or Quantity invalid' });
        } else {
            const success = await CartItemRepository.updateQuantity(customer_id_int, product_code, qty_int);
            if (success) {
                res.status(200).json({ message: 'cart item update successfull' });
            } else {
                res.status(404).json({ message: 'Cart not found!' });
            }
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}

export async function addToCart(req: Request, res: Response) {
    try {
        const { customer_id, product_code, qty, price_at_purchase } = req.body;
        const customer_id_int = parseInt(customer_id);
        const qty_int = parseInt(qty);
        const price_at_purchase_float = parseFloat(price_at_purchase);
        if (
            Number.isNaN(customer_id_int) ||
            !product_code ||
            Number.isNaN(qty_int) ||
            Number.isNaN(price_at_purchase_float)
        ) {
            res.status(400).json({ message: 'Invalid input data' });
        }
        await CartItemRepository.addToCart(customer_id_int,product_code,qty_int,price_at_purchase);
        res.status(200).json({ message: 'Cart updated successfully' });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}

export async function removeCartItem(req: Request, res: Response) {
    try {
        const { customer_id, product_code } = req.body;
        const customer_id_int = parseInt(customer_id);

        if (Number.isNaN(customer_id_int) || !product_code) {
            res.status(400).json({ message: 'Invalid Customer ID Or product code invalid' });
        } else {
            const success = await CartItemRepository.remove(customer_id_int, product_code);
            if (success) {
                res.status(200).json({ message: 'cart item remove successfull' });
            } else {
                res.status(404).json({ message: 'Cart not found!' });
            }
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}