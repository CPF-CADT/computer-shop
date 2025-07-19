import { CusomerRepository } from '../repositories/user.repository';
import { Request, Response } from 'express';
import { Encryption } from '../service/encription';
import JWT from '../service/JWT';
import { TwoFaTokenRepository } from '../repositories/user.repository';
import { generate4DigitToken, getExpiryDate } from '../service/TwoFA';
import { Customer } from '../db/models';
import {sentSMS} from '../service/SentMessage'
import dotenv from 'dotenv';

dotenv.config();

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer Management
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone_number
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone_number:
 *                 type: string
 *                 example: 012345678
 *               password:
 *                 type: string
 *                 example: securePassword123
 *               profile_url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/profile.jpg
 *                 nullable: true
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Cannot get the information of user / User create failed.
 */


export async function createUser(req: Request, res: Response): Promise<void> {
    const body: {
        name: string;
        phone_number: string;
        profile_url?: string | null;
        password: string;
    } = req.body;

    const { name, phone_number, profile_url, password } = body;
    if (!name || !phone_number || !password) {
        res.status(400).json({ error: 'cannot get the information of user' });
        return;
    }
    try {
        await CusomerRepository.createNewUser(name, phone_number, (profile_url) ? profile_url : null, Encryption.hashPassword(password));
        res.status(201).json({ message: 'user create success ' });
    } catch (error) {
        // It's good practice to log the actual error on the server for debugging
        console.error("Error in createUser:", error);
        res.status(400).json({ err: 'user create fail ' });
    }
}


/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Customer login
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - password
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: 012345678
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     phone_number:
 *                       type: string
 *                     name:
 *                       type: string
 *                     profile_img_path:
 *                       type: string
 *                       format: uri
 *       400:
 *         description: User not found or password incorrect.
 */


export async function customerLogin(req: Request, res: Response): Promise<void> {
    const body: {
        phone_number: string,
        password: string,
    } = req.body;
    const { phone_number, password } = body;
    try{
        const customer: Customer | null = await CusomerRepository.login(phone_number);
        if (!customer) {
            res.status(400).json({ success: false, message: 'User not found' });
        } else if (!Encryption.verifyPassword(customer.password, password)) {
            res.status(400).json({ success: false, message: 'Password incorrect' });
        } else {
            if(process.env.IS_CHECK_2FA==='1'){
                if(customer.is_verifyed){
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
                }else{
                res.status(400).json({ success: false, message: 'user need to verified' });
                }
            }else{
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
    }catch(err){
        res.status(500).json({message:(err as Error).message})
    }
}

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get all Customers
 *     tags: [Customer]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
*       - in: query
 *         name: customer_id
 *         schema: { type: integer }
 *         description: Search Custoemr By id
 *       - in: query
 *         name: name
 *         schema: { type: string, default: '' }
 *         description: Search Custoemr By similar name
 *       - in: query
 *         name: phone_number
 *         schema: { type: string, default: '' }
 *         description: Search Custoemr By similar phone_number
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: 'ASC' }
 *         description: sort by acs [A-Z] or desc [Z-A]
 *       - in: query
 *         name: column
 *         schema: { type: string, default: 'name' }
 *         description: sort by column
 *     responses:
 *       200:
 *         description: List of Custoemrs
 * 
 */

export async function getAllCustomer(req:Request,res:Response):Promise<void>{
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
    const sortType = (req.query.sort as string)  || 'ASC'
    const sortColumn = (req.query.column as string) || 'name'
    const customerId = (req.query.customer_id as unknown as number) || 0
    const nameCustomer = (req.query.name as string) || undefined;
    const phoneNumber = (req.query.phone_number as string) || undefined;

    try{
        const customers = await CusomerRepository.getAllUsers(customerId,phoneNumber,nameCustomer,sortType,sortColumn,page,limit)
        res.status(200).send(customers);
    }catch(err){
        res.status(404).json({ message: (err as Error).message });
    }

}

/**
 * @swagger
 * /api/user/{customer_id}:
 *   put:
 *     summary: Update customer information by ID
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - password
 *               - name
 *               - profile_img_path
 *             properties:
 *               phone_number:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               profile_img_path:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       204:
 *         description: Update failed
 *       500:
 *         description: Server error
 */

export async function updateCustomerInfor(req:Request,res:Response):Promise<void> {
    const body :{
        phone_number:string,
        password:string,
        name:string,
        profile_img_path :string,
    } = req.body;
    const { customer_id } = req.params;
    try{
        const {phone_number,password,name,profile_img_path} = body;
        const isUpdate:Boolean | null = await CusomerRepository.update(Number(customer_id),name,phone_number,profile_img_path,Encryption.hashPassword(password));
        if(isUpdate){
        res.status(200).json({message:'User Update Successful'})
        }else{
        res.status(204).json({message:'User update fial!'})
        }
    }catch(err){
        res.status(500).json({message:(err as Error).message})
    }
}

/**
 * @swagger
 * /api/2fa/send-code:
 *   post:
 *     summary: Send a 4-digit verification code to a user's phone number
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "0123456789"
 *     responses:
 *       201:
 *         description: Verification code created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: verify code is create successful
 *       404:
 *         description: Phone number not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: phone number does not exixts
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: server fail + error message
 */

export async function sendVerificationCode(req: Request, res: Response):Promise<void> {
    const body: {
        phone_number: string;
    } = req.body;
    const { phone_number } = body;
    try{
        const customer = await CusomerRepository.getUser(phone_number);
        if(customer){
            const code:string = generate4DigitToken();
            const exp_date:Date = getExpiryDate(15);
            await TwoFaTokenRepository.addToken(customer.customer_id,code,exp_date);
            sentSMS(phone_number,code)
            res.status(201).json({message:'send sms to verifycation code'});
        }else{
        res.status(404).json({ message: 'phone number does not exixts' })
        }
    }catch(err){
        res.status(500).json({ err: 'sever fail ' + err })
    }
}

/**
 * @swagger
 * /api/2fa/verify-code:
 *   post:
 *     summary: Verify the 4-digit two-factor authentication code
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - code
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "0123456789"
 *               code:
 *                 type: integer
 *                 example: 1234
 *     responses:
 *       201:
 *         description: Verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: verify code successful
 *       401:
 *         description: Invalid, expired, or already-used code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: verify code is expired
 *       404:
 *         description: Phone number not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: phone number does not exixts
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: server fail + error message
 */

export async function verifyTwoFaCode(req: Request, res: Response):Promise<void> {
    const body: {
        phone_number: string;
        code:number;
    } = req.body;
    const { phone_number,code } = body;
    try{
        const customer = await CusomerRepository.getUser(phone_number);
        if(customer){
            const userToken =  await TwoFaTokenRepository.getToken(customer.customer_id);
            if(userToken){
                const now = new Date();
                if ( now < userToken.expire_at) {
                    if(userToken.is_used!==true){
                        const success: boolean = code.toString() === userToken.code;
                        if(success){
                            await TwoFaTokenRepository.markTokenAsUsed(customer.customer_id);
                            res.status(201).json({message:'verify code successful'});
                        }else{
                        res.status(401).json({message:'verify code is incorrect'});
                        }
                    }else{
                    res.status(401).json({message:'verify code is already used'});
                    }
                }else{
                res.status(401).json({message:'verify code is expired'});
                }
            }
        }else{
        res.status(404).json({ message: 'phone number does not exixts' })
        }
        res.status(400).json({ message: 'Invalid request or missing token' });
    }catch(err){
        res.status(500).json({ err: 'sever fail ' + err })
    }
}