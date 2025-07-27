import { Request, Response, NextFunction } from 'express';
import JWT from '../service/JWT';
import { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  id: number;
  phone_number: string;
  name: string;
  profile_img_path: string;
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
    const decoded = JWT.verify(token) as UserPayload;

    req.user = {
      id: decoded.id,
      phone_number: decoded.phone_number,
      name: decoded.name,
      profile_img_path: decoded.profile_img_path,
      role: decoded.role,
    };

    next();
  } catch (err: any) {
    return res.status(401).json({ message: err.message || 'Unauthorized: Invalid token' });
  }
}

type Role = 'admin' | 'staff' | 'customer';

export function authorize(requiredRole: Role) {
  const roleHierarchy: Record<Role, number> = {
    customer: 1,
    staff: 2,
    admin: 3,
  };

  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.role) {
      return res.status(401).json({ message: 'Unauthorized: User data not found' });
    }

    if (requiredRole === 'customer' && user.role !== 'customer') {
      return res.status(403).json({ message: 'Forbidden: Staff/Admin cannot access customer area' });
    }

    if (requiredRole === 'staff' && (user.role === 'staff' || user.role === 'admin')) {
      return next();
    }

    if (user.role === requiredRole) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden: You do not have sufficient permissions' });
  };
}
