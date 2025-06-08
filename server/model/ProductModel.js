"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_integretion_1 = __importDefault(require("./database_integretion"));
class ProductModel {
    static getAllProduct(category, typeProduct, brand) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = 'SELECT * FROM productShowInformation';
                const params = {};
                const conditions = [];
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
                const data = yield database_integretion_1.default.any(query, params);
                return data.map(toProductStructure);
            }
            catch (err) {
                console.error('Error fetching products:', err);
                return null;
            }
        });
    }
    static getOneProduct(productCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield database_integretion_1.default.one('select * from productShowInformation where product_code = $(id)', { id: productCode });
                return toProductStructure(data);
            }
            catch (err) {
                console.error('get data error', err);
                return null;
            }
        });
    }
    static getProductDetail(productCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let productDetail = yield this.getOneProduct(productCode);
                let customerFeedback = yield database_integretion_1.default.any('select * from customerFeedbackForProduct where product_code = $(id)', { id: productCode });
                if (customerFeedback && customerFeedback.length > 0 && productDetail !== undefined && productDetail !== null) {
                    productDetail.customerFeedback = customerFeedback.map((data) => ({
                        feedback_id: data.feedback_id,
                        rating: data.rating,
                        customerName: data.customer_name,
                        userProfilePath: data.user_profile_path,
                        comment: data.comment,
                        feedbackDate: new Date(data.feedback_date),
                    }));
                }
                return productDetail;
            }
            catch (err) {
                console.error('get data error', err);
                return null;
            }
        });
    }
}
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
            rating: row.rating,
            totalReview: row.count_feedback_by_product,
        },
    };
}
exports.default = ProductModel;
