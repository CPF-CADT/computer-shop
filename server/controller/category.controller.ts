import { Request, Response } from 'express';
import { CategoryRepository, TypeProductRepository, BrandRepository } from '../repositories/categoryAndTypeProduct.repository';


/**
 * 
 * Category Controller
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: A list of categories
 *       404:
 *         description: Categories not found
 *
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Laptops
 *               description:
 *                 type: string
 *                 example: Devices suitable for mobile computing
 *     responses:
 *       201:
 *         description: Category created successfully
 *       404:
 *         description: Cannot get information of category
 */


export async function getAllCategory(req: Request, res: Response) {
    try {
        const category = await CategoryRepository.getAllCategory();
        res.status(200).json(category);
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
    }
}

export async function createCategory(req: Request, res: Response) {
    const body: {
        title: string;
        description: string;
    } = req.body;
    try {
        const { title, description } = body;
        if (!title || !description) {
            res.status(404).json({ message: 'cannot get information of category' })
        } else {
            await CategoryRepository.createCategory(title, description);
            res.status(201).json({ message: 'create category successful' })
        }
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
    }
}

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid category ID or no update data
 *       404:
 *         description: Category not found
 *
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid category ID
 *       404:
 *         description: Category not found
 */

export async function updateCategory(req: Request, res: Response):Promise<void> {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid category ID.' });
        }

        const { title, description } = req.body;
        if (!title && !description) {
        res.status(400).json({ message: 'No update data provided.' });
        }

        const success = await CategoryRepository.updateCategory(id, { title, description });
        if (!success) {
        res.status(404).json({ message: 'Category not found or no changes made.' });
        }
        res.status(200).json({ message: 'Category updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}

export async function deleteCategory(req: Request, res: Response):Promise<void> {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
         res.status(400).json({ message: 'Invalid category ID.' });
        }

        const success = await CategoryRepository.deleteCategory(id);
        if (!success) {
        res.status(404).json({ message: 'Category not found.' });
        }
    res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (err) {
    res.status(500).json({ message: (err as Error).message });
    }
}

/**
 * 
 * Brand Controller
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Brand
 *   description: Brand management
 */

/**
 * @swagger
 * /api/brand:
 *   get:
 *     summary: Get all brands
 *     tags: [Brand]
 *     responses:
 *       200:
 *         description: A list of brands
 *       404:
 *         description: Brands not found
 *
 *   post:
 *     summary: Create a new brand
 *     tags: [Brand]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: ASUS
 *               logo_url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/asus-logo.png
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: https://www.asus.com
 *               country:
 *                 type: string
 *                 example: Taiwan
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Brand name is required
 *       500:
 *         description: Internal server error
 */

export async function getAllBrand(req: Request, res: Response):Promise<void> {
    try {
        const brand = await BrandRepository.getAllBrand();
    res.status(200).json(brand);
    } catch (err) {
    res.status(404).json({ message: (err as Error).message });
    }
}

export async function createBrand(req: Request, res: Response):Promise<void> {
    const { name, logo_url, website, country } = req.body;

    if (!name) {
    res.status(400).json({ message: 'Brand name is a required field.' });
    }

    try {
        await BrandRepository.createBrand(name, logo_url, website, country);
    res.status(201).json({ message: 'Brand created successfully.' });
    } catch (err) {
    res.status(500).json({ message: (err as Error).message });
    }
}

/**
 * @swagger
 * /api/brand/{id}:
 *   put:
 *     summary: Update a brand by ID
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Brand ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo_url:
 *                 type: string
 *               website:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       400:
 *         description: Invalid ID or no update data
 *       404:
 *         description: Brand not found
 *
 *   delete:
 *     summary: Delete a brand by ID
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Brand not found
 */

export async function updateBrand(req: Request, res: Response):Promise<void> {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid brand ID.' });
        }

        const updates = req.body;
        if (Object.keys(updates).length === 0) {
        res.status(400).json({ message: 'No update data provided.' });
        }

        const success = await BrandRepository.updateBrand(id, updates);
        if (!success) {
        res.status(404).json({ message: 'Brand not found or no changes made.' });
        }
    res.status(200).json({ message: 'Brand updated successfully.' });
    } catch (err) {
    res.status(500).json({ message: (err as Error).message });
    }
}

export async function deleteBrand(req: Request, res: Response):Promise<void>{
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid brand ID.' });
        }

        const success = await BrandRepository.deleteBrand(id);
        if (!success) {
        res.status(404).json({ message: 'Brand not found.' });
        }
    res.status(200).json({ message: 'Brand deleted successfully.' });
    } catch (err) {
    res.status(500).json({ message: (err as Error).message });
    }
}

/**
 * 
 * Type Product Controller
 * 
 */

/**
 * @swagger
 * tags:
 *   name: TypeProduct
 *   description: Type product management
 */

/**
 * @swagger
 * /api/type-product:
 *   get:
 *     summary: Get all type products
 *     tags: [TypeProduct]
 *     responses:
 *       200:
 *         description: A list of type products
 *       404:
 *         description: Type products not found
 *
 *   post:
 *     summary: Create a new type product
 *     tags: [TypeProduct]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Accessories
 *               description:
 *                 type: string
 *                 example: Additional items like mice, keyboards
 *     responses:
 *       201:
 *         description: Type product created successfully
 *       400:
 *         description: Name is required
 *       500:
 *         description: Internal server error
 */

export async function getAllTypeProduct(req: Request, res: Response):Promise<void> {
    try {
        const typeProduct = await TypeProductRepository.getAllTypeProduct();
    res.status(200).json(typeProduct);
    } catch (err) {
    res.status(404).json({ message: (err as Error).message });
    }
}


export async function createTypeProduct(req: Request, res: Response) :Promise<void> {
    const { name, description } = req.body;

    if (!name) {
    res.status(400).json({ message: 'Product type name is a required field.' });
    }

    try {
        await TypeProductRepository.createTypeProduct(name, description);
    res.status(201).json({ message: 'Product type created successfully.' });
    } catch (err) {
    res.status(500).json({ message: (err as Error).message });
    }
}

/**
 * @swagger
 * /api/type-product/{id}:
 *   put:
 *     summary: Update a type product by ID
 *     tags: [TypeProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Type product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Type product updated successfully
 *       400:
 *         description: Invalid ID or no update data
 *       404:
 *         description: Type product not found
 *
 *   delete:
 *     summary: Delete a type product by ID
 *     tags: [TypeProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Type product ID
 *     responses:
 *       200:
 *         description: Type product deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Type product not found
 */

export async function updateTypeProduct(req: Request, res: Response):Promise<void> {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid product type ID.' });
        }

        const updates = req.body;
        if (Object.keys(updates).length === 0) {
         res.status(400).json({ message: 'No update data provided.' });
        }

        const success = await TypeProductRepository.updateTypeProduct(id, updates);
        if (!success) {
        res.status(404).json({ message: 'Product type not found or no changes made.' });
        }
    res.status(200).json({ message: 'Product type updated successfully.' });
    } catch (err) {
     res.status(500).json({ message: (err as Error).message });
    }
}



export async function deleteTypeProduct(req: Request, res: Response):Promise<void> {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid product type ID.' });
        }

        const success = await TypeProductRepository.deleteTypeProduct(id);
        if (!success) {
         res.status(404).json({ message: 'Product type not found.' });
        }
        res.status(200).json({ message: 'Product type deleted successfully.' });
    } catch (err) {
    res.status(500).json({ message: (err as Error).message });
    }
}