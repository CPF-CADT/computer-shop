import { Staff } from '../db/models/Staff';
import { CreationAttributes } from 'sequelize';

export class StaffRepository {
    static async create(staffData: CreationAttributes<Staff>): Promise<Staff> {
        return await Staff.create(staffData);
    }
    static async findByEmail(email: string): Promise<Staff | null> {
        return await Staff.findOne({ where: { email } });
    }
    static async findAll(activeOnly: boolean = true): Promise<Staff[]> {
        return await Staff.findAll({
            where: activeOnly ? { is_active: true } : {},
            include: [{
                model: Staff,
                as: 'manager',
                attributes: ['staff_id', 'name', 'position']
            }]
        });
    }
    static async findById(staffId: number): Promise<Staff | null> {
        return await Staff.findByPk(staffId, {
            include: [
                { model: Staff, as: 'manager' },
            ]
        });
    }

    static async update(staffId: number, updateData: Partial<Staff>): Promise<Staff | null> {
        const staff = await Staff.findByPk(staffId);
        if (!staff) {
            return null;
        }
        return await staff.update(updateData);
    }

    static async deactivate(staffId: number): Promise<Staff | null> {
        return this.update(staffId, { is_active: false });
    }
}