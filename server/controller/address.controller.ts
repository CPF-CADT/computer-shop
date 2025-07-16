import { Request, Response } from 'express';
import { AddressRepository } from '../repositories/address.repository';

/**
 * @swagger
 * tags:
 *   - name: Address
 *     description: Customer address management
 */

/**
 * @swagger
 * /api/address-customer:
 *   post:
 *     summary: Add a new customer address
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - district
 *               - province
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               street_line:
 *                 type: string
 *                 example: "No. 123 Street"
 *               commune:
 *                 type: string
 *                 example: "Toul Svay Prey"
 *               district:
 *                 type: string
 *                 example: "Chamkarmon"
 *               province:
 *                 type: string
 *                 example: "Phnom Penh"
 *               google_map_link:
 *                 type: string
 *                 example: "https://maps.google.com/?q=11.5564,104.9282"
 *     responses:
 *       201:
 *         description: Address added successfully
 *       400:
 *         description: Missing or invalid required fields
 *       500:
 *         description: Internal server error
 */
export async function addCustomerAddress(req: Request, res: Response) {
  try {
    const {
      customer_id,
      street_line,
      commune,
      district,
      province,
      google_map_link,
    } = req.body;

    if (!district || !province || !customer_id || Number.isNaN(parseInt(customer_id))) {
      res.status(400).json({ message: 'Missing or invalid required fields.' });
      return;
    }

    const newAddress = await AddressRepository.addNewAddress({
      customer_id: parseInt(customer_id),
      street_line,
      commune,
      district,
      province,
      google_map_link,
    });

    res.status(201).json({
      message: 'Address added successfully.',
      data: newAddress,
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * @swagger
 * /api/address-customer/{customer_id}:
 *   get:
 *     summary: Get all addresses of a customer
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: List of customer addresses
 *       400:
 *         description: Invalid customer_id parameter
 *       500:
 *         description: Internal server error
 */
export async function getCustomerAddresses(req: Request, res: Response): Promise<void> {
  try {
    const customer_id = Number(req.params.customer_id);
    if (Number.isNaN(customer_id)) {
      res.status(400).json({ message: 'Invalid customer_id parameter.' });
      return;
    }

    const addresses = await AddressRepository.getCustomerAddress(customer_id);
    res.status(200).json({ data: addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * @swagger
 * /api/address-customer/{address_id}:
 *   put:
 *     summary: Update a customer address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the address to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street_line:
 *                 type: string
 *               commune:
 *                 type: string
 *               district:
 *                 type: string
 *               province:
 *                 type: string
 *               google_map_link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Invalid address_id or no update data provided
 *       404:
 *         description: Address not found or no changes made
 *       500:
 *         description: Internal server error
 */
export async function updateCustomerAddress(req: Request, res: Response): Promise<void> {
  try {
    const address_id = Number(req.params.address_id);
    if (Number.isNaN(address_id)) {
      res.status(400).json({ message: 'Invalid address_id parameter.' });
      return;
    }

    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ message: 'No update data provided.' });
      return;
    }

    const [updatedRowsCount] = await AddressRepository.updateAddress(address_id, updates);
    if (updatedRowsCount === 0) {
      res.status(404).json({ message: 'Address not found or no changes made.' });
      return;
    }

    const updatedAddress = await AddressRepository.getAddressById(address_id);

    res.status(200).json({
      message: 'Address updated successfully.',
      data: updatedAddress,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * @swagger
 * /api/address-customer/{address_id}:
 *   delete:
 *     summary: Delete a customer address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       400:
 *         description: Invalid address_id
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal server error
 */
export async function deleteCustomerAddress(req: Request, res: Response): Promise<void> {
  try {
    const address_id = Number(req.params.address_id);
    if (Number.isNaN(address_id)) {
      res.status(400).json({ message: 'Invalid address_id parameter.' });
      return;
    }

    const deletedRowsCount = await AddressRepository.deleteAddress(address_id);
    if (deletedRowsCount === 0) {
      res.status(404).json({ message: 'Address not found.' });
      return;
    }

    res.status(200).json({ message: 'Address deleted successfully.' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
