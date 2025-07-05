import { Router } from 'express';
import { handleChunkedUpload } from '../controller/FileUploadController';

const ServiceRouter = Router();

ServiceRouter.post('/upload', handleChunkedUpload);

export default ServiceRouter;
