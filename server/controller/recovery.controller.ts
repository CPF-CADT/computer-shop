import { Request, Response } from 'express';
import {FileStructure, getFileNames,findDependFullBackup} from '../service/FilePreparation'
import {restoreDatabase} from '../service/restoreDatabase'
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export async function getBackupAviable(req:Request,res:Response) {
    try{
        const fullBackup:FileStructure[] = await getFileNames(process.env.FULL_BACKUP_PATH as string)
        const differentialBackup :FileStructure[] = await getFileNames(process.env.DIFF_BACKUP_PATH as string)
        const incrementalBackup:FileStructure[] = await getFileNames(process.env.INCR_BACKUP_PATH as string)
        console.log(fullBackup)
        const responFile = [...fullBackup, ...differentialBackup, ...incrementalBackup]

            .filter(file => file.dbName === process.env.DB_RECOVERY as string)
            .map((file, index) => {
                let normalizedType: 'full' | 'incremental' | 'differential';

                if (file.type.toLowerCase() === 'full') {
                normalizedType = 'full';
                } else if (file.type.toLowerCase() === 'incr' || file.type.toLowerCase() === 'incremental') {
                normalizedType = 'incremental';
                } else if (file.type.toLowerCase() === 'diff' || file.type.toLowerCase() === 'differential') {
                normalizedType = 'differential';
                } else {
                normalizedType = 'full'; 
                }
                return {
                    id: index + 1,
                    name: file.name,
                    type: normalizedType,
                    date: new Date(file.timestamp * 1000).toISOString(),
                    baseFullId: findDependFullBackup(fullBackup.filter(file => file.dbName === process.env.DB_RECOVERY as string), file),
                };
            });

        res.status(200).json(responFile)
    }catch(err){
        res.status(500).json({message:'File Backup geting Lost'})
    }
}


export async function makeRecoveryDatabase(req: Request, res: Response) {
    try {
        const body: {
            fileRestoreList: string[]; 
        } = req.body;

        if (!body.fileRestoreList || body.fileRestoreList.length === 0) {
            res.status(400).json({ message: 'File list cannot be empty.' });
        }

        const filePaths = body.fileRestoreList.map(fileName => {
            if (fileName.startsWith('full_')) {
                return path.join(process.env.FULL_BACKUP_PATH as string, fileName);
            } else if (fileName.startsWith('diff_')) {
                return path.join(process.env.DIFF_BACKUP_PATH as string, fileName);
            } else if (fileName.startsWith('incr_')) {
                return path.join(process.env.INCR_BACKUP_PATH as string, fileName);
            }
            return null;
        }).filter(p => p !== null) as string[]; 

        if (filePaths.length !== body.fileRestoreList.length) {
            res.status(400).json({ message: 'One or more files had an unrecognized type/prefix.' });
        }

        await restoreDatabase(filePaths);

        res.status(200).json({ message: 'Database Restore Successful' });

    } catch (err) {
        res.status(500).json({ message: 'Database restore failed: ' + (err as Error).message });
    }
}