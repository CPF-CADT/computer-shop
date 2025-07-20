import express from 'express';
import { 
  createPromotion,
  updatePromotion,
  deletePromotion,
  applyPromotionToProduct,
  revokePromotionFromProduct,
  getAllPromotions
} from '../controller/promotion.controller';

export const PromotionRouter = express.Router();
PromotionRouter.get('/',getAllPromotions)
PromotionRouter.post('/', createPromotion);
PromotionRouter.put('/:id', updatePromotion);
PromotionRouter.delete('/:id', deletePromotion);
PromotionRouter.post('/apply', applyPromotionToProduct);
PromotionRouter.delete('/:promotionId/product/:productCode', revokePromotionFromProduct);
