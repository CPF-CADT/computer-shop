import { ProductPromotion } from "../db/models/ProductPromotion";
import { Promotion } from "../db/models/Promotion";
import { DiscountType } from "../db/models/Enums";
import { CreationAttributes, Op } from 'sequelize';
import { Product } from "../db/models/Product";

interface IUpdatePromotion {
    title?: string;
    description?: string;
    discount_type?: DiscountType;
    discount_value?: number;
    start_date?: Date;
    end_date?: Date;
}


export class PromotionRepository {
    static async getAllPromotions(): Promise<Promotion[]> {
        try {
            const promotions = await Promotion.findAll({
                // You can add ordering here if needed, e.g., order: [['start_date', 'DESC']]
            });
            return promotions;
        } catch (error) {
            console.error("Error fetching all promotions:", error);
            throw new Error("Failed to fetch promotions.");
        }
    }

    static async createNewPromotion(promotionData: CreationAttributes<Promotion>): Promise<Promotion> {
        try {
            // The `promotionData` argument now perfectly matches what `create` expects.
            const newPromotion = await Promotion.create(promotionData);
            return newPromotion;
        } catch (error) {
            console.error("Error creating new promotion:", error);
            throw new Error("Failed to create promotion.");
        }
    }

    static async updatePromotion(promotionId: number, updateData: IUpdatePromotion): Promise<Promotion | null> {
        try {
            const promotion = await Promotion.findByPk(promotionId);
            if (!promotion) {
                console.warn(`Promotion with ID ${promotionId} not found.`);
                return null;
            }
            await promotion.update(updateData);
            return promotion;
        } catch (error) {
            console.error(`Error updating promotion with ID ${promotionId}:`, error);
            throw new Error("Failed to update promotion.");
        }
    }

    static async removePromotion(promotionId: number): Promise<number> {
        try {
            const result = await Promotion.destroy({
                where: { promotion_id: promotionId }
            });
            return result;
        } catch (error) {
            console.error(`Error removing promotion with ID ${promotionId}:`, error);
            throw new Error("Failed to remove promotion.");
        }
    }

    static async applyForProduct(productCode: string, promotionId: number): Promise<[ProductPromotion, boolean]> {
        try {
            const [productPromotion, created] = await ProductPromotion.findOrCreate({
                where: {
                    product_code: productCode,
                    promotion_id: promotionId
                }
            });
            return [productPromotion, created];
        } catch (error) {
            console.error(`Error applying promotion ${promotionId} to product ${productCode}:`, error);
            throw new Error("Failed to apply promotion to product.");
        }
    }

    static async revokePromotionForProduct(productCode: string, promotionId: number): Promise<number> {
        try {
            const result = await ProductPromotion.destroy({
                where: {
                    product_code: productCode,
                    promotion_id: promotionId
                }
            });
            return result;
        } catch (error) {
            console.error(`Error revoking promotion ${promotionId} from product ${productCode}:`, error);
            throw new Error("Failed to revoke promotion for product.");
        }
    }
    static async applyPromotionToProductsByCriteria(
        promotionId: number,
        productCodes?: string[],
        categoryIds?: number[],
        typeIds?: number[],
        brandIds?: number[]
    ): Promise<ProductPromotion[]> {
        if (!promotionId) {
            throw new Error("Promotion ID is required.");
        }

        const productWhereClause: any = {};
        const productInclude: any[] = [];

        if (productCodes && productCodes.length > 0) {
            productWhereClause.product_code = { [Op.in]: productCodes };
        }

        if (categoryIds && categoryIds.length > 0) {
            productWhereClause.category_id = { [Op.in]: categoryIds };
        }

        if (typeIds && typeIds.length > 0) {
            productWhereClause.type_id = { [Op.in]: typeIds };
        }

        if (brandIds && brandIds.length > 0) {
            productWhereClause.brand_id = { [Op.in]: brandIds };
        }

        if (Object.keys(productWhereClause).length === 0 && (!productCodes || productCodes.length === 0)) {
            return [];
        }

        try {
            const productsToApply = await Product.findAll({
                where: productWhereClause,
            });

            const associations: ProductPromotion[] = [];
            for (const product of productsToApply) {
                const [productPromotion, created] = await ProductPromotion.findOrCreate({
                    where: {
                        product_code: product.product_code,
                        promotion_id: promotionId
                    }
                });
                associations.push(productPromotion);
            }
            return associations;

        } catch (error) {
            console.error(`Error applying promotion ${promotionId} by criteria:`, error);
            throw new Error("Failed to apply promotion by criteria.");
        }
    }
}