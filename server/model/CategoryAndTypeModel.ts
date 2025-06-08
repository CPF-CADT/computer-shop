import db from "./database_integretion";
export class CategoryModel {
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
export class TypeProductModel {
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
export class BrandModel{
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
function toCategoryStructure(row:any):Category{
    return {
        id:row.category_id,
        title:row.title,
        description:row.description
    }
}

function toTypeProductStructure(row:any):TypeProduct{
    return {
        id:row.type_id,
        title:row.name,
        description:row.description
    }
}

function toBrandStructure(row:any):Brand{
    return {
        id:row.id,
        name:row.name,
        url_logo:row.logo_url,
        website:row.website,
        country:row.country,
    }
}

interface Category {
    id:number;
    title:string;
    description?:string;
}
interface TypeProduct {
    id: number;
    title: string;
    description?:string;
}
interface Brand {
    id:number;
    name:string;
    url_logo:string;
    website:string;
    country:string;
}