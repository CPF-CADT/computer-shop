import { CusomerRepository } from '../repositories/userRepositories';
import { Request, Response } from 'express';
import { Encryption } from '../logic/encription';

export async function createUser(req: Request, res: Response) {
    const body: {
        name: string;
        phone_number: string;
        profile_url?: string | null;
        password: string;
    } = req.body;

    const { name, phone_number, profile_url, password } = body;
    if (!name || !phone_number || !password) {
        res.status(400).json({ error: 'cannot get the information of user' });
    }
    try {
        await CusomerRepository.createNewUser(name, phone_number, (profile_url) ? profile_url : null, Encryption.hashPassword(password));
        res.status(201).json({ message: 'user create success '})
    } catch (error) {
        res.status(400).json({ err: 'user create fail ' + error })
    }
}
