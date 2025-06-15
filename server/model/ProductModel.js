"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProductStructure = toProductStructure;
function toProductStructure(row) {
    return {
        product_code: row.product_code,
        name: row.name,
        image_path: row.image_path,
        price: {
            amount: row.price,
            currency: 'USD',
        },
        description: row.description,
        brand: row.brand_name,
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
            rating: row.average_rating,
            totalReview: row.feedback_count,
        },
    };
}
