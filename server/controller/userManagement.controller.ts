import { Request, Response } from 'express';
import { UserManagement } from '../repositories/userManagement.repository'; 
export class UserManagementController {
    
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
    
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserManagement.getAllDatabaseUsers();
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching database users.', error: error.message });
        }
    }

    static async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await UserManagement.getAllDatabaseRoles();
            res.status(200).json(roles);
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching database roles.', error: error.message });
        }
    }

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
    
    static async dropRole(req: Request, res: Response) {
        const { roleName } = req.params;
        try {
            await UserManagement.dropDatabaseRole(roleName);
            res.status(200).json({ message: `Role '${roleName}' dropped successfully.` });
        } catch (error: any) {
            res.status(500).json({ message: 'Error dropping role.', error: error.message });
        }
    }

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

    static async showRolePermissions(req: Request, res: Response) {
        const { roleName } = req.params;
        try {
            const grants = await UserManagement.getPermissionsForRole(roleName);
            res.status(200).json({ grants });
        } catch (error: any) {
            res.status(500).json({ message: 'Error getting role permissions.', error: error.message });
        }
    }

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
    
    static async getAllTables(req: Request, res: Response) {
    try {
        const tables = await UserManagement.getAllTables();
        res.status(200).json(tables);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching tables.', error: error.message });
    }
}
}


