import { Request, Response, NextFunction } from 'express';
import JWT from '../service/JWT';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || '';

    try {
        const user = JWT.verify(token);
        (req as any).user = user;
        next();
    } catch (err: any) {
        res.status(401).json({ message: err.message });
    }
}
