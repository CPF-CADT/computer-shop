import { Router } from 'express';
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deactivateStaff,
  staffLogin
} from '../controller/staff.controller';
import { authenticateToken, authorize } from '../middleware/authenticateToken.middleware';

export const staffRouter = Router();

staffRouter.post('/',authenticateToken,authorize('staff'),createStaff);
staffRouter.get('/',authenticateToken,authorize('staff'), getAllStaff);
staffRouter.get('/:id', authenticateToken,authorize('staff'),getStaffById);
staffRouter.put('/:id',authenticateToken,authorize('staff'), updateStaff);
staffRouter.delete('/:id',authenticateToken,authorize('admin'), deactivateStaff);
staffRouter.post('/login', staffLogin);