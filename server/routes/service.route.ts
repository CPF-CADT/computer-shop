// src/routes/upload.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { handleImageUpload } from '../controller/services.controller';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/upload', upload.single('image'), handleImageUpload);

export default router;