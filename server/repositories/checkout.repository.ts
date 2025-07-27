import { Orders, PaymentTransaction, Product } from "../db/models";
import { CartItemRepository } from "./cartItem.repository";
import { OrderItem } from "../db/models/OrderItem";
import { sequelize } from "../db/sequelize";
export class OrderRepositories {
    static async placeAnOrder(customer_id: number, address_id: number, express_handle: string | null | undefined): Promise<OrderItem[] | null> {
    // 1. Start a database transaction
    const t = await sequelize.transaction();

    try {
      const userCart = await CartItemRepository.getCart(customer_id);

      if (!userCart || userCart.length === 0) {
        await t.commit(); // Nothing to process, commit the empty transaction
        return null;
      }

      // 2. Validate stock for all cart items BEFORE proceeding
      for (const cartItem of userCart) {
        const product = await Product.findByPk(cartItem.product_code, {
          attributes: ['stock_quantity', 'name'],
          transaction: t
        });

        if (!product || product.stock_quantity < cartItem.qty) {
          throw new Error(`Insufficient stock for product: ${product?.name || cartItem.product_code}.`);
        }
      }

      // 3. Create the order record within the transaction
      const order = await Orders.create({
        customer_id: customer_id,
        address_id: address_id,
        express_handle: express_handle || null
      }, { transaction: t });

      const orderId = order.order_id;

      // 4. Create order items and decrement product stock for each item
      const createdOrderItems = await Promise.all(
        userCart.map(async (cart) => {
          // Create the order item linked to the new order
          const orderItem = await OrderItem.create({
            order_id: orderId,
            product_code: cart.product_code,
            price_at_purchase: cart.price_at_purchase,
            qty: cart.qty,
          }, { transaction: t });

          // Atomically decrement the stock quantity for the product
          await Product.decrement('stock_quantity', {
            by: cart.qty,
            where: { product_code: cart.product_code },
            transaction: t
          });

          return orderItem;
        })
      );

      await t.commit();

      return createdOrderItems;
      
    } catch (error) {
      await t.rollback();
      console.error("Error placing order, transaction rolled back:", error);
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