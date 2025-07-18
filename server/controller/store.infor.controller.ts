import { Request, Response } from 'express';
import { 
  Product, Orders, Customer, Staff, Category, Brand, 
  CartItem, InventoryLog, OrderItem, PaymentMethod, PaymentTransaction, 
  ProductFeedback, ProductPromotion, ProductSupplier, Promotion, Roles, Supplier, TypeProduct, TwoFaToken, Address 
} from '../db/models';
import { sequelize } from '../db/sequelize';
import { QueryTypes } from 'sequelize';
/**
 * @swagger
 * /api/store-infor/counts:
 *   post:
 *     summary: Get counts of selected store data
 *     tags: [Store Information]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tables
 *             properties:
 *               tables:
 *                 type: array
 *                 description: List of table names to get counts for
 *                 items:
 *                   type: string
 *                   enum:
 *                     - Product
 *                     - Orders
 *                     - Customer
 *                     - Staff
 *                     - Category
 *                     - Brand
 *                     - CartItem
 *                     - InventoryLog
 *                     - OrderItem
 *                     - PaymentMethod
 *                     - PaymentTransaction
 *                     - ProductFeedback
 *                     - ProductPromotion
 *                     - ProductSupplier
 *                     - Promotion
 *                     - Roles
 *                     - Supplier
 *                     - TypeProduct
 *                     - TwoFaToken
 *                     - Address
 *     responses:
 *       200:
 *         description: Counts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *       400:
 *         description: Invalid table names
 *       500:
 *         description: Server error
 */
export async function getCounts (req: Request, res: Response):Promise<void> {
  try {
    const { tables } = req.body;

    if (!Array.isArray(tables) || tables.length === 0) {
        res.status(400).json({ message: 'tables must be a non-empty array' });
        return
    }

    const modelMap: Record<string, any> = {
      Product, Orders, Customer, Staff, Category, Brand,
      CartItem, InventoryLog, OrderItem, PaymentMethod, PaymentTransaction,
      ProductFeedback, ProductPromotion, ProductSupplier, Promotion, Roles, Supplier,
      TypeProduct, TwoFaToken, Address
    };

    const counts: Record<string, number> = {};

    for (const table of tables) {
      const model = modelMap[table];
      if (model) {
        counts[table] = await model.count();
      } else {
         res.status(400).json({ message: `Invalid table name: ${table}` });
         return
      }
    }
    res.json(counts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @swagger
 * /api/store-infor/sales:
 *   get:
 *     summary: Get sales data including total amount and top selling products using raw SQL for speed
 *     tags: [Store Information]
 *     parameters:
 *       - in: query
 *         name: top
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of top selling products to return
 *     responses:
 *       200:
 *         description: Sales data retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               totalAmount: 12345.67
 *               topProducts:
 *                 - product_code: "P1001"
 *                   name: "Intel Core i7-11700K Processor"
 *                   totalSoldQty: 150
 *       500:
 *         description: Server error
 */
export async function getSalesData(req: Request, res: Response): Promise<void> {
  try {
    const top = typeof req.query.top === 'string' ? parseInt(req.query.top, 10) : 5;

    const [result] = await sequelize.query<{ totalAmount: string }>(
  `SELECT SUM(qty * price_at_purchase) AS totalAmount FROM orderitem;`,
    { type: QueryTypes.SELECT }
    );

    const totalAmount = parseFloat(result.totalAmount) || 0;

    const topProducts = await sequelize.query(
        `
        SELECT
            p.product_code,
            p.name,
            Sales.TotalQuantitySold as totalSoldQty,
            Sales.TotalPriceSold as totalPriceSold
        FROM product p
        JOIN (
            SELECT 
            product_code, 
            SUM(qty) AS TotalQuantitySold,
            SUM(qty * price_at_purchase) AS TotalPriceSold
            FROM orderitem
            GROUP BY product_code
        ) AS Sales ON p.product_code = Sales.product_code
        ORDER BY Sales.TotalQuantitySold DESC
        LIMIT :limit;
        `,
        {
            replacements: { limit: top },
            type: QueryTypes.SELECT,
        }
        );

        res.status(200).json({
        totalAmount: totalAmount || 0,
        topProducts: topProducts.map((p: any) => ({
            product_code: p.product_code,
            name: p.name,
            totalSoldQty: Number(p.totalSoldQty),
            totalPriceSold: parseFloat(p.totalPriceSold),
        })),
    });

  } catch (error) {
    console.error('Error fetching sales data (raw SQL):', error);
    res.status(500).json({ message: 'Server error' });
  }
}
