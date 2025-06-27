import { OrderRepositories } from "../repositories/CheckoutRepositories";
import { Request, Response } from 'express';
import { TelegramBot } from "../service/TelgramBot";
import { Address, Customer } from "../db/models";
import { AddressRepository } from "../repositories/AddressRepository";

export async function placeOrder(req: Request, res: Response) {
    try {
        const { customer_id, address_id } = req.body;
        const customer_id_int = parseInt(customer_id);
        const address_id_int = parseInt(address_id);


        if (Number.isNaN(customer_id_int) || Number.isNaN(address_id_int)) {
            res.status(400).json({ message: 'Invalid input data' });
        }
            const customer = await Customer.findByPk(customer_id) as Customer;
            const customerAddress = await AddressRepository.getAddressById(customer_id) as Address;
            const orders_item = await OrderRepositories.placeAnOrder(customer_id_int, address_id);

        if (orders_item !== null && customer !== null && customerAddress) {
            const botMessage = new TelegramBot();

            const totalAmount = orders_item.reduce((sum, item) => sum + (item.price_at_purchase * item.qty), 0);

            botMessage.sendOrderNotification({
                orderId: orders_item[0].order_id,
                customerName: customer.name,
                phoneNumber: customer.phone_number,
                address: `${customerAddress.street_line}, ${customerAddress.district}, ${customerAddress.province}`, 
                totalAmount: totalAmount,
                items: orders_item.map(item => `${item.product_code} : ${item.price_at_purchase} x ${item.qty}`)
            });

            res.status(200).json({ message: 'Order placed successfully' });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}
