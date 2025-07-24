import { Request, Response, NextFunction } from 'express';
import JWT from '../service/JWT'; 
import { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
    id: number; 
    email?: string;
    phone_number?: string;
    role: 'admin' | 'staff' | 'customer'; 
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const user = JWT.verify(token) as UserPayload;
        req.user = user; 
        next();
    } catch (err: any) {
        res.status(401).json({ message: err.message || 'Unauthorized: Invalid token' });
    }
}

type Role = 'admin' | 'staff' | 'customer';

export function authorize(requiredRole: Role) {
    const roleHierarchy: Record<Role, number> = {
        'customer': 1,
        'staff': 2,
        'admin': 3 
    };

    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || !user.role) {
            return res.status(401).json({ message: 'Unauthorized: User data not found' });
        }

        const userLevel = roleHierarchy[user.role];
        const requiredLevel = roleHierarchy[requiredRole];
        if (userLevel >= requiredLevel) {
            next(); 
        } else {
            res.status(403).json({ message: 'Forbidden: You do not have sufficient permissions' });
        }
    };
}
