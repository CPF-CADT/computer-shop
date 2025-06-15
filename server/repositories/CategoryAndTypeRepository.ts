import db from "../db/database_integretion";
import {Category,toCategoryStructure,TypeProduct,toTypeProductStructure,Brand,toBrandStructure} from "../model/CategoryAndTypeModel"
export class CategoryRepository {
    static async getAllCategory():Promise<Category[] | null> {
        try {
            let data:Category[] = await db.any('select * from category');
            return data.map(toCategoryStructure);
        }catch(err){
            console.error('Error fetching category:', err);
            return null;
        }
    }
}
export class TypeProductRepository {
    static async getAllTypeProduct():Promise<TypeProduct[] | null> {
        try {
            let data:TypeProduct[] = await db.any('select * from typeproduct');
            return data.map(toTypeProductStructure);
        }catch(err){
            console.error('Error fetching type product:', err);
            return null;
        }
    }
}
export class BrandRepository{
    static async getAllBrand():Promise<Brand[] | null > {
        try {
            let data:Brand[] = await db.any('select * from brand');
            return data.map(toBrandStructure);
        }catch(err){
            console.error('Error fetching brand:', err);
            return null;
        }
    }
}