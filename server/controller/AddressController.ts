import { Request, Response } from 'express';
import { AddressRepository } from '../repositories/AddressRepository';

export async function addCustomerAddress(req: Request, res: Response) {
    try {
        const {
            customer_id,
            street_line,
            commune,
            district,
            province,
            google_map_link
        } = req.body;

        if (!district || !province  || Number.isNaN(parseInt(customer_id))) {
            res.status(400).json({ message: 'Missing or invalid required fields.' });
        }

        const newAddress = await AddressRepository.addNewAddress({
            customer_id: customer_id,
            street_line,
            commune,
            district,
            province,
            google_map_link
        });

        res.status(201).json({
            message: 'Address added successfully.',
            data: newAddress
        });

    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export async function getCustomerAddresses(req: Request, res: Response) {
    try {
        const customer_id = Number(req.params.customer_id);
        if (Number.isNaN(customer_id)) {
            res.status(400).json({ message: 'Invalid customer_id parameter.' });
        }

        const addresses = await AddressRepository.getCustomerAddress(customer_id);
        res.status(200).json({ data: addresses });

    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export async function updateCustomerAddress(req: Request, res: Response) {
    try {
        const address_id = Number(req.params.address_id);
        if (Number.isNaN(address_id)) {
            res.status(400).json({ message: 'Invalid address_id parameter.' });
        }

        const updates = req.body;

        const [updatedRowsCount] = await AddressRepository.updateAddress(address_id, updates);
        if (updatedRowsCount === 0) {
            res.status(404).json({ message: 'Address not found or no changes made.' });
        }

        const updatedAddress = await AddressRepository.getAddressById(address_id);

        res.status(200).json({
            message: 'Address updated successfully.',
            data: updatedAddress
        });

    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export async function deleteCustomerAddress(req: Request, res: Response) {
    try {
        const address_id = Number(req.params.address_id);
        if (Number.isNaN(address_id)) {
            res.status(400).json({ message: 'Invalid address_id parameter.' });
        }

        const deletedRowsCount = await AddressRepository.deleteAddress(address_id);
        if (deletedRowsCount === 0) {
            res.status(404).json({ message: 'Address not found.' });
        }

        res.status(200).json({ message: 'Address deleted successfully.' });

    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}