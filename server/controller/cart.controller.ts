import { Request, Response } from 'express';
import { CartItemRepository } from '../repositories/cartItem.repository';
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart item operations
 */

/**
 * @swagger
 * /api/cart-item/get:
 *   post:
 *     summary: Get cart items for a customer
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *       400:
 *         description: Invalid Customer ID
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /api/cart-item/update-qty:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - product_code
 *               - qty
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               product_code:
 *                 type: string
 *                 example: MOUSE123
 *               qty:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid customer ID or quantity
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /api/cart-item/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - product_code
 *               - qty
 *               - price_at_purchase
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               product_code:
 *                 type: string
 *                 example: LAPTOP001
 *               qty:
 *                 type: integer
 *                 example: 2
 *               price_at_purchase:
 *                 type: number
 *                 format: float
 *                 example: 499.99
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */


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

/**
 * @swagger
 * /api/cart-item/remove:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - product_code
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               product_code:
 *                 type: string
 *                 example: KEYBOARD456
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *       400:
 *         description: Invalid customer ID or product code
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 */

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