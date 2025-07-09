import ProductRepository from "../repositories/product.repository";
import { Request, Response } from 'express';
import { ProductFeedBackRepositories } from '../repositories/product.repository';
import { Product } from "../db/models";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         product_code:
 *           type: string
 *           description: The unique code of the product.
 *           example: "P001"
 *         name:
 *           type: string
 *           description: The name of the product.
 *           example: "Gaming Laptop"
 *         category:
 *           type: string
 *           description: The category of the product.
 *           example: "Electronics"
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message describing the error.
 *
 * tags:
 *   - name: Product
 *     description: Product management and feedback
 */



/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Product]
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
 *         name: name
 *         schema: { type: string, default: '' }
 *         description: Search Product By similar name
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *           description: Sort products by name — ascending (A-Z) or descending (Z-A)
*       - in: query
 *         name: order_column
 *         schema: { type: string, default: '' }
 *         description: Order By column
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The product category to filter by.
 *       - in: query
 *         name: type_product
 *         schema:
 *           type: string
 *         description: The product type to filter by.
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: The product brand to filter by.
 *     responses:
 *       '200':
 *         description: The product description by product code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               product_code: "P1001"
 *               name: "Intel Core i7-11700K Processor"
 *               image_path: "/images/products/intel_i7_11700k.jpg"
 *               price:
 *                 amount: 289.99
 *                 currency: "USD"
 *               description: "The Intel Core i7-11700K is an 11th Gen desktop processor designed for high-performance gaming and productivity workloads."
 *               brand: "Intel"
 *               category:
 *                 id: 2
 *                 title: "Processors"
 *               type:
 *                 id: 1
 *                 title: "CPU"
 *               discount:
 *                 type: "percentage"
 *                 value: 10
 *               feedback:
 *                 rating: "4.5"
 *                 totalReview: 152
 *       '404':
 *         description: No products found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function getAllProduct(req: Request, res: Response) {
    const category = (req.query.category as string) || undefined;
    const type_product = (req.query.type_product as string) || undefined;
    const brandProduct = (req.query.brand as string) || undefined;
    const nameProductSearch = (req.query.name as string) || undefined;
    const sortType = (req.query.sort as string) || 'asc'; // or default you want
    const sortColumn = (req.query.order_column as string) || 'name'; // or default column

    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    try {
        const product = await ProductRepository.getAllProduct(nameProductSearch,sortType,sortColumn,category, type_product, brandProduct,page,limit);
        res.status(200).send(product);
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
    }
}

/**
 * @swagger
 * /api/product/{product_code}:
 *   get:
 *     summary: Get a single product by product code
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: product_code
 *         schema:
 *           type: string
 *         required: true
 *         description: The product code
 *     responses:
 *       '200':
 *         description: The product description by product code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: The product was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function getOneProduct(req: Request, res: Response) {
    try {
        const productCode = req.params.product_code;
        const product = await ProductRepository.getOneProduct(productCode);
        res.status(200).send(product);
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
    }
}

/**
 * @swagger
 * /products/{product_code}/detail:
 *   get:
 *     summary: Get detailed information for a single product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: product_code
 *         schema:
 *           type: string
 *         required: true
 *         description: The product code
 *     responses:
 *       '200':
 *         description: The product details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: The product was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 */

export async function getProductDetail(req: Request, res: Response) {
    try {
        const productCode = req.params.product_code;
        const product = await ProductRepository.getProductDetail(productCode);
        res.status(200).send(product);
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
    }
}




export async function addNewProduct(req: Request, res: Response) {
  try {
    const { productData } = req.body;

    if (!productData) {
       res.status(400).json({ message: 'Missing product data.' });
    }

    const success = await ProductRepository.addProduct(productData);

    if (success) {
       res.status(201).json({ message: 'Product added successfully.' });
    } else {
       res.status(409).json({ message: 'Product already exists or failed to add.' });
    }
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}

/**
 * @swagger
 * /products/{product_code}/feedback:
 *   post:
 *     summary: Add feedback for a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: product_code
 *         schema:
 *           type: string
 *         required: true
 *         description: The product code for which feedback is given
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - rating
 *               - comment
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 description: ID of the customer providing feedback.
 *               rating:
 *                 type: integer
 *                 description: A rating from 1 to 5.
 *               comment:
 *                 type: string
 *                 description: The text content of the feedback.
 *     responses:
 *       '201':
 *         description: Feedback added successfully.
 *       '400':
 *         description: Invalid or missing input values.
 *       '500':
 *         description: Internal server error.
 */
export async function addProductFeedback(req: Request, res: Response) {
    try {
        const { customer_id, product_code, rating, comment } = req.body;
        const customer_id_int  = parseInt(customer_id);
        const ratingInt = parseInt(rating);
        if (
            Number.isNaN(customer_id_int) ||
            Number.isNaN(ratingInt) ||
            typeof product_code !== 'string' ||
            typeof comment !== 'string' ||
            !product_code.trim() ||
            !comment.trim()
        ) {
           res.status(400).json({ message: 'Invalid or missing input values' });
           return;
        }
        await ProductFeedBackRepositories.addFeedback(product_code, customer_id, rating, comment);

        res.status(201).json({ message: 'Feedback added successfully.' });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: (err as Error).message });
    }
}
