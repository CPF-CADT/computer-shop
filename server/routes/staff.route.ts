import { Router } from 'express';
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deactivateStaff
} from '../controller/staff.controller';

export const staffRouter = Router();

staffRouter.post('/',createStaff);
staffRouter.get('/', getAllStaff);
staffRouter.get('/:id', getStaffById);
staffRouter.put('/:id', updateStaff);
staffRouter.delete('/:id', deactivateStaff);