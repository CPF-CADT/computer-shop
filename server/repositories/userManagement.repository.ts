import { sequelize } from '../db/sequelize'; // Adjust path as needed
import { QueryTypes } from 'sequelize';

const isValidIdentifier = (name: string): boolean => {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(name);
};

export class UserManagement {

    static async createDatabaseUser(
        username: string,
        password: string,
        host: string = '%',         
        expireDays: number = 90
    ) {
        if (!isValidIdentifier(username)) {
            throw new Error('Invalid username. Only alphanumeric characters and underscores are allowed.');
        }

        try {
            const escapedUsername = sequelize.escape(username);
            const escapedPassword = sequelize.escape(password);
            const escapedHost = sequelize.escape(host);

            const query = `
                CREATE USER ${escapedUsername}@${escapedHost}
                IDENTIFIED BY ${escapedPassword}
                PASSWORD EXPIRE INTERVAL ${expireDays} DAY;
            `;
            await sequelize.query(query);
            console.log(`Database user '${username}'@'${host}' created successfully.`);
        } catch (error) {
            console.error(`Error creating database user '${username}':`, error);
            throw new Error(`Failed to create database user.`);
        }
    }

    static async createDatabaseRole(roleName: string) {
        if (!isValidIdentifier(roleName)) {
            throw new Error('Invalid role name. Only alphanumeric characters and underscores are allowed.');
        }
        try {
            // Insert into roles table - note: no escape inside quotes here
            const queryInsert = `INSERT INTO roles (role_name) VALUES (${sequelize.escape(roleName)});`;
            await sequelize.query(queryInsert);

            const query = `CREATE ROLE IF NOT EXISTS ${sequelize.escape(roleName)};`;
            await sequelize.query(query);
            console.log(`Database role '${roleName}' created successfully.`);
        } catch (error) {
            console.error(`Error creating database role '${roleName}':`, error);
            throw new Error('Failed to create database role.');
        }
    }

    static async grantRoleToUser(roleName: string, username: string, host: string = '%') {
        if (!isValidIdentifier(roleName) || !isValidIdentifier(username)) {
            throw new Error('Invalid role name or username.');
        }
        try {
            const escapedRole = sequelize.escape(roleName);
            const escapedUser = sequelize.escape(username);
            const escapedHost = sequelize.escape(host);

            const grantQuery = `GRANT ${escapedRole} TO ${escapedUser}@${escapedHost};`;
            await sequelize.query(grantQuery);
            console.log(`Successfully granted role '${roleName}' to user '${username}'.`);

            const setDefaultRoleQuery = `SET DEFAULT ROLE ALL TO ${escapedUser}@${escapedHost};`;
            await sequelize.query(setDefaultRoleQuery);
            console.log(`Set default roles for user '${username}'.`);
        } catch (error) {
            console.error(`Error granting role '${roleName}' to user '${username}':`, error);
            throw new Error(`Failed to grant role to user.`);
        }
    }

    static async getAllDatabaseUsers() {
        try {
            // Fixed query to list all users from mysql.user
            const users = await sequelize.query(
                "SELECT User, Host FROM showDatabaseUser;",
                { type: QueryTypes.SELECT }
            );
            return users;
        } catch (error) {
            console.error('Error fetching all database users:', error);
            throw new Error('Failed to retrieve database users.');
        }
    }

    static async getAllDatabaseRoles() {
        try {
            const roles = await sequelize.query(
                "SELECT role_name as roleName FROM roles;",
                { type: QueryTypes.SELECT }
            );
            return roles;
        } catch (error) {
            console.error('Error fetching all database roles:', error);
            throw new Error('Failed to retrieve database roles.');
        }
    }

