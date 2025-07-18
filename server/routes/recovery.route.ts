import { Router } from 'express';
import { getBackupAviable,makeRecoveryDatabase } from '../controller/recovery.controller'; 


export const recoveryDBRouter = Router();
recoveryDBRouter.get('/file',getBackupAviable);
recoveryDBRouter.post('',makeRecoveryDatabase)
