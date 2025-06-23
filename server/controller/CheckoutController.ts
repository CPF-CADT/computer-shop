import { OrderRepositories } from "../repositories/CheckoutRepositories";
import { Request, Response } from 'express';

export async function placeOrder(req: Request, res: Response) {
    try {
        const { customer_id, address_id } = req.body;
        const customer_id_int = parseInt(customer_id);
        const address_id_int = parseInt(address_id);


        if (Number.isNaN(customer_id_int) || Number.isNaN(address_id_int)) {
            res.status(400).json({ message: 'Invalid input data' });
        }

        await OrderRepositories.placeAnOrder(customer_id_int, address_id);
        res.status(200).json({ message: 'Order placed successfully' });

    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}
