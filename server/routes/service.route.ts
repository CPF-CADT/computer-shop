import { Router } from 'express';
import { handleChunkedUpload } from '../controller/fileUpload.controller';

const ServiceRouter = Router();

ServiceRouter.post('/upload', handleChunkedUpload);

export default ServiceRouter;