    static async grantPermissionsToRole(roleName: string, permissions: string[], tableName?: string) {
        if (!isValidIdentifier(roleName)) { throw new Error('Invalid role name.'); }
        if (permissions.length === 0) { throw new Error('Permissions array cannot be empty.'); }
        if (tableName && !isValidIdentifier(tableName)) { throw new Error('Invalid table name format.'); }

        const database = 'computer_shop';
        try {
            const permString = permissions.join(', ');
            const onClause = tableName ? `\`${database}\`.\`${tableName}\`` : `\`${database}\`.*`;
            const query = `GRANT ${permString} ON ${onClause} TO ${sequelize.escape(roleName)};`;
            await sequelize.query(query);
            const targetDescription = tableName ? `table '${tableName}'` : `all tables`;
            console.log(`Permissions [${permString}] granted to role '${roleName}' on ${targetDescription} in database '${database}'.`);
        } catch (error) {
            console.error(`Error granting permissions to role '${roleName}':`, error);
            throw new Error(`Failed to grant permissions to role.`);
        }
    }

    static async revokePermissionsFromRole(roleName: string, permissions: string[], tableName?: string) {
        if (!isValidIdentifier(roleName)) { throw new Error('Invalid role name.'); }
        if (permissions.length === 0) { throw new Error('Permissions array cannot be empty.'); }
        if (tableName && !isValidIdentifier(tableName)) { throw new Error('Invalid table name format.'); }

        const database = 'computer_shop';
        try {
            const permString = permissions.join(', ');
            const onClause = tableName ? `\`${database}\`.\`${tableName}\`` : `\`${database}\`.*`;
            const query = `REVOKE ${permString} ON ${onClause} FROM ${sequelize.escape(roleName)};`;
            await sequelize.query(query);
            const targetDescription = tableName ? `table '${tableName}'` : 'all tables';
            console.log(`Permissions [${permString}] revoked from role '${roleName}' on ${targetDescription}.`);
        } catch (error) {
            console.error(`Error revoking permissions from role '${roleName}':`, error);
            throw new Error(`Failed to revoke permissions from role.`);
        }
    }

    static async dropDatabaseRole(roleName: string) {
        if (!isValidIdentifier(roleName)) {
            throw new Error('Invalid role name.');
        }
        try {
            const query = `DROP ROLE ${sequelize.escape(roleName)};`;
            await sequelize.query(query);
            console.log(`Database role '${roleName}' dropped successfully.`);
        } catch (error) {
            console.error(`Error dropping database role '${roleName}':`, error);
            throw new Error('Failed to drop database role.');
        }
    }

    static async dropDatabaseUser(username: string, host: string = '%') {
        if (!isValidIdentifier(username)) {
            throw new Error('Invalid username.');
        }
        try {
            const escapedUsername = sequelize.escape(username);
            const escapedHost = sequelize.escape(host);
            const query = `DROP USER ${escapedUsername}@${escapedHost};`;
            await sequelize.query(query);
            console.log(`Database user '${username}'@'${host}' dropped successfully.`);
        } catch (error) {
            console.error(`Error dropping database user '${username}':`, error);
            throw new Error('Failed to drop database user.');
        }
    }

    static async getPermissionsForRole(roleName: string) {
        if (!isValidIdentifier(roleName)) {
            throw new Error('Invalid role name.');
        }
        try {
            const query = `SHOW GRANTS FOR ${sequelize.escape(roleName)};`;
            const [results] = await sequelize.query(query);
            return results;
        } catch (error) {
            console.error(`Error showing grants for role '${roleName}':`, error);
            throw new Error('Failed to show grants for role.');
        }
    }

    static async getPermissionsForUser(username: string, host: string = '%') {
        if (!isValidIdentifier(username)) {
            throw new Error('Invalid username.');
        }
        try {
            const escapedUsername = sequelize.escape(username);
            const escapedHost = sequelize.escape(host);
            const query = `SHOW GRANTS FOR ${escapedUsername}@${escapedHost};`;
            const [results] = await sequelize.query(query);
            return results;
        } catch (error) {
            console.error(`Error showing grants for user '${username}':`, error);
            throw new Error('Failed to show grants for user.');
        }
    }

    static async getAllTables() {
        try {
            const database = 'computer_shop';
            const tables: any[] = await sequelize.query(`SHOW TABLES FROM \`${database}\`;`, {
                type: QueryTypes.SELECT,
            });
            // Flatten the result into a simple array of strings
            return tables.map(t => Object.values(t)[0] as string);
        } catch (error) {
            console.error('Error fetching all tables:', error);
            throw new Error('Failed to retrieve tables.');
        }
    }
}
