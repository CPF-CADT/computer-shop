import db from "./database_integretion";

class ProductModel {
    static async getAllProduct(category:string = '',typeProduct:string=''): Promise<Product[] | null> {
        try {
            let data :any;
            if(category!=='' && typeProduct!==''){
                data = await db.any('select * from productShowInformation where category_title = $(ctitle) and type_product = $(tPro)',{ctitle:category,tPro:typeProduct});
            }else if(typeProduct!==''){
                data = await db.any('select * from productShowInformation where type_product = $(tPro)',{tPro:typeProduct});
                console.log('search_by type',data)
            }else if(category!==''){
                data = await db.any('select * from productShowInformation where category_title = $(ctitle)',{ctitle:category});
                console.log('search by category',category)
            }else{
                data = await db.any('select * from productShowInformation');
            }
            return data.map(toProductStructure);
        } catch (err) {
            console.error('get data error', err);
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
            if (customerFeedback && customerFeedback.length > 0 && productDetail !== undefined && productDetail!==null) {
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

interface Price {
    amount: number;
    currency: 'USD' | 'KHR';
}

interface Category {
    id: number;
    title: string;
}

interface Type {
    id: number;
    title: string;
}

interface Discount {
    type: "percentage" | "fixed" | string;
    value: number;
}
interface ProductFeedback {
    rating: number;
    totalReview: number;
}
interface CusomerFeedbackOnProduct {
    feedback_id: number;
    rating: number;
    customerName: string;
    userProfilePath: string;
    comment: string;
    feedbackDate: Date;
}
interface Product {
    readonly product_code: string;
    name: string;
    image_path: string;
    price: Price;
    description: string;
    brand: string;
    category: Category;
    type: Type;
    feedback: ProductFeedback;
    customerFeedback?: CusomerFeedbackOnProduct[]
    readonly discount: Discount;
}

function toProductStructure(row: any): Product {
    return {
        product_code: row.product_code,
        name: row.name,
        image_path: row.image_path,
        price: {
            amount: row.price,
            currency: 'USD',
        },
        description: row.description,
        brand: row.brand,
        category: {
            id: row.category_id,
            title: row.category_title,
        },
        type: {
            id: row.type_id,
            title: row.type_product,
        },
        discount: {
            type: row.discount_type,
            value: row.discount_value,
        },
        feedback: {
            rating: row.rating,
            totalReview: row.count_feedback_by_product,
        },
    };
}


export default ProductModel;