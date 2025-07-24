import { Request, Response } from 'express';
import { StaffRepository } from '../repositories/staff.repository';
import { CreationAttributes, Op } from 'sequelize';
import { Staff } from '../db/models/Staff';
import { Encryption } from '../service/encription';
import JWT from '../service/JWT';

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Eleanor Vance"
 *         phone_number:
 *           type: string
 *           example: "555-0101"
 *         salary:
 *           type: number
 *           format: float
 *           example: 95000.00
 *         work_schedule:
 *           type: string
 *           example: "Mon-Fri 9am-5pm"
 *         is_active:
 *           type: boolean
 *           example: true
 *         hire_date:
 *           type: string
 *           format: date
 *           example: "2018-03-15"
 *         position:
 *           type: string
 *           example: "General Manager"
 *         manager_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *       required:
 *         - name
 *         - phone_number
 *         - salary
 *         - work_schedule
 *         - hire_date
 *         - position
 *     StaffUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Eleanor Vance"
 *         phone_number:
 *           type: string
 *           example: "555-0101"
 *         salary:
 *           type: number
 *           format: float
 *           example: 95000.00
 *         work_schedule:
 *           type: string
 *           example: "Mon-Fri 9am-5pm"
 *         is_active:
 *           type: boolean
 *           example: true
 *         hire_date:
 *           type: string
 *           format: date
 *           example: "2018-03-15"
 *         position:
 *           type: string
 *           example: "General Manager"
 *         manager_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 */

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone_number
 *               - salary
 *               - work_schedule
 *               - hire_date
 *               - position
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Eleanor Vance"
 *               phone_number:
 *                 type: string
 *                 example: "555-0101"
 *               salary:
 *                 type: number
 *                 format: float
 *                 example: 95000.00
 *               work_schedule:
 *                 type: string
 *                 example: "Mon-Fri 9am-5pm"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *               hire_date:
 *                 type: string
 *                 format: date
 *                 example: "2018-03-15"
 *               position:
 *                 type: string
 *                 example: "General Manager"
 *               manager_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Staff created successfully.
 *       400:
 *         description: Missing required fields.
 *       409:
 *         description: Phone number already exists.
 *       500:
 *         description: Internal Server Error.
 */

