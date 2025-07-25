export type ProductQueryParams = {
    category?: string;
    typeProduct?: string;
    brandProduct?: string;
};
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


interface Brand {
    id: number;
    name: string;
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
export interface Product {
    readonly product_code: string;
    name: string;
    image_path: string;
    price: Price;
    stock:number,
    description: string;
    brand: Brand;
    category: Category;
    type: Type;
    feedback: ProductFeedback;
    customerFeedback?: CusomerFeedbackOnProduct[]
    readonly discount: Discount;
}

export function toProductStructure(row: any): Product {
    return {
        product_code: row.product_code,
        name: row.name,
        image_path: row.image_path,
        price: {
            amount: parseFloat(row.price),
            currency: 'USD',
        },
        stock:row.stock_quantity,
        description: row.description,
        brand: {
            id:row.brand_id,
            name:row.brand_name,
        },
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
            value: parseFloat(row.discount_value),
        },
        feedback: {
            rating: row.average_rating,
            totalReview: row.feedback_count,
        },
    };
}