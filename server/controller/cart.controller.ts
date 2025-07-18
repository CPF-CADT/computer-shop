import { Request, Response } from 'express';
import { CartItemRepository } from '../repositories/cartItem.repository';

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Cart item operations for customers
 */

/**
 * @swagger
 * /api/cart-item/{customer_id}:
 *   get:
 *     summary: Get all cart items for a specific customer
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer whose cart is being retrieved.
 *         example: 1
 *     responses:
 *       200:
 *         description: An array of cart items.
 *       400:
 *         description: Invalid Customer ID provided.
 *       500:
 *         description: Internal server error.
 */
export async function getCart(req: Request, res: Response) {
  try {
    const customer_id = parseInt(req.params.customer_id, 10);
    if (isNaN(customer_id)) {
      res.status(400).json({ message: 'Invalid Customer ID' });
      return;
    }
    const cartItems = await CartItemRepository.getCart(customer_id);
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

/**
 * @swagger
 * /api/cart-item/{customer_id}:
 *   put:
 *     summary: Update the quantity of a specific item in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_code
 *               - qty
 *             properties:
 *               product_code:
 *                 type: string
 *                 example: "PROD123"
 *               qty:
 *                 type: integer
 *                 description: The new total quantity for the item. Setting to 0 will remove the item.
 *                 example: 5
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully.
 *       400:
 *         description: Invalid customer ID, product code, or quantity.
 *       404:
 *         description: Cart item not found.
 *       500:
 *         description: Internal server error.
 */
export async function updateQtyCartItem(req: Request, res: Response) {
  try {
    const customer_id = parseInt(req.params.customer_id, 10);
    const { product_code, qty } = req.body;

    if (isNaN(customer_id) || !product_code || qty == null) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    const success = await CartItemRepository.setQuantity(customer_id, product_code, qty);
    if (success) {
      res.status(200).json({ message: 'Cart item quantity updated successfully.' });
    } else {
      res.status(404).json({ message: 'Cart item not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

/**
 * @swagger
 * /api/cart-item/{customer_id}:
 *   post:
 *     summary: Add an item to a customer's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_code
 *               - qty
 *               - price_at_purchase
 *             properties:
 *               product_code:
 *                 type: string
 *                 example: "PROD123"
 *               qty:
 *                 type: integer
 *                 example: 2
 *               price_at_purchase:
 *                 type: number
 *                 format: float
 *                 example: 199.99
 *     responses:
 *       200:
 *         description: Item added to cart successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
export async function addToCart(req: Request, res: Response): Promise<void> {
  try {
    const customer_id = parseInt(req.params.customer_id, 10);
    const { product_code, qty, price_at_purchase } = req.body;

    if (isNaN(customer_id) || !product_code || qty == null || price_at_purchase == null) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }
    await CartItemRepository.addToCart(customer_id, product_code, qty, price_at_purchase);
    res.status(200).json({ message: 'Item added to cart successfully.' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

/**
 * @swagger
 * /api/cart-item/{customer_id}:
 *   delete:
 *     summary: Remove a specific item from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the customer.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_code
 *             properties:
 *               product_code:
 *                 type: string
 *                 description: The code of the product to remove from the cart.
 *                 example: "PROD123"
 *     responses:
 *       200:
 *         description: Cart item removed successfully.
 *       400:
 *         description: Invalid customer ID or product code.
 *       404:
 *         description: Cart item not found.
 *       500:
 *         description: Internal server error.
 */
export async function removeCartItem(req: Request, res: Response): Promise<void> {
  try {
    const customer_id = parseInt(req.params.customer_id, 10);
    const { product_code } = req.body;

    if (isNaN(customer_id) || !product_code) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    const success = await CartItemRepository.remove(customer_id, product_code);
    if (success) {
      res.status(200).json({ message: 'Cart item removed successfully.' });
    } else {
      res.status(404).json({ message: 'Cart item not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