export async function createStaff(req: Request, res: Response): Promise<void> {
    try {
        const {
            name,
            phone_number,
            salary,
            work_schedule,
            is_active,
            hire_date,
            position,
            manager_id,
        } = req.body;

        if (!name || !phone_number || salary == null || !work_schedule || !hire_date || !position) {
            res.status(400).json({ message: 'Missing required fields.' });
            return
        }

        const staffData: CreationAttributes<Staff> = {
            name,
            phone_number,
            salary,
            work_schedule,
            is_active: is_active ?? true,
            hire_date,
            position,
            manager_id: manager_id ?? null
        };

        const newStaff = await StaffRepository.create(staffData);
        res.status(201).json(newStaff);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({ message: 'Phone number already exists.' });
            return
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Retrieve a list of staff with optional filters, pagination, sorting, and relationships
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: "Filter by active status (default: true)"
 *       - in: query
 *         name: onlyManager
 *         schema:
 *           type: boolean
 *         description: "If true, returns only managers (those with no manager_id)"
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *           enum:
 *             - subordinates
 *         description: "Include related subordinates for each manager"
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: "Filter staff by name (partial match)"
 *       - in: query
 *         name: minSalary
 *         schema:
 *           type: number
 *         description: "Filter staff by minimum salary"
 *       - in: query
 *         name: maxSalary
 *         schema:
 *           type: number
 *         description: "Filter staff by maximum salary"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Number of records per page (default: 10)"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number (default: 1)"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - ASC
 *             - DESC
 *         description: "Sort direction (default: ASC)"
 *       - in: query
 *         name: column
 *         schema:
 *           type: string
 *         description: "Column to sort by (default: staff_id)"
 *     responses:
 *       200:
 *         description: "List of staff with optional metadata"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Staff'
 *       500:
 *         description: "Internal Server Error"
 */

export const getAllStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const page = parseInt(req.query.page as string) || 1;
        const sortType = (req.query.sort as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        const sortColumn = (req.query.column as string) || 'staff_id';

        const onlyManager = req.query.onlyManager === 'true';
        const includeParam = req.query.include;
        const name = req.query.name as string;
        const minSalary = req.query.minSalary ? parseFloat(req.query.minSalary as string) : null;
        const maxSalary = req.query.maxSalary ? parseFloat(req.query.maxSalary as string) : null;

        const where: any = {};

        if (onlyManager) {
            where.manager_id = null;
        }

        if (name) {
            where.name = { [Op.like]: `%${name}%` };
        }

        if (minSalary !== null || maxSalary !== null) {
            where.salary = {};
            if (minSalary !== null) where.salary[Op.gte] = minSalary;
            if (maxSalary !== null) where.salary[Op.lte] = maxSalary;
        }

        const include =
            includeParam === 'subordinates'
                ? [{ model: Staff, as: 'subordinates' }]
                : [];

        const { count, rows } = await Staff.findAndCountAll({
            where,
            include,
            order: [[sortColumn, sortType]],
            limit,
            offset: (page - 1) * limit
        });

        res.status(200).json({
            meta: {
                totalItems: count,
                page,
                totalPages: Math.ceil(count / limit),
            },
            data: rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Get a specific staff member by ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the staff member to retrieve.
 *     responses:
 *       200:
 *         description: Staff member found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Invalid staff ID supplied.
 *       404:
 *         description: Staff member not found.
 *       500:
 *         description: Internal Server Error.
 */
export const getStaffById = async (req: Request, res: Response): Promise<void> => {
    try {
        const staffId = parseInt(req.params.id, 10);
        if (isNaN(staffId)) {
            res.status(400).json({ message: 'Invalid staff ID.' });
            return;
        }

        const staff = await StaffRepository.findById(staffId);
        if (!staff) {
            res.status(404).json({ message: 'Staff member not found.' });
            return;
        }

        res.status(200).json(staff);
        return;

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }
};


/**
 * @swagger
 * /api/staff/login:
 *   post:
 *     summary: Staff login
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: alice.kim@example.com
 *               password:
 *                 type: string
 *                 example: cadt2025
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Staff not found or password incorrect.
 */

export async function staffLogin(req: Request, res: Response): Promise<void> {
    const body: {
        email: string,
        password: string,
    } = req.body;
    const { email, password } = body;

    try {
        const staff: Staff | null = await StaffRepository.findByEmail(email);
        if (!staff) {
            res.status(400).json({ success: false, message: 'Staff not found' });
        } else if (!Encryption.verifyPassword(staff.password, password)) {
            res.status(400).json({ success: false, message: 'Password incorrect' });
        } else {
            const token = JWT.create({
                id: staff.staff_id,
                email: staff.email,
                role:staff.role
            });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: staff.staff_id,
                    phone_number: staff.phone_number,
                    email: staff.email,
                    name: staff.name,
                },
                role: staff.role
            });
        }
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}


/**
 * @swagger
 * /api/staff/{id}:
 *   put:
 *     summary: Update an existing staff member
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the staff member to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StaffUpdate'
 *     responses:
 *       200:
 *         description: Staff member updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Invalid staff ID supplied.
 *       404:
 *         description: Staff member not found.
 *       500:
 *         description: Internal Server Error.
 */
export const updateStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const staffId = parseInt(req.params.id, 10);
        if (isNaN(staffId)) {
            res.status(400).json({ message: 'Invalid staff ID.' });
            return;
        }

        const updatedStaff = await StaffRepository.update(staffId, req.body);
        if (!updatedStaff) {
            res.status(404).json({ message: 'Staff member not found.' });
            return;
        }

        res.status(200).json(updatedStaff);
        return;

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }
};

/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     summary: Deactivate a staff member (soft delete)
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the staff member to deactivate.
 *     responses:
 *       204:
 *         description: Staff member deactivated successfully.
 *       400:
 *         description: Invalid staff ID supplied.
 *       404:
 *         description: Staff member not found.
 *       500:
 *         description: Internal Server Error.
 */
export const deactivateStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const staffId = parseInt(req.params.id, 10);
        if (isNaN(staffId)) {
            res.status(400).json({ message: 'Invalid staff ID.' });
            return;
        }
        const deactivatedStaff = await StaffRepository.deactivate(staffId);
        if (!deactivatedStaff) {
            res.status(404).json({ message: 'Staff member not found.' });
            return;
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deactivating staff:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};