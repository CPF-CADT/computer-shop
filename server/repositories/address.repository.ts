import { Address } from '../db/models/Address';

interface AddressAtri {
    street_line?: string;
    commune?: string;
    district: string;
    province: string;
    google_map_link?: string;
    customer_id: number;
}

export class AddressRepository {

    static async addNewAddress(address: AddressAtri) {
        return await Address.create({
            customer_id: address.customer_id,
            street_line: address.street_line,
            commune: address.commune,
            district: address.district,
            province: address.province,
            google_map_link: address.google_map_link
        });
    }

    static async getCustomerAddress(customer_id: number) {
        return await Address.findAll({
            where: { customer_id }
        });
    }

    static async updateAddress(address_id: number, updates: Partial<AddressAtri>) {
        return await Address.update(updates, {
            where: { id: address_id }
        });
    }

    static async deleteAddress(address_id: number) {
        return await Address.destroy({
            where: { id: address_id }
        });
    }

    static async getAddressById(address_id: number) {
        return await Address.findByPk(address_id);
    }
}
