import { Router } from 'express';
import { UserManagementController } from '../controller/userManagement.controller'; 


export const userManagementRouter = Router();

// --- User Routes ---
userManagementRouter.get('/users', UserManagementController.getAllUsers);
userManagementRouter.post('/users', UserManagementController.createUser);
userManagementRouter.post('/users/grant-role', UserManagementController.grantRoleToUser);
userManagementRouter.delete('/users/:username', UserManagementController.dropUser);
userManagementRouter.get('/users/:username/permissions', UserManagementController.showUserPermissions); // NEW ROUTE
userManagementRouter.get('/tables', UserManagementController.getAllTables); // NEW ROUTE
userManagementRouter.post('/users/grant-permissions', UserManagementController.grantPermissionsToUser);
userManagementRouter.post('/users/revoke-permissions', UserManagementController.revokePermissionsFromUser);
userManagementRouter.post('/users/update-expiry', UserManagementController.updateUserExpiry);


// --- Role Routes ---
userManagementRouter.get('/roles', UserManagementController.getAllRoles);
userManagementRouter.post('/roles', UserManagementController.createRole);
userManagementRouter.post('/roles/grant-permissions', UserManagementController.grantPermissionsToRole);
userManagementRouter.post('/roles/revoke-permissions', UserManagementController.revokePermissions);
userManagementRouter.delete('/roles/:roleName', UserManagementController.dropRole);
userManagementRouter.get('/roles/:roleName/permissions', UserManagementController.showRolePermissions); // NEW ROUTE
userManagementRouter.post('/roles/revoke-permissions', UserManagementController.revokePermissions);

