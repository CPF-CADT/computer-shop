import { QueryTypes } from "sequelize";
import { sequelize } from "../db/sequelize";
import { Product, ProductQueryParams, toProductStructure } from "../model/ProductModel";
import { Product as ProductModel, ProductFeedback } from "../db/models";

class ProductRepository {
    static async getAllProduct(nameProduct?:string,sortType:string ='ASC',sortColumn:string ='price',category?: string, typeProduct?: string, brand?: string,page:number = 1,limit:number=10 ): Promise<Product[] | null> {
        try {
            let query = 'SELECT * FROM productshowinformation';
            const conditions: string[] = [];
            const replacements: any = {};

            if (nameProduct) {
                conditions.push('name LIKE :product_name');
                replacements.product_name = `%${nameProduct}%`;
            }
            if (category) {
                conditions.push('category_title = :category');
                replacements.category = category;
            }
            if (typeProduct) {
                conditions.push('type_product = :typeProduct');
                replacements.typeProduct = typeProduct;
            }
            if (brand) {
                conditions.push('brand_name = :brandProduct');
                replacements.brandProduct = brand;
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ` ORDER BY ${sortColumn} ${sortType.toUpperCase()} `;

            query += 'LIMIT :limit OFFSET :offset';
            replacements.limit = limit;
            replacements.offset = (page - 1) * limit;

            const data = await sequelize.query(query, {
                replacements,
                type: QueryTypes.SELECT, 
            });
            return data.map(toProductStructure);
        } catch (err) {
            throw err;
        }
    }
    static async getOneProduct(productCode: string): Promise<Product | null> {
        try {
            const data = await sequelize.query(
                'SELECT * FROM productShowInformation WHERE product_code = :id',{
                    replacements: { id: productCode },
                    type:QueryTypes.SELECT
                }
            );
            return toProductStructure(data[0]);
        } catch (err) {
            throw err;
        }
    }
    static async getProductDetail(productCode: string): Promise<Product | null> {
        try {
            let productDetail: Product | null = await this.getOneProduct(productCode);
            let customerFeedback = await sequelize.query(
                'select * from customerFeedbackForProduct where product_code = :id',{
                    replacements:{id:productCode},
                    type:QueryTypes.SELECT
                }
            );

            if (customerFeedback && customerFeedback.length > 0 && productDetail !== undefined && productDetail !== null) {
                productDetail.customerFeedback = customerFeedback.map((data: any) => ({
                    feedback_id: data.feedback_id,
                    rating: data.rating,
                    customerName: data.customer_name,
                    userProfilePath: data.user_profile_path,
                    comment: data.comment,
                    feedbackDate: new Date(data.feedback_date),
                }));
            }
            return productDetail;
        } catch (err) {
            throw err;
        }
    }
    static async addProduct(data: {
        Code: string;
        name: string;
        price: number;
        quantity: number;
        description?: string;
        category?: number;
        brand?: number;
        type_product?: number;
        image?: string;
        }): Promise<boolean | null> {
        try {
            const created = await ProductModel.create({
            product_code: data.Code,
            name: data.name,
            price: data.price,
            stock_quantity: data.quantity ?? 0,
            description: data.description,
            category_id: data.category,
            brand_id: data.brand,
            type_id: data.type_product,
            image_path: data.image,
            is_active: true,
            last_restock_date: new Date(),
            });
            if(created){
                return true;
            }
            return false;
        } catch (err) {
            console.error('Failed to add product:', err);
            return null;
        }
    }
    
    static async updateProduct(
        productCode: string,
        data: {
            name?: string;
            price?: number;
            quantity?: number;
            description?: string;
            category?: number;
            brand?: number;
            type_product?: number;
            image?: string;
            is_active?: boolean;
        }
    ): Promise<boolean | null> {
        try {
            const updateData: any = { ...data }; 
            updateData.last_restock_date = new Date();

            const [affectedCount] = await ProductModel.update(
                updateData,
                {
                    where: { product_code: productCode }
                }
            );

            // Check if any rows were affected
            return affectedCount > 0 ? true : false;
        } catch (err) {
            console.error(`Failed to update product with code ${productCode}:`, err);
            return null;
        }
    }


}



export default ProductRepository;

export class ProductFeedBackRepositories{
    static async addFeedback(productCode:string,customerId:number,rating:number,comment:string):Promise<boolean>{
        try{
            ProductFeedback.create({
                customer_id:customerId,
                product_code:productCode,
                rating:rating,
                comment:comment,
                feedback_date:new Date().toISOString(),
            })
            return true;
        }catch(err){
            throw err;
        }
    }
}