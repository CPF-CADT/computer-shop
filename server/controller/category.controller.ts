import { Request, Response } from 'express';
import { CategoryRepository, TypeProductRepository, BrandRepository } from '../repositories/categoryAndTypeProduct.repository';


/**
 * 
 * getAllCategory Controller
 * 
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

export async function updateCategory(req: Request, res: Response) {
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

export async function deleteCategory(req: Request, res: Response) {
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

export async function getAllBrand(req: Request, res: Response) {
    try {
        const brand = await BrandRepository.getAllBrand();
        res.status(200).json(brand);
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
    }
}

export async function createBrand(req: Request, res: Response) {
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

export async function updateBrand(req: Request, res: Response) {
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

export async function deleteBrand(req: Request, res: Response) {
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

export async function getAllTypeProduct(req: Request, res: Response) {
    try {
        const typeProduct = await TypeProductRepository.getAllTypeProduct();
        res.status(200).json(typeProduct);
    } catch (err) {
        res.status(404).json({ message: (err as Error).message });
    }
}


export async function createTypeProduct(req: Request, res: Response) {
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

export async function updateTypeProduct(req: Request, res: Response) {
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

export async function deleteTypeProduct(req: Request, res: Response) {
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