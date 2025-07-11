import { Request, Response } from 'express';
import { UserManagement } from '../repositories/userManagement.repository'; 
export class UserManagementController {
    
    /**
     * @swagger
     * tags:
     *   - name: User Management
     *     description: API for managing database users and roles
     */

    /**
     * @swagger
     * /api/db/users:
     *   post:
     *     summary: Create a new MySQL user
     *     tags: [User Management]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - password
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *               host:
     *                 type: string
     *                 example: "%"
     *               expireDays:
     *                 type: integer
     *                 example: 30
     *     responses:
     *       201:
     *         description: User created successfully
     *       400:
     *         description: Missing username or password
     *       500:
     *         description: Server error
     */

    static async createUser(req: Request, res: Response) {
        const { username, password, host, expireDays } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required.' });
        }
        try {
            await UserManagement.createDatabaseUser(username, password, host, expireDays);
            res.status(201).json({ message: `User '${username}' created successfully.` });
        } catch (error: any) {
            res.status(500).json({ message: 'Error creating database user.', error: error.message });
        }
    }

    /**
     * @swagger
     * /api/db/users:
     *   get:
     *     summary: Get all MySQL users
     *     tags: [User Management]
     *     responses:
     *       200:
     *         description: A list of users
     *       500:
     *         description: Server error
     */

    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserManagement.getAllDatabaseUsers();
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching database users.', error: error.message });
        }
    }

     /**
     * @swagger
     * /api/db/users/{username}/permissions:
     *   get:
     *     summary: Get permissions of a specific user
     *     tags: [User Management]
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: host
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User permissions
     *       500:
     *         description: Server error
     */
    
    static async showUserPermissions(req: Request, res: Response) {
        const { username } = req.params;
        const { host } = req.query;
        try {
            const grants = await UserManagement.getPermissionsForUser(username, host as string | undefined);
            res.status(200).json({ grants });
        } catch (error: any) {
            res.status(500).json({ message: 'Error getting user permissions.', error: error.message });
        }
    }

    /**
     * @swagger
     * /api/db/users/grant-role:
     *   post:
     *     summary: Grant a role to a user
     *     tags: [User Management]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - roleName
     *               - username
     *             properties:
     *               roleName:
     *                 type: string
     *               username:
     *                 type: string
     *               host:
     *                 type: string
     *     responses:
     *       200:
     *         description: Role granted successfully
     *       400:
     *         description: Missing required fields
     *       500:
     *         description: Server error
    */
   
   static async grantRoleToUser(req: Request, res: Response) {
       const { roleName, username, host } = req.body;
       if (!roleName || !username) {
           res.status(400).json({ message: 'roleName and username are required.' });
        }
        try {
            await UserManagement.grantRoleToUser(roleName, username, host);
            res.status(200).json({ message: `Role '${roleName}' granted to user '${username}' successfully.` });
        } catch (error: any) {
            res.status(500).json({ message: 'Error granting role to user.', error: error.message });
        }
    }

    /**
     * @swagger
     * /api/db/users/{username}:
     *   delete:
     *     summary: Delete a MySQL user
     *     tags: [User Management]
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               host:
     *                 type: string
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       500:
     *         description: Server error
     */
    
    static async dropUser(req: Request, res: Response) {
        const { username } = req.params;
        const { host } = req.body;
        try {
            await UserManagement.dropDatabaseUser(username, host);
            res.status(200).json({ message: `User '${username}' dropped successfully.` });
        } catch (error: any) {
            res.status(500).json({ message: 'Error dropping user.', error: error.message });
        }
    }
    

    /**
     * @swagger
     * /api/db/roles:
     *   post:
     *     summary: Create a new role
     *     tags: [User Management]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - roleName
     *             properties:
     *               roleName:
     *                 type: string
     *     responses:
     *       201:
     *         description: Role created successfully
     *       400:
     *         description: Missing roleName
     *       500:
     *         description: Server error
     */

    static async createRole(req: Request, res: Response) {
        const { roleName } = req.body;
        if (!roleName) {
            res.status(400).json({ message: 'roleName is required.' });
        }
        try {
            await UserManagement.createDatabaseRole(roleName);
            res.status(201).json({ message: `Role '${roleName}' created successfully.` });
        } catch (error: any) {
            res.status(500).json({ message: 'Error creating database role.', error: error.message });
        }
    }
    
    /**
     * @swagger
     * /api/db/roles:
     *   get:
     *     summary: Get all roles
     *     tags: [User Management]
     *     responses:
     *       200:
     *         description: A list of roles
     *       500:
     *         description: Server error
     */

    static async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await UserManagement.getAllDatabaseRoles();
            res.status(200).json(roles);
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching database roles.', error: error.message });
        }
    }

    /**
     * @swagger
     * /api/db/roles/{roleName}/permissions:
     *   get:
     *     summary: Get permissions of a specific role
     *     tags: [User Management]
     *     parameters:
     *       - in: path
     *         name: roleName
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Role permissions
     *       500:
     *         description: Server error
     */

    static async showRolePermissions(req: Request, res: Response) {
        const { roleName } = req.params;
        try {
            const grants = await UserManagement.getPermissionsForRole(roleName);
            res.status(200).json({ grants });
        } catch (error: any) {
            res.status(500).json({ message: 'Error getting role permissions.', error: error.message });
        }
    }

     /**
     * @swagger
     * /api/db/tables:
     *   get:
     *     summary: Get all tables
     *     tags: [User Management]
     *     responses:
     *       200:
     *         description: A list of tables
     *       500:
     *         description: Server error
     */
    
    static async getAllTables(req: Request, res: Response) {
        try {
            const tables = await UserManagement.getAllTables();
            res.status(200).json(tables);
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching tables.', error: error.message });
        }
    }

    /**
     * @swagger
     * /api/db/roles/grant-permissions:
     *   post:
     *     summary: Grant permissions to a role
     *     tags: [User Management]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - roleName
     *               - permissions
     *             properties:
     *               roleName:
     *                 type: string
     *               permissions:
     *                 type: array
     *                 items:
     *                   type: string
     *               tableName:
     *                 type: string
     *     responses:
     *       200:
     *         description: Permissions granted
     *       400:
     *         description: Missing fields or bad format
     *       500:
     *         description: Server error
     */

    static async grantPermissionsToRole(req: Request, res: Response) {
        const { roleName, permissions, tableName } = req.body;
        if (!roleName || !permissions || !Array.isArray(permissions)) {
            res.status(400).json({ message: 'A roleName and an array of permissions are required.' });
        }
        try {
            await UserManagement.grantPermissionsToRole(roleName, permissions, tableName);
            const targetDescription = tableName ? `table '${tableName}'` : 'all tables';
            res.status(200).json({ message: `Permissions granted to role '${roleName}' on ${targetDescription} successfully.` });
        } catch (error: any) {
            res.status(500).json({ message: 'Error granting permissions to role.', error: error.message });
        }
    }

    /**
     * @swagger
     * /api/db/roles/revoke-permissions:
     *   post:
     *     summary: Revoke permissions from a role
     *     tags: [User Management]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - roleName
     *               - permissions
     *             properties:
     *               roleName:
     *                 type: string
     *               permissions:
     *                 type: array
     *                 items:
     *                   type: string
     *               tableName:
     *                 type: string
     *     responses:
     *       200:
     *         description: Permissions revoked
     *       400:
     *         description: Missing fields or bad format
     *       500:
     *         description: Server error
     */
    
    static async revokePermissions(req: Request, res: Response) {
        const { roleName, permissions, tableName } = req.body;
        if (!roleName || !permissions || !Array.isArray(permissions)) {
            res.status(400).json({ message: 'A roleName and an array of permissions are required.' });
        }
        try {
            await UserManagement.revokePermissionsFromRole(roleName, permissions, tableName);
            res.status(200).json({ message: `Permissions revoked from role '${roleName}' successfully.` });
        } catch (error: any) {
            res.status(500).json({ message: 'Error revoking permissions.', error: error.message });
        }
    }
    
    /**
     * @swagger
     * /api/db/roles/{roleName}:
     *   delete:
     *     summary: Delete a role
     *     tags: [User Management]
     *     parameters:
     *       - in: path
     *         name: roleName
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Role deleted successfully
     *       500:
     *         description: Server error
     */

    static async dropRole(req: Request, res: Response) {
        const { roleName } = req.params;
        try {
            await UserManagement.dropDatabaseRole(roleName);
            res.status(200).json({ message: `Role '${roleName}' dropped successfully.` });
        } catch (error: any) {
            res.status(500).json({ message: 'Error dropping role.', error: error.message });
        }
    }
}


