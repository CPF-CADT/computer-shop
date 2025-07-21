import { Op } from "sequelize";
import { Customer } from "../db/models";
import { TwoFaToken } from "../db/models/TwoFaToken";
interface CustomerAttributes {
  customer_id: number;
  name: string;
  phone_number: string;
  usr_profile_url: string | null;
  password: string;
}
export class CusomerRepository {
    static async getUser(phoneNumber?: string, id?: number): Promise<Customer | null> {
        if (phoneNumber && phoneNumber!=='') {
            return await Customer.findOne({ where: { phone_number: phoneNumber } }) as Customer;
        } else if (id) {
            return await Customer.findByPk(id) as Customer;
        } else{
            return null;
        }
    }
    static async getAllUsers(customerId?: number, phoneNumber?: string, name?: string,isVerifyed?: boolean, sortType: string = 'ASC', sortColumn: string = 'name', page: number = 1, limit: number = 10){
       const allowedSortTypes = ['ASC', 'DESC'];
        const validSortType = allowedSortTypes.includes(sortType.toUpperCase()) ? sortType.toUpperCase() : 'ASC';

        const allowedSortColumns = ['name', 'phone_number', 'registration_date', 'customer_id']; // Added customer_id for sorting
        const validSortColumn = allowedSortColumns.includes(sortColumn) ? sortColumn : 'name';

        const conditions: any[] = [];

        if (customerId !== undefined && customerId !== 0) { // Handle customerId filter
            conditions.push({ customer_id: customerId });
        }
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
        if (isVerifyed !== undefined) { // Handle isVerifyed filter
            conditions.push({ is_verifyed: isVerifyed });
        }

        const whereClause = conditions.length > 0 ? { [Op.and]: conditions } : {}; // Use Op.and for multiple conditions

        try {
            return await Customer.findAll({
                where: whereClause,
                order: [[validSortColumn, validSortType]],
                limit,
                offset: (page - 1) * limit,
            });
        } catch (error) {
            console.error("Error in CusomerRepository.getAllUsers:", error);
            throw error;
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
    static async markCustomerAsVerified(customerId: number): Promise<boolean> {
    try {
      const [affectedCount] = await Customer.update(
        { is_verifyed: true },
        {
          where: { customer_id: customerId }
        }
      );
      return affectedCount > 0;
    } catch (error) {
      console.error("Error marking customer as verified:", error);
      throw error;
    }
  }
}
export class TwoFaTokenRepository {
  public static async getToken(customerId: number): Promise<TwoFaToken | null> {
    const now = new Date();
    return TwoFaToken.findOne({
      where: {
        customer_id: customerId,
        is_used: false,
        expire_at: {
          [Op.gt]: now, 
        },
      },
      order: [['expire_at', 'DESC']], 
    });
  }

  public static async addToken(customerId: number, code: string, expireAt: Date): Promise<TwoFaToken> {
    await TwoFaToken.update(
      { is_used: true }, 
      {
        where: {
          customer_id: customerId,
          is_used: false,
          expire_at: {
            [Op.gt]: new Date(), 
          },
        },
      }
    );

    return TwoFaToken.create({
      customer_id: customerId,
      code: code,
      expire_at: expireAt,
      is_used: false,
      last_sent_at: new Date(), 
    });
  }

  public static async markTokenAsUsed(customerId: number): Promise<boolean> {
    const [affectedCount] = await TwoFaToken.update(
      { is_used: true },
      {
        where: {
          customer_id: customerId,
          is_used: false, // Only mark unused tokens
        },
      }
    );
    return affectedCount > 0;
  }

  public static async updateTokenLastSent(customerId: number, timestamp: Date): Promise<boolean> {
    const [affectedCount] = await TwoFaToken.update(
      { last_sent_at: timestamp },
      {
        where: {
          customer_id: customerId,
          is_used: false, 
          expire_at: {
            [Op.gt]: new Date(), 
          },
        },
      }
    );
    return affectedCount > 0;
  }
}
