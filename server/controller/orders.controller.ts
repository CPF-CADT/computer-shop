import { Request, Response } from 'express';
import { Orders } from '../db/models/Orders';
import { Customer } from '../db/models/Customer';
import { Address } from '../db/models/Address';
import { Product } from '../db/models/Product';
import {sequelize} from '../db/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { OrderStatus } from '../db/models/Enums';
import { OrderItem } from '../db/models/OrderItem';

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
      const cleanSortType = sortType.trim().toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        // Fetch orders with pagination & sorting
        const orders = await Orders.findAll({
        include,
         order: [[orderColumn, cleanSortType]],
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
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
    }


 /**
   * @swagger
   * /api/user/{customer_id}/orders:
   *   get:
   *     summary: Get all orders for a customer by customer ID
   *     tags: [Customer]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Customer ID
   *     responses:
   *       200:
   *         description: List of orders with items
   *         content:
   *           application/json:
   *             example:
   *               - order_id: 1
   *                 order_date: "2025-07-16T12:00:00Z"
   *                 order_status: "PENDING"
   *                 address:
   *                   street_line: "123 Main St"
   *                   district: "Daun Penh"
   *                   province: "Phnom Penh"
   *                 items:
   *                   - product_code: "P1001"
   *                     name: "Intel Core i7"
   *                     OrderItem:
   *                       qty: 2
   *                       price_at_purchase: 299.99
   *       404:
   *         description: Customer not found or no orders
   *       500:
   *         description: Server error
   */
  export async function getOrdersByCustomerId(req: Request, res: Response): Promise<void> {
  try {
    const customerId = parseInt(req.params.customer_id);
    if (isNaN(customerId)) {
      res.status(400).json({ message: 'Invalid customer ID' });
      return;
    }

    const ordersCustomerID = await Orders.findAll({
      where: { customer_id: customerId },
      attributes: ['order_id']
    });

    if (!ordersCustomerID || ordersCustomerID.length === 0) {
      res.status(404).json({ message: 'No orders found for this customer' });
      return;
    }

    const orderIds = ordersCustomerID.map(order => order.order_id);
    const ordersData = await Orders.findAll({
      where: {
        order_id: {
          [Op.in]: orderIds
        }
      },
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

    res.status(200).json(ordersData);
  } catch (error) {
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
        { model: Customer, attributes: ['name','phone_number'] },
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
    res.status(500).json({ message: 'Failed to fetch order' });
  }
}

/**
 * @swagger
 * /api/order/summary:
 *   get:
 *     summary: Get total number of orders and counts by order status
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Summary of orders with total count and counts by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: integer
 *                   example: 100
 *                   description: Total number of orders
 *                 counts:
 *                   type: object
 *                   description: Number of orders grouped by status
 *                   additionalProperties:
 *                     type: integer
 *                   example:
 *                     Pending: 20
 *                     Processing: 30
 *                     Delivered: 40
 *                     Cancelled: 10
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch order summary
 */
export async function getOrderSummary(req: Request, res: Response): Promise<void> {
  try {
    const statusCountsRaw = await Orders.findAll({
      attributes: [
        'order_status',
        [sequelize.fn('COUNT', sequelize.col('order_status')), 'count'],
      ],
      group: ['order_status'],
    });

    // Initialize counts with 0 for each status
    const counts: Record<string, number> = {
      [OrderStatus.PENDING]: 0,
      [OrderStatus.PROCESSING]: 0,
      [OrderStatus.DELIVERED]: 0,
      [OrderStatus.CANCELLED]: 0,
    };

    statusCountsRaw.forEach((row: any) => {
      const status = row.order_status;
      counts[status] = Number(row.dataValues.count);
    });

    const totalOrders = await Orders.count();

    res.status(200).json({ totalOrders, counts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order summary' });
  }
}

/**
 * @swagger
 * /api/order/{id}/status:
 *   patch:
 *     summary: Update the status of an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_status
 *             properties:
 *               order_status:
 *                 type: string
 *                 enum: [PENDING, PROCESSING, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Order status updated successfully
 *               order:
 *                 order_id: 1
 *                 order_status: "DELIVERED"
 *       400:
 *         description: Invalid input or order status
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const orderId = Number(req.params.id);
    const { order_status } = req.body;

    if (isNaN(orderId)) {
      res.status(400).json({ message: 'Invalid order ID' });
      return;
    }

    if (!Object.values(OrderStatus).includes(order_status)) {
      res.status(400).json({ message: 'Invalid order status' });
      return;
    }

    const order = await Orders.findByPk(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.order_status = order_status;
    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order: {
        order_id: order.order_id,
        order_status: order.order_status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
}
