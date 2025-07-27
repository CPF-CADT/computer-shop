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
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         product_code:
 *           type: string
 *           example: "P1001"
 *         name:
 *           type: string
 *           example: "Intel Core i7-11700K Processor"
 *         image_path:
 *           type: string
 *           example: "/images/products/intel_i7_11700k.jpg"
 *         price:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *               format: float
 *               example: 289.99
 *             currency:
 *               type: string
 *               example: "USD"
 *         description:
 *           type: string
 *           example: "The Intel Core i7-11700K is an 11th Gen desktop processor designed for high-performance gaming and productivity workloads."
 *         brand:
 *           type: string
 *           example: "Intel"
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 2
 *             title:
 *               type: string
 *               example: "Processors"
 *         type:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             title:
 *               type: string
 *               example: "CPU"
 *         discount:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "percentage"
 *             value:
 *               type: integer
 *               example: 10
 *         feedback:
 *           type: object
 *           properties:
 *             rating:
 *               type: string
 *               example: "4.5"
 *             totalReview:
 *               type: integer
 *               example: 152
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "No products found."
 *         code:
 *           type: integer
 *           example: 404
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
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           default: ''
 *         description: Search product by similar name
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort products by name — ascending (A-Z) or descending (Z-A)
 *       - in: query
 *         name: order_column
 *         schema:
 *           type: string
 *           default: ''
 *         description: Order by column name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The product category to filter by
 *       - in: query
 *         name: type_product
 *         schema:
 *           type: string
 *         description: The product type to filter by
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: The product brand to filter by
 *       - in: query
 *         name: price_min
 *         schema:
 *           type: number
 *         description: Minimum price to filter by
 *       - in: query
 *         name: price_max
 *         schema:
 *           type: number
 *         description: Maximum price to filter by
 *     responses:
 *       '200':
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *             example:
 *               meta:
 *                 totalItems: 100
 *                 page: 1
 *                 totalPages: 10
 *               data:
 *                 - product_code: "P1001"
 *                   name: "Intel Core i7-11700K Processor"
 *                   image_path: "/images/products/intel_i7_11700k.jpg"
 *                   price:
 *                     amount: 289.99
 *                     currency: "USD"
 *                   description: "The Intel Core i7-11700K is an 11th Gen desktop processor designed for high-performance gaming and productivity workloads."
 *                   brand: "Intel"
 *                   category:
 *                     id: 2
 *                     title: "Processors"
 *                   type:
 *                     id: 1
 *                     title: "CPU"
 *                   discount:
 *                     type: "percentage"
 *                     value: 10
 *                   feedback:
 *                     rating: "4.5"
 *                     totalReview: 152
 *       '404':
 *         description: No products found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function getAllProduct(req: Request, res: Response): Promise<void> {
    const category = (req.query.category as string);
    const type_product = (req.query.type_product as string);
    const brandProduct = (req.query.brand as string);
    const nameProductSearch = (req.query.name as string);
    const sortType = (req.query.sort as string) || 'asc';
    const sortColumn = (req.query.order_column as string);
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;

    // NEW: Extract price_min and price_max
    const priceMin = typeof req.query.price_min === 'string' ? parseFloat(req.query.price_min) : undefined;
    const priceMax = typeof req.query.price_max === 'string' ? parseFloat(req.query.price_max) : undefined;

    try {
        const product = await ProductRepository.getAllProduct(
            nameProductSearch,
            sortType,
            sortColumn,
            category,
            type_product,
            brandProduct,
            priceMin, // NEW
            priceMax, // NEW
            page,
            limit
        );
        const totalItems = await Product.count(); // <--- This is the primary suspect
        const totalPages: number = Math.round(totalItems / limit);
        res.status(200).json({
            meta: {
                totalItems,
                page,
                totalPages
            },
            data: product
        });
        return;
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
        return;
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

export async function getOneProduct(req: Request, res: Response): Promise<void> {
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
 * /api/product/{product_code}/detail:
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

export async function getProductDetail(req: Request, res: Response): Promise<void> {
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
 * /api/product:
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
 *               - code
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
 *                 type: integer
 *                 description: Product category.
 *               brand:
 *                 type: integer
 *                 description: Product brand.
 *               type_product:
 *                 type: integer
 *                 description: Type of the product (e.g. physical, digital).
 *               image_path:
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

export async function addNewProduct(req: Request, res: Response): Promise<void> {
    try {
        const productData = req.body;

        if (!productData || !productData.code || !productData.name || !productData.price) {
          res.status(400).json({ message: 'Missing required product data.' });
                              console.log('err missing')
          return
        }

        const success = await ProductRepository.addProduct(productData);

        if (success) {
          res.status(201).json({ message: 'Product added successfully.' });
          return
        } else {
                    console.log('err product exists')
          res.status(409).json({ message: 'Product already exists or failed to add.' });
          return
        }
    } catch (err) {
        console.log('err server')
        res.status(500).json({ message: (err as Error).message });
    }
}

/**
 * @swagger
 * /api/product/{product_code}/feedback:
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
export async function addProductFeedback(req: Request, res: Response): Promise<void> {
    try {
        const { product_code } = req.params;
        const { rating, comment,customer_id } = req.body;

        if (!customer_id) {
            res.status(401).json({ message: 'Unauthorized: No customer ID found in token.' });
            return
        }

        const ratingInt = parseInt(rating);
        if (
            Number.isNaN(ratingInt) ||
            typeof comment !== 'string' ||
            !comment.trim()
        ) {
            res.status(400).json({ message: 'Invalid or missing input values' });
            return
        }

        await ProductFeedBackRepositories.addFeedback(product_code, customer_id, ratingInt, comment);
        res.status(201).json({ message: 'Feedback added successfully.' });
        return
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
        return
    }
}


/**
 * @swagger
 * /api/product/{productCode}:
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
 *               stock_quantity:
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

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const { productCode } = req.params;
    const updateData = req.body;
    console.log(updateData)
    if (!updateData || Object.keys(updateData).length === 0) {
      res.status(400).json({ message: 'No update data provided.' });
      return;
    }
    const transformedData: Partial<{
      name: string;
      price: number;
      stock_quantity: number;
      description: string;
      category_id: number;
      brand_id: number;
      type_id: number;
      image_path: string;
    }> = {};

    if (updateData.name) transformedData.name = updateData.name;
    if (updateData.price) transformedData.price = updateData.price;
    if (updateData.stock_quantity) transformedData.stock_quantity = updateData.stock_quantity;
    if (updateData.description) transformedData.description = updateData.description;
    if (updateData.category) transformedData.category_id = Number(updateData.category);
    if (updateData.brand) transformedData.brand_id = updateData.brand;
    if (updateData.type.id) transformedData.type_id = updateData.type.id;
    if (updateData.image) transformedData.image_path = updateData.image;

    const success = await ProductRepository.updateProduct(productCode,transformedData);

    if (success) {
      res.status(200).json({ message: 'Product updated successfully.' });
    } else {
      res.status(404).json({ message: `Product with code ${productCode} not found or no changes made.` });
    }
  } catch (err) {
    res.status(500).json({ message: (err as Error).message || 'Internal server error.' });
  }
}

/**
 * @swagger
 * /api/product/{productCode}:
 *   delete:
 *     summary: Soft delete a product (set is_active = false)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique code of the product to deactivate.
 *         example: "P1001"
 *     responses:
 *       200:
 *         description: Product deactivated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deactivated successfully.
 *       404:
 *         description: Product not found or already deactivated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product with code P1001 not found or already inactive.
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

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { productCode } = req.params;
    const success = await ProductRepository.softDeleteProduct(productCode);
    if (success) {
      res.status(200).json({ message: 'Product deactivated successfully.' });
    } else {
      res.status(404).json({ message: `Product with code ${productCode} not found or no changes made.` });
    }
  } catch (err) {
    res.status(500).json({ message: (err as Error).message || 'Internal server error.' });
  }
}
