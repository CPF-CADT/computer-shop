// import {Customer, toCustomerStructure } from "../model/UserModel";
import { Op, where } from "sequelize";
import { Customer } from "../db/models";
import { TwoFaToken } from "../db/models/TwoFaToken";

interface CustomerAttributes {
  customer_id: number;
  name: string;
  phone_number: string;
  usr_profile_url: string | null;
  password: string; // This will store the hashed password
}
export class CusomerRepository {
    static async getUser(phoneNumber?: string, id?: number): Promise<Customer | null> {
        if (phoneNumber) {
            return await Customer.findOne({ where: { phone_number: phoneNumber } }) as Customer;
        } else if (id) {
            return await Customer.findByPk(id) as Customer;
        } else{
            return null;
        }
    }
    static async getAllUsers(phoneNumber?:string,name?:string,sortType:string ='ASC',sortColumn:string ='name',page:number = 1,limit:number=10 ){
        const allowedSortTypes = ['ASC', 'DESC'];
        const validSortType = allowedSortTypes.includes(sortType.toUpperCase()) ? sortType.toUpperCase() : 'ASC';

        const allowedSortColumns = ['name', 'phone_number', 'registration_date']; 
        const validSortColumn = allowedSortColumns.includes(sortColumn) ? sortColumn : 'name';

        const conditions: any[] = [];
        if (name) {
            conditions.push({
            name: {
                [Op.like]: `%${name}%`
            }
            });
        }
        if (phoneNumber) {
            conditions.push({
            phone_number: {
                [Op.like]: `%${phoneNumber}%`
            }
            });
        }
        const whereClause = conditions.length > 0 ? { [Op.or]: conditions } : {};
        return await Customer.findAll({
            where: whereClause,
            order: [[validSortColumn, validSortType]],
            limit,
            offset: (page - 1) * limit,
        });
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
    static async update(customer_id:number,name: string, phone_number: string, usr_profile_url: string | null, password: string): Promise<boolean | null> {
         try {

            const updateData: Partial<CustomerAttributes> = {
                name: name,
                phone_number: phone_number,
                usr_profile_url: usr_profile_url,
                password: password, 
            };
            const [affectedCount] = await Customer.update(
                updateData,
                {
                    where: { customer_id: customer_id }
                }
            );

            if (affectedCount > 0) {
                return true; 
            } else {
                return false; 
            }
        } catch (error) {
            return null; 
        }
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