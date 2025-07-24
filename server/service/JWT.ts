import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

export default class JWT {
    private static JWT_SECRET = process.env.JWT_SECRET as string;

    static create({ id, phone_number, email,role }: { id: number; phone_number?: string,email?:string ,role:string}): string {
        return jwt.sign(
            {
                id , phone_number,email,role

            },
            JWT.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    static verify(token: string): any {
        if (!token) {
            throw new Error('Access token missing');
        }

        try {
            return jwt.verify(token, JWT.JWT_SECRET);
        } catch (err) {
            throw new Error('Invalid or expired token');
        }   
    }
}


// export default class JWT {
//     private static JWT_SECRET = process.env.JWT_SECRET as string;

//     static create(user: Customer): string {
//         return jwt.sign(
//             {
//                 id: user.customer_id,
//                 phone_number: user.phone_number,
//             },
//             JWT.JWT_SECRET,
//             { expiresIn: '24h' }
//         );
//     }
//     static verify(req: Request, res: Response, next: NextFunction) {
//         const authHeader = req.headers['authorization'];
//         const token = authHeader?.split(' ')[1]; 

//         if (!token) {
//             res.status(401).json({ message: 'Access token missing' });
//             return
//         }
//         jwt.verify(token, JWT.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 res.status(403).json({ message: 'Invalid or expired token' });
//             }
//             (req as any).user = decoded; 
//             next();
//         });
//     }
// }