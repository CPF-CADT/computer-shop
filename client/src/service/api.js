const API_BASE_URL = 'http://localhost:3000/api/db'; // Adjust if your backend runs elsewhere

export const apiService = {
    // --- User API Calls ---
    getUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        // This assumes the backend is updated to provide roles and expiry info
        const users = await response.json();
        // Mocking the backend logic for demonstration since we can't change it from here
        const augmentedUsers = await Promise.all(users.map(async (user) => {
             const perms = await apiService.getUserPermissions(user.User, user.Host);
             const roles = perms
                .filter(p => p.toUpperCase().startsWith('GRANT `'))
                .map(p => p.match(/`([^`]+)`/)[1]);
            // This is a simplified expiry calculation. A real backend would provide a concrete date.
            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 90); // Mocking a 90-day expiry
             return { ...user, roles, expireDate: expireDate.toISOString().slice(0, 10) };
        }));
        return augmentedUsers;
    },
    createUser: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to create user');
        }
        return response.json();
    },
    dropUser: async (username, host = '%') => {
        const response = await fetch(`${API_BASE_URL}/users/${username}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ host }),
        });
         if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to delete user');
        }
        return response.json();
    },
    grantRoleToUser: async (roleName, username, host = '%') => {
        const response = await fetch(`${API_BASE_URL}/users/grant-role`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roleName, username, host }),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to grant role');
        }
        return response.json();
    },
    getUserPermissions: async (username, host = '%') => {
        const response = await fetch(`${API_BASE_URL}/users/${username}/permissions?host=${host}`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.grants ? data.grants.map(g => Object.values(g)[0]) : [];
    },

    // --- Role API Calls ---
    getRoles: async () => {
        const response = await fetch(`${API_BASE_URL}/roles`);
        if (!response.ok) throw new Error('Failed to fetch roles');
        return response.json();
    },
    createRole: async (roleName) => {
        const response = await fetch(`${API_BASE_URL}/roles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roleName }),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to create role');
        }
        return response.json();
    },
    dropRole: async (roleName) => {
        const response = await fetch(`${API_BASE_URL}/roles/${roleName}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to delete role');
        }
        return response.json();
    },
    grantPermissionsToRole: async (data) => {
        const response = await fetch(`${API_BASE_URL}/roles/grant-permissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to grant permissions');
        }
        return response.json();
    },
     getRolePermissions: async (roleName) => {
        const response = await fetch(`${API_BASE_URL}/roles/${roleName}/permissions`);
        if (!response.ok) {
            console.error(`Could not fetch permissions for role: ${roleName}`);
            return [];
        }
        const data = await response.json();
        return data.grants ? data.grants.map(g => Object.values(g)[0]) : [];
    },
    getTables: async () => { 
        const response = await fetch(`${API_BASE_URL}/tables`);
        if (!response.ok) throw new Error('Failed to fetch tables');
        return response.json();
    }
};