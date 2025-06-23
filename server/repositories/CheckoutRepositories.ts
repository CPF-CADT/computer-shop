import { Orders } from "../db/models";
import { CartItemRepository } from "./CartItemRepositories";
import { OrderItem } from "../db/models/OrderItem";
export class OrderRepositories {
    static async placeAnOrder(customer_id: number, address_id: number):Promise<Boolean | null> {
        try {
            const order = await Orders.create({
                customer_id: customer_id,
                address_id: address_id,
            });
            const orderId = order.order_id;
            const userCart = await CartItemRepository.getCart(customer_id);
            if (userCart && userCart.length > 0) {
                await Promise.all(
                    userCart.map(cart =>
                        OrderItem.create({
                            order_id: orderId,
                            product_code: cart.product_code,
                            price_at_purchase: cart.price_at_purchase,
                            qty: cart.qty,
                        })
                    )
                );
                await CartItemRepository.clearCart(customer_id);
            }
            return true;
        } catch (error) {
            console.error("Error placing order:", error);
            throw error;
        }
    }

}