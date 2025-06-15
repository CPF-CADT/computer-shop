import db from "../db/database_integretion";
import {Product,ProductQueryParams,toProductStructure} from "../model/ProductModel";

class ProductRepository {
    static async getAllProduct(category?: string , typeProduct?: string ,brand?:string): Promise<Product[] | null> {
        try {
            let query = 'SELECT * FROM productShowInformation';
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
            const data = await db.any(query, params);
            return data.map(toProductStructure);
        } catch (err) {
            console.error('Error fetching products:', err);
            return null;
        }
    }
    static async getOneProduct(productCode: string): Promise<Product | null> {
        try {
            const data = await db.one('select * from productShowInformation where product_code = $(id)', { id: productCode });
            return toProductStructure(data);
        } catch (err) {
            console.error('get data error', err);
            return null;
        }
    }
    static async getProductDetail(productCode: string): Promise<Product | null> {
        try {
            let productDetail: Product | null = await this.getOneProduct(productCode);
            let customerFeedback = await db.any('select * from customerFeedbackForProduct where product_code = $(id)', { id: productCode })
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
            console.error('get data error', err);
            return null;
        }
    }
}



export default ProductRepository;