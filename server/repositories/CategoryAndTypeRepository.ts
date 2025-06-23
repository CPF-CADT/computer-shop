import { toCategoryStructure, toTypeProductStructure, toBrandStructure } from "../model/CategoryAndTypeModel"
import { Category, TypeProduct, Brand } from "../db/models";
import { CategoryStructure, BrandStructure, TypeProductStructure } from "../model/CategoryAndTypeModel";


export class CategoryRepository {
    static async getAllCategory(): Promise<CategoryStructure[] | null> {
        try {
            let data = await Category.findAll();
            return data.map(toCategoryStructure);
        } catch (err) {
            throw err;
        }
    }
    static async createCategory(title: string, description?: string): Promise<boolean> {
        try {
            await Category.create({
                title: title,
                description: description
            });
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async getCategoryById(id: number): Promise<CategoryStructure | null> {
        try {
            const category = await Category.findByPk(id);
            return  toCategoryStructure(category);
        } catch (err) {
            throw err;
        }
    }

    static async updateCategory(id: number, updates: { title?: string; description?: string }): Promise<boolean> {
        try {
            const [affectedCount] = await Category.update(updates, {
                where: { category_id: id },
            });
            if (affectedCount > 0) {
                return true;
            }else{
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    static async deleteCategory(id: number): Promise<boolean> {
        try {
            const affectedRows = await Category.destroy({
                where: { category_id: id },
            });
            if (affectedRows > 0) {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
}
export class TypeProductRepository {
    static async getAllTypeProduct(): Promise<TypeProductStructure[] | null> {
        try {
            const data = await TypeProduct.findAll()
            return data.map(toTypeProductStructure);
        } catch (err) {
            throw err;
        }
    }

    static async createTypeProduct(name: string, description?: string): Promise<boolean> {
        try {
            await TypeProduct.create({ name, description });
            console.log("Product Type successfully created.");
            return true;
        } catch (error) {
            console.error("Error creating Product Type:", error);
            throw error;
        }
    }

    static async updateTypeProduct(id: number, updates: { name?: string; description?: string }): Promise<boolean> {
        try {
            const [affectedCount] = await TypeProduct.update(updates, {
                where: { type_id: id },
            });
            if (affectedCount > 0) {
                console.log(`Product type with id ${id} successfully updated.`);
                return true;
            }
            console.log(`Product type with id ${id} not found for update.`);
            return false;
        } catch (error) {
            console.error(`Error updating product type with id ${id}:`, error);
            throw error;
        }
    }

    static async deleteTypeProduct(id: number): Promise<boolean> {
        try {
            const affectedRows = await TypeProduct.destroy({
                where: { type_id: id },
            });
            if (affectedRows > 0) {
                console.log(`Product type with id ${id} successfully deleted.`);
                return true;
            }
            console.log(`Product type with id ${id} not found for deletion.`);
            return false;
        } catch (error) {
            console.error(`Error deleting product type with id ${id}:`, error);
            throw error;
        }
    }
}
export class BrandRepository {
    static async getAllBrand(): Promise<BrandStructure[] | null> {
        try {
            const data = await Brand.findAll();
            return data.map(toBrandStructure);
        } catch (err) {
            throw err;
        }
    }

     static async createBrand(name: string, logo_url?: string, website?: string, country?: string): Promise<boolean> {
        try {
            await Brand.create({ name, logo_url, website, country });
            console.log("Brand successfully created.");
            return true;
        } catch (error) {
            console.error("Error creating brand:", error);
            throw error;
        }
    }

    static async updateBrand(id: number, updates: { name?: string; logo_url?: string; website?: string; country?: string }): Promise<boolean> {
        try {
            const [affectedCount] = await Brand.update(updates, {
                where: { id: id },
            });
            if (affectedCount > 0) {
                console.log(`Brand with id ${id} successfully updated.`);
                return true;
            }
            console.log(`Brand with id ${id} not found for update.`);
            return false;
        } catch (error) {
            console.error(`Error updating brand with id ${id}:`, error);
            throw error;
        }
    }

    static async deleteBrand(id: number): Promise<boolean> {
        try {
            const affectedRows = await Brand.destroy({
                where: { id: id },
            });
            if (affectedRows > 0) {
                console.log(`Brand with id ${id} successfully deleted.`);
                return true;
            }
            console.log(`Brand with id ${id} not found for deletion.`);
            return false;
        } catch (error) {
            console.error(`Error deleting brand with id ${id}:`, error);
            throw error;
        }
    }
}