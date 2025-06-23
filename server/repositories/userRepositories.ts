// import {Customer, toCustomerStructure } from "../model/UserModel";
import { Customer } from "../db/models";
import { TwoFaToken } from "../db/models/TwoFaToken";
export class CusomerRepository {
    static async getUser(phoneNumber?: string): Promise<Customer | null> {
        if (phoneNumber) {
            return await Customer.findOne({ where: { phone_number: phoneNumber } }) as unknown as Customer;
        } else {
            return await Customer.findAll() as unknown as Customer;
        }
    }
    static async createNewUser(name: string, phone_number: string, usr_profile_url: string | null, password: string): Promise<boolean | null> {
        try {
            await Customer.create({
                name: name,
                phone_number: phone_number,
                profile_img_path: usr_profile_url,
                password: password
            })
            console.log("User successfully created.");
            return true;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }
    static async login(phoneNumber: string): Promise<Customer | null> {
        const customer = await Customer.findOne({
            where: { phone_number: phoneNumber }
        });
        return customer ;
    }
}
export class TwoFaTokenRepository{
    static async getToken(customerId:number):Promise<TwoFaToken | null>{
        try{
            const customerToken = await TwoFaToken.findOne({
                where: {
                customer_id: customerId,
        },
        order: [['expire_at', 'DESC']], 
            });
            if(customerToken){
                return customerToken;
            }else{
                return null;
            }
        }catch(err){
            throw err;
        }
    }
    static async addToken(customerId: number, code: string, expire_at: Date): Promise<boolean | null> {
        try {
            await TwoFaToken.create({
                customer_id: customerId,
                code: code,
                expire_at: expire_at,
                is_used: false, 
            });
            return true;
        }catch(err){
            throw err;
        }
    }
    static async markTokenAsUsed(customerId: number): Promise<boolean> {
        try {
            const [updatedCount] = await TwoFaToken.update(
                { is_used: true },
                { where: { customer_id: customerId, is_used: false } }
            );
            return updatedCount > 0; 
        } catch (err) {
            throw err;
        }
    }
}