import { CartItem } from "../db/models/CartItem";
import { Product } from "../db/models/Product";

export class CartItemRepository {
    static async getCart(customerId: number): Promise<CartItem[] | null> {
        try {
            let data = await CartItem.findAll({
                include: [
                        {
                            model: Product,
                            attributes: ['product_code', 'name', 'image_path'],
                        },
                ],
                where: {
                    customer_id: customerId
                },
            })
            return data;
        } catch (err) {
            throw err;
        }
    }

    static async remove(customerId: number, productCode: string): Promise<boolean> {
        try {
            const affectedRows = await CartItem.destroy({
                where: {
                    customer_id: customerId,
                    product_code: productCode,
                }
            });
            return affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async setQuantity(customerId: number, productCode: string, newQuantity: number): Promise<boolean> {
        try {
            if (newQuantity <= 0) {
                return this.remove(customerId, productCode);
            }

            const [affectedCount] = await CartItem.update(
                {
                    qty: newQuantity, 
                },
                {
                    where: {
                        customer_id: customerId,
                        product_code: productCode,
                    },
                }
            );
            return affectedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    static async addToCart(customerId:number,productCode:string,qty:number,priceAtPurchase:number):Promise<boolean> {
        try {
            const existingItem = await CartItem.findOne({
                where: { customer_id: customerId, product_code: productCode }
            });

            if (existingItem) {
                const newQty = existingItem.qty + qty;
                await this.setQuantity(customerId, productCode, newQty);
            } else {
                await CartItem.create({
                    customer_id: customerId,
                    product_code: productCode,
                    qty: qty,
                    price_at_purchase: priceAtPurchase,
                    added_at: new Date().toISOString(),
                });
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async clearCart(customerId:number):Promise<boolean>{
        try {
            const affectedRows = await CartItem.destroy({
                where: {
                    customer_id: customerId,
                }
            });
            return affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}
