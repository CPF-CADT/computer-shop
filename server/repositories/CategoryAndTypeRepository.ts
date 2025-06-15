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
}