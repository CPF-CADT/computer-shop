import { QueryTypes } from "sequelize";
import { sequelize } from "../db/sequelize";
import { Product, ProductQueryParams, toProductStructure } from "../model/ProductModel";
import { ProductFeedback } from "../db/models";

class ProductRepository {
    static async getAllProduct(category?: string, typeProduct?: string, brand?: string): Promise<Product[] | null> {
        try {
            let query = 'SELECT * FROM productshowinformation';
            const params: ProductQueryParams = {};
            const conditions: string[] = [];
            if (category) {
                conditions.push('category_title = $(category)');
                params.category = category;
            }
            if (typeProduct) {
                conditions.push('type_product = $(typeProduct)');
                params.typeProduct = typeProduct;
            }
            if (brand) {
                conditions.push('brand_name = $(brandProduct)');
                params.brandProduct = brand;
            }
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }
            const data = await sequelize.query(query);
            return data[0].map(toProductStructure);
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