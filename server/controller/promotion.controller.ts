import { Request, Response } from 'express';
import { PromotionRepository } from '../repositories/promotion.repository';

/**
 * @swagger
 * tags:
 *   name: Promotion
 *   description: Promotion management
 */


/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - discount_type
 *               - discount_value
 *               - start_date
 *               - end_date
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Summer Sale"
 *               discount_type:
 *                 type: string
 *                 description: Type of discount (e.g., percentage, fixed)
 *                 example: "percentage"
 *               discount_value:
 *                 type: number
 *                 example: 15
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-31"
 *     responses:
 *       201:
 *         description: Promotion created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal Server Error.
 */
export async function createPromotion(req: Request, res: Response): Promise<void> {
  try {
    const { title, discount_type, discount_value, start_date, end_date } = req.body;

    if (!title || !discount_type || discount_value == null || !start_date || !end_date) {
      res.status(400).json({ message: 'Missing required promotion fields.' });
      return;
    }

    const promotionData = { title, discount_type, discount_value, start_date, end_date };
    const newPromotion = await PromotionRepository.createNewPromotion(promotionData);
    res.status(201).json(newPromotion);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


/**
 * @swagger
 * /promotions/{id}:
 *   put:
 *     summary: Update an existing promotion
 *     tags: [Promotion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promotion'
 *     responses:
 *       200:
 *         description: Promotion updated successfully.
 *       400:
 *         description: Invalid promotion ID.
 *       404:
 *         description: Promotion not found.
 *       500:
 *         description: Internal Server Error.
 */
export async function updatePromotion(req: Request, res: Response): Promise<void> {
  try {
    const promotionId = parseInt(req.params.id, 10);
    if (isNaN(promotionId)) {
      res.status(400).json({ message: 'Invalid promotion ID.' });
      return;
    }

    const updatedPromotion = await PromotionRepository.updatePromotion(promotionId, req.body);
    if (!updatedPromotion) {
      res.status(404).json({ message: `Promotion with ID ${promotionId} not found.` });
      return;
    }

    res.status(200).json(updatedPromotion);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * @swagger
 * /promotions/{id}:
 *   delete:
 *     summary: Delete a promotion
 *     tags: [Promotion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Promotion deleted successfully.
 *       400:
 *         description: Invalid promotion ID.
 *       404:
 *         description: Promotion not found.
 *       500:
 *         description: Internal Server Error.
 */
export async function removePromotion(req: Request, res: Response): Promise<void> {
  try {
    const promotionId = parseInt(req.params.id, 10);
    if (isNaN(promotionId)) {
      res.status(400).json({ message: 'Invalid promotion ID.' });
      return;
    }

    const deletedCount = await PromotionRepository.removePromotion(promotionId);
    if (deletedCount === 0) {
      res.status(404).json({ message: `Promotion with ID ${promotionId} not found.` });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * @swagger
 * /promotions/apply:
 *   post:
 *     summary: Apply a promotion to a product
 *     tags: [Promotion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productCode, promotionId]
 *             properties:
 *               productCode:
 *                 type: string
 *               promotionId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Promotion applied successfully.
 *       200:
 *         description: Promotion was already applied.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal Server Error.
 */
export async function applyPromotionToProduct(req: Request, res: Response): Promise<void> {
  try {
    const { productCode, promotionId } = req.body;
    if (!productCode || !promotionId) {
      res.status(400).json({ message: 'productCode and promotionId are required.' });
      return;
    }

    const [association, created] = await PromotionRepository.applyForProduct(productCode, promotionId);
    if (created) {
      res.status(201).json({ message: 'Promotion applied successfully.', data: association });
    } else {
      res.status(200).json({ message: 'Promotion was already applied.', data: association });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * @swagger
 * /promotions/revoke/{promotionId}/{productCode}:
 *   delete:
 *     summary: Revoke a promotion from a product
 *     tags: [Promotion]
 *     parameters:
 *       - in: path
 *         name: promotionId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: productCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Promotion revoked successfully.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Promotion not found for product.
 *       500:
 *         description: Internal Server Error.
 */
export async function revokePromotionFromProduct(req: Request, res: Response): Promise<void> {
  try {
    const promotionId = parseInt(req.params.promotionId, 10);
    const { productCode } = req.params;

    if (isNaN(promotionId) || !productCode) {
      res.status(400).json({ message: 'Valid promotionId and productCode are required in the URL.' });
      return;
    }

    const revokedCount = await PromotionRepository.revokePromotionForProduct(productCode, promotionId);
    if (revokedCount === 0) {
      res.status(404).json({ message: 'Association between product and promotion not found.' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


/**
 * @swagger
 * /promotions/{id}:
 *   delete:
 *     summary: Delete a promotion by ID
 *     tags: [Promotion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the promotion to delete
 *     responses:
 *       204:
 *         description: Promotion deleted successfully.
 *       404:
 *         description: Promotion not found.
 *       500:
 *         description: Internal Server Error.
 */
export async function deletePromotion(req: Request, res: Response): Promise<void> {
  try {
    const promotionId = parseInt(req.params.id, 10);
    if (isNaN(promotionId)) {
      res.status(400).json({ message: 'Invalid promotion ID.' });
      return;
    }

    const deleted = await PromotionRepository.removePromotion(promotionId);
    if (deleted === 0) {
      res.status(404).json({ message: `Promotion with ID ${promotionId} not found.` });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
