import ProductRepository from "../repositories/product.repository";
import { Request, Response } from 'express';
import { ProductFeedBackRepositories } from '../repositories/product.repository';
import { Product } from "../db/models";

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
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
 * /api/products/{product_code}/detail:
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



/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - Code
 *               - price
 *               - quantity
 *               - description
 *               - category
 *               - brand
 *               - type_product
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               Code:
 *                 type: string
 *                 description: Unique product code.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the product.
 *               quantity:
 *                 type: integer
 *                 description: Quantity in stock.
 *               description:
 *                 type: string
 *                 description: Description of the product.
 *               category:
 *                 type: string
 *                 description: Product category.
 *               brand:
 *                 type: string
 *                 description: Product brand.
 *               type_product:
 *                 type: string
 *                 description: Type of the product (e.g. physical, digital).
 *               image:
 *                 type: string
 *                 description: URL to the product image.
 *     responses:
 *       '201':
 *         description: Product added successfully.
 *       '400':
 *         description: Missing product data.
 *       '409':
 *         description: Product already exists or failed to add.
 *       '500':
 *         description: Internal server error.
 */

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
 * /api/products/{product_code}/feedback:
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

/**
 * @swagger
 * /api/products/{productCode}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique code of the product to update.
 *         example: "LP-001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the product.
 *                 example: "Laptop Pro Max"
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The new price of the product NOT (USD).
 *                 example: 1300.00
 *               quantity:
 *                 type: integer
 *                 description: The new quantity in stock.
 *                 example: 45
 *               description:
 *                 type: string
 *                 description: The new description of the product.
 *                 example: "Updated high-performance laptop for professionals."
 *               category:
 *                 type: integer
 *                 description: The new ID of the product category.
 *                 example: 1
 *               brand:
 *                 type: integer
 *                 description: The new ID of the product brand.
 *                 example: 2
 *               type_product:
 *                 type: integer
 *                 description: The new ID of the product type.
 *                 example: 1
 *               image:
 *                 type: string
 *                 description: The new URL to the product image.
 *                 example: "https://example.com/images/lp-001-v2.jpg"
 *               is_active:
 *                 type: boolean
 *                 description: Whether the product is active or not.
 *                 example: true
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product updated successfully.
 *       400:
 *         description: Invalid request body (e.g., empty update data).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No update data provided.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product with code LP-001 not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */

export async function updateProduct(req: Request, res: Response) {
  try {
    const { productCode } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided.' });
    }

    const success = await ProductRepository.updateProduct(productCode, updateData);

    if (success) {
      return res.status(200).json({ message: 'Product updated successfully.' });
    } else if (!success) {
      return res.status(404).json({ message: `Product with code ${productCode} not found.` });
    } else { //null
      return res.status(500).json({ message: 'Failed to update product due to an internal error.' });
    }
  } catch (err) {
    console.error(`Error updating product with code ${req.params.productCode}:`, err);
    return res.status(500).json({ message: (err as Error).message || 'Internal server error.' });
  }
}