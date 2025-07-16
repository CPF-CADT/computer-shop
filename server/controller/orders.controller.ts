import { Request, Response } from 'express';
import { Orders } from '../db/models/Orders';
import { Customer } from '../db/models/Customer';
import { Address } from '../db/models/Address';
import { Product } from '../db/models/Product';
import { OrderItem } from '../db/models/OrderItem';
import {sequelize} from '../db/sequelize';
import { QueryTypes } from 'sequelize';

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order Management
 */



/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get all orders with customer name, address, and optionally items
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, price, status]
 *         description: Sort by order_date, total_price, or order_status
 *       - in: query
 *         name: sortType
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sorting order (default ASC)
 *       - in: query
 *         name: includeItems
 *         schema:
 *           type: boolean
 *         description: Whether to include order items (default false)
 *     responses:
 *       200:
 *         description: List of orders with details
 *         content:
 *           application/json:
 *             example:
 *               meta:
 *                 totalItems: 50
 *                 page: 1
 *                 totalPages: 5
 *               data:
 *                 - order_id: 1
 *                   order_date: "2025-07-16T12:00:00Z"
 *                   order_status: "PENDING"
 *                   customer:
 *                     name: "John Doe"
 *                   address:
 *                     street_line: "123 Main St"
 *                     district: "Daun Penh"
 *                     province: "Phnom Penh"
 *                   items:
 *                     - product_code: "P1001"
 *                       name: "Intel Core i7-11700K Processor"
 *                       OrderItem:
 *                         qty: 2
 *                         price_at_purchase: 289.99
 *       500:
 *         description: Server error
 */
export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const {
      sortBy = 'date',
      sortType = 'ASC',
      includeItems = 'false',
    } = req.query as {
      sortBy?: string;
      sortType?: 'ASC' | 'DESC';
      includeItems?: string;
    };

    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const offset = (page - 1) * limit;

    let orderColumn: string;
    if (sortBy === 'price') orderColumn = 'total_price';
    else if (sortBy === 'status') orderColumn = 'order_status';
    else orderColumn = 'order_date';

    // Include options
    const include: any[] = [
      { model: Customer, attributes: ['name', 'phone_number'] },
      { model: Address, attributes: ['street_line', 'district', 'province'] },
    ];

    if (includeItems === 'true') {
      include.push({
        model: Product,
        attributes: ['product_code', 'name'],
        through: {
          attributes: ['qty', 'price_at_purchase'],
        },
      });
    }

    // Get total count of orders for pagination
        const totalItems = await Orders.count();

        // Fetch orders with pagination & sorting
        const orders = await Orders.findAll({
        include,
        order: [[orderColumn, sortType]],
        limit,
        offset,
        });

        // Get total money per order from orderitem
        const ordersTotals = await sequelize.query<{ order_id: number; totalMoney: number }>(
            `SELECT order_id, COALESCE(SUM(qty * price_at_purchase), 0) AS totalMoney
            FROM orderitem
            GROUP BY order_id`,
            { type: QueryTypes.SELECT }
        );


        const totalMoneyMap = new Map<number, number>();
        ordersTotals.forEach(o => totalMoneyMap.set(o.order_id, o.totalMoney));

        const ordersWithTotalMoney = orders.map(order => {
        const orderJson = order.toJSON() as any;
        orderJson.totalMoney = totalMoneyMap.get(orderJson.order_id) || 0;
        return orderJson;
        });

        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
        meta: { totalItems, page, totalPages },
        data: ordersWithTotalMoney,
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
    }



/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Get single order by ID with customer, address, and items
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details with items
 *         content:
 *           application/json:
 *             example:
 *               order_id: 1
 *               order_date: "2025-07-16T12:00:00Z"
 *               order_status: "PENDING"
 *               customer:
 *                 name: "John Doe"
 *               address:
 *                 street_line: "123 Main St"
 *                 district: "Daun Penh"
 *                 province: "Phnom Penh"
 *               items:
 *                 - product_code: "P1001"
 *                   name: "Intel Core i7-11700K Processor"
 *                   OrderItem:
 *                     qty: 2
 *                     price_at_purchase: 289.99
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const orderId = Number(req.params.id);
    if (isNaN(orderId)) {
      res.status(400).json({ message: 'Invalid order ID' });
      return;
    }

    const order = await Orders.findByPk(orderId, {
    include: [
        { model: Customer, attributes: ['name'] },
        { model: Address, attributes: ['street_line', 'district', 'province'] },
        {
        model: Product,
        attributes: ['product_code', 'name'],
        through: {
            attributes: ['qty', 'price_at_purchase'],
        },
        },
    ],
    });


    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
}
