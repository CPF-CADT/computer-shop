import { Sequelize } from "sequelize-typescript";
import { CartItem } from "../db/models/CartItem";
export class CartItemRepository {
    static async getCart(customerId: number): Promise<CartItem[] | null> {
        try {
            let data = await CartItem.findAll({
                where: {
                    customer_id: customerId
                }
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
            if (affectedRows > 0) {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    static async updateQuantity(customerId: number, productCode: string, changeAmount: number): Promise<boolean> {
        try {
            const [affectedCount] = await CartItem.update(
                {
                    qty: Sequelize.literal(`qty + (${changeAmount})`),
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
            await CartItem.create({
                customer_id:customerId,
                product_code:productCode,
                qty:qty,
                price_at_purchase:priceAtPurchase,
                added_at: new Date().toISOString(),
            })
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
            if (affectedRows > 0) {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
}