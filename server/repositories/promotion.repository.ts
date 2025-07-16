import { ProductPromotion } from "../db/models/ProductPromotion";
import { Promotion } from "../db/models/Promotion";
import { DiscountType } from "../db/models/Enums";
import { CreationAttributes } from 'sequelize';

interface IUpdatePromotion {
    title?: string;
    description?: string;
    discount_type?: DiscountType;
    discount_value?: number;
    start_date?: Date;
    end_date?: Date;
}


export class PromotionRepository {
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
}