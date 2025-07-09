import { CusomerRepository } from '../repositories/user.repository';
import { Request, Response } from 'express';
import { Encryption } from '../service/encription';
import JWT from '../service/JWT';
import { Customer } from '../db/models';
import { TwoFaTokenRepository } from '../repositories/user.repository';
import { generate4DigitToken, getExpiryDate } from '../service/TwoFA';

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
        res.status(201).json({ message: 'user create success ' })
    } catch (error) {
        res.status(400).json({ err: 'user create fail ' + error })
    }
}

export async function customerLogin(req: Request, res: Response) {
    const body: {
        phone_number: string;
        password: string;
    } = req.body;
    const { phone_number, password } = body;
    const customer: Customer | null = await CusomerRepository.login(phone_number);
    if (!customer) {
        res.status(400).json({ success: false, message: 'User not found' });
    } else if (!Encryption.verifyPassword(customer.password, password)) {
        res.status(400).json({ success: false, message: 'Password incorrect' });
    } else {
        const token = JWT.create({customer_id:customer.id,customer_phone_number:customer.phone_number});
        res.status(200).json({
            success: true, 
            message: 'Login successful', 
            token, 
            user: {
                id: customer.customer_id,
                phone_number: customer.phone_number,
                name: customer.name,
                profile_img_path:customer.profile_img_path
            }
        });
    }
}

// export async function sendVerificationCode(req: Request, res: Response) {
//     const body: {
//         phone_number: string;
//     } = req.body;
//     const { phone_number } = body;
//     try{
//         const customer = await CusomerRepository.getUser(phone_number);
//         if(customer){
//             const code:string = generate4DigitToken();
//             const exp_date:Date = getExpiryDate(15);
//             await TwoFaTokenRepository.addToken(customer.customer_id,code,exp_date);
//             res.status(201).json({message:'verify code is create successful'});
//             // need to implement sent message to user
//         }else{
//             res.status(404).json({ message: 'phone number does not exixts' })
//         }
//     }catch(err){
//             res.status(500).json({ err: 'sever fail ' + err })
//     }
// }
// export async function verifyTwoFaCode(req: Request, res: Response) {
//     const body: {
//         phone_number: string;
//         code:number;
//     } = req.body;
//     const { phone_number,code } = body;
//     try{
//         const customer = await CusomerRepository.getUser(phone_number);
//         if(customer){
//             const userToken =  await TwoFaTokenRepository.getToken(customer.customer_id);
//             if(userToken){
//                 const now = new Date();
//                 if ( now < userToken.expire_at) {
//                     if(userToken.is_used!==true){
//                         const success: boolean = code.toString() === userToken.code;
//                         if(success){
//                             await TwoFaTokenRepository.markTokenAsUsed(customer.customer_id);
//                             res.status(201).json({message:'verify code successful'});
//                         }else{
//                             res.status(401).json({message:'verify code is incorrect'});
//                         }
//                     }else{
//                         res.status(401).json({message:'verify code is already used'});
//                     }
//                 }else{
//                     res.status(401).json({message:'verify code is expired'});
//                 }
//             }
//         }else{
//             res.status(404).json({ message: 'phone number does not exixts' })
//         }
//     }catch(err){
//             res.status(500).json({ err: 'sever fail ' + err })
//     }
// }