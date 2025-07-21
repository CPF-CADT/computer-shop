import { OrderRepositories, PaymentTransactionRepositories } from "../repositories/checkout.repository";
import { Request, Response } from 'express';
import { TelegramBot } from "../service/TelgramBot";
import { Address, Customer, OrderItem, Orders } from "../db/models";
import { AddressRepository } from "../repositories/address.repository";
import { generateBillNumber } from '../service/TwoFA';
import KHQR from '../service/BakongKHQR';
import dotenv from 'dotenv';
dotenv.config()



/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Checkout Process for user and need to complete all step
 */


/**
 * @swagger
 * /api/checkout/place-order:
 *   post:
 *     summary: Place an order
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - address_id
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               address_id:
 *                 type: integer
 *                 example: 3
 *               express_handle:
 *                 type: string
 *                 example: VET
 *     responses:
 *       200:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                 amount_pay:
 *                   type: number
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input data or order failed
 *       500:
 *         description: Internal server error
 */

export async function placeOrder(req: Request, res: Response):Promise<void> {
    try {
        const { customer_id, address_id,express_handle } = req.body;
        const customer_id_int = parseInt(customer_id);
        const address_id_int = parseInt(address_id);

        if (Number.isNaN(customer_id_int) || Number.isNaN(address_id_int) || !express_handle) {
            res.status(400).json({ message: 'Invalid input data' });
        }

        const customer = await Customer.findByPk(customer_id_int) as Customer;
        const customerAddress = await AddressRepository.getAddressById(address_id_int) as Address;
        const orders_item = await OrderRepositories.placeAnOrder(customer_id_int, address_id_int, express_handle);

        if (orders_item && customer && customerAddress) {
            const totalAmount = orders_item.reduce((sum, item) => sum + (item.price_at_purchase * item.qty), 0);
            res.status(200).json({
                order_id: orders_item[0].order_id,
                amount_pay: totalAmount,
                message: 'Order placed successfully'
            });
        } else {
            res.status(400).json({ message: "Order failed. Please check customer, address, or cart items." });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}

/**
 * @swagger
 * /api/checkout/get-khqr:
 *   post:
 *     summary: Generate KHQR payment string
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - amount_pay
 *               - typeCurrency
 *             properties:
 *               order_id:
 *                 type: integer
 *                 example: 123
 *               amount_pay:
 *                 type: number
 *                 example: 50.00
 *               typeCurrency:
 *                 type: string
 *                 enum: [USD, KHR]
 *                 example: USD
 *     responses:
 *       200:
 *         description: KHQR string generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 khqr_string:
 *                   type: string
 *                 unique_md5:
 *                   type: string
 *                 order_id:
 *                   type: integer
 *                 amount:
 *                   type: number
 *                 bill_number:
 *                   type: string
 *       400:
 *         description: Invalid currency type or input
 *       500:
 *         description: Internal server error
 */

export async function createQrPayment(req: Request, res: Response):Promise<void> {
    try {
        const { amount_pay, order_id, typeCurrency } = req.body;
        const orderID = parseInt(order_id);
        const billNumber: string = 'BILL' + generateBillNumber();
        if (typeCurrency !== 'USD' && typeCurrency !== 'KHR') {
            res.status(400).json({ message: "Invalid currency type. Must be 'USD' or 'KHR'." });
        }

        if (Number.isNaN(orderID) || Number.isNaN(amount_pay)) {
            res.status(400).json({ message: 'Invalid amount or order ID.' });
        }
        const bakong = new KHQR(process.env.BAKONG_TOKEN || '');
        const khqr = bakong.createQR({
            bankAccount: process.env.BAKONG_BANK_ACCOUNT || '',
            merchantName: process.env.MERCHANT_NAME || '',
            merchantCity: process.env.MERCHANT_CITY || '',
            amount: (typeCurrency==='KHR')?Math.floor(Number(amount_pay)):amount_pay,
            currency: typeCurrency,
            storeLabel: "ComputerShop",
            phoneNumber: process.env.PHONE_NUMBER || '',
            billNumber: 'TRX'+orderID.toString(),
            terminalLabel: "Online PAY",
            isStatic: false,
        });
        const md5 = bakong.generateMD5(khqr);
        await PaymentTransactionRepositories.updatePaymentStatus(orderID, 'Pending');
        res.status(200).json({
            khqr_string: khqr,
            unique_md5: md5,
            order_id: orderID,
            amount: amount_pay,
            bill_number: billNumber
        });
    } catch (err) {
        console.error('[createQrPayment] Error:', err);
        res.status(500).json({ message: (err as Error).message });
    }
}

/**
 * @swagger
 * /api/checkout/check-payment:
 *   post:
 *     summary: Check payment status of an order
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_md5
 *               - order_id
 *             properties:
 *               unique_md5:
 *                 type: string
 *                 example: "abc123md5hash"
 *               order_id:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: Payment status response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment_status:
 *                   type: string
 *                   enum: [Completed, Pending]
 *                 message:
 *                   type: string
 *       404:
 *         description: Payment transaction not found
 *       500:
 *         description: Internal server error while checking payment
 */

export async function checkPayment(req: Request, res: Response):Promise<void> {
    try {
        const { unique_md5, order_id } = req.body;

        if (!unique_md5 || !order_id) {
            res.status(400).json({
                error: 'Missing required fields: unique_md5 and order_id'
            });
        }

        const existingTransaction = await PaymentTransactionRepositories.getTransactionByOrderId(order_id);

        if (existingTransaction && existingTransaction.status === 'Completed') {
            res.status(200).json({
                payment_status: 'Completed',
                message: 'This order has already been marked as paid.'
            });
        }
        const bakong = new KHQR(process.env.BAKONG_TOKEN || '');
        const bakongPayStatus = await bakong.checkPayment(unique_md5);

        if (bakongPayStatus === 'PAID') {
            await PaymentTransactionRepositories.updatePaymentStatus(order_id, 'Completed');
            
            try {
                const order = await Orders.findByPk(order_id);
                if (order) {
                    const customer = await Customer.findByPk(order.customer_id) as Customer;
                    const customerAddress = await AddressRepository.getAddressById(order.address_id) as Address;
                    const order_items = await OrderItem.findAll({ where: { order_id: order.order_id } });

                    if (order_items && customer && customerAddress) {
                        const botMessage = new TelegramBot();
                        const totalAmount = order_items.reduce((sum, item) => sum + (item.price_at_purchase * item.qty), 0);
                        botMessage.sendOrderNotification({
                            orderId: order_items[0].order_id,
                            customerName: customer.name,
                            phoneNumber: customer.phone_number,
                            address: `${customerAddress.street_line}, ${customerAddress.district}, ${customerAddress.province}`,
                            totalAmount: totalAmount,
                            items: order_items.map(item => `${item.product_code} : ${item.price_at_purchase} x ${item.qty}`),
                            expressHandle:order.express_handle,
                        });
                    }
                }   
            } catch (notificationError) {
                console.error(`[checkPayment] Notification failed for order ${order_id}:`, notificationError);
            }
            
            res.status(200).json({
                payment_status: 'Completed'
            });

        } else {
            res.status(200).json({
                payment_status: 'Pending'
            });
        }

    } catch (err) {
        console.error(`[checkPayment] Error processing order ${req.body.order_id}:`, err);
        
        if (err instanceof Error && err.message.includes('API request failed with status 404')) {
            res.status(404).json({
                payment_status: 'NotFound',
                error: 'Payment transaction not found by the payment provider. It may have expired or is invalid.'
            });
        }
        res.status(500).json({
            error: 'An internal server error occurred while checking the payment status.'
        });
    }
}