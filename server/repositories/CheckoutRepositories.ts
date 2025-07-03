import { Orders, PaymentTransaction } from "../db/models";
import { CartItemRepository } from "./CartItemRepositories";
import { OrderItem } from "../db/models/OrderItem";
export class OrderRepositories {
    static async placeAnOrder(customer_id: number, address_id: number): Promise<OrderItem[] | null> {
      try {
        const order = await Orders.create({
          customer_id: customer_id,
          address_id: address_id,
        });
        const orderId = order.order_id;

        const userCart = await CartItemRepository.getCart(customer_id);

        if (userCart && userCart.length > 0) {
          const createdOrderItems = await Promise.all(
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
          
          return createdOrderItems;
        }
        return null;

      } catch (error) {
        console.error("Error placing order:", error);
        throw error;
      }
    }
}
export class PaymentTransactionRepositories{
   static async addPaymentDetail(orderId: number, paymentMethodID: number,amount_pay:number,status_pay:string): Promise<Boolean> {
    try {
       await PaymentTransaction.create({
        order_id:orderId,
        pay_method_id:paymentMethodID,
        amount:amount_pay,
        status:status_pay
      }); 
      return true;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  }

  static async updatePaymentStatus(orderId: number, new_status: string): Promise<Boolean> {
    try {
      const [affectedRows] = await PaymentTransaction.update(
        { status: new_status }, 
        { where: { order_id: orderId } } 
      );
      return affectedRows > 0;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  }
  static async getTransactionByOrderId(orderId: number): Promise<PaymentTransaction | null> {
    try {
      const transaction = await PaymentTransaction.findOne({
        where: { order_id: orderId }
      });
      return transaction;
    } catch (error) {
      console.error("Error fetching transaction by order ID:", error);
      throw error;
    }
  }
}