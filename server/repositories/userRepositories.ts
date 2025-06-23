// import {Customer, toCustomerStructure } from "../model/UserModel";
import {sequelize} from '../db/sequelize'
import { Customer } from "../db/models";
export class CusomerRepository {
    static async getUser(phoneNumber?: string): Promise<Customer | null> {
        if (phoneNumber) {
           return await Customer.findOne({where:{phone_number:phoneNumber}}) as unknown as Customer;
        } else {
            return await Customer.findAll() as unknown as Customer;
        }       
    }
    static async createNewUser(name: string, phone_number: string, usr_profile_url:string|null,password: string):Promise<boolean | null>{
        try {
            // await db.none(
            //     'INSERT INTO Customer (name, phone_number, registration_date,profile_img_path ,password) VALUES ($(cname), $(cphone_number), $(cregistration_date), $(profile_url),$(cpass))',
            //     {
            //         cname: name,
            //         cphone_number: phone_number,
            //         cregistration_date: new Date().toISOString(), 
            //         profile_url :usr_profile_url,
            //         cpass: password
            //     }
            // );
            await Customer.create({
                name:name,
                phone_number:phone_number,
                registration_date: new Date().toISOString(),
                profile_img_path:usr_profile_url,
                password:password
            })
            console.log("User successfully created.");
            return true;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

}