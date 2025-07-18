import { useState, useCallback, useEffect } from "react";
import { apiService } from "../../service/api";

const expireOptions = [
    { label: "3 Months", value: 90 }, { label: "6 Months", value: 180 },
    { label: "12 Months", value: 365 }, { label: "24 Months", value: 730 }
];

const privilegeOptions = [
    "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "GRANT OPTION"
];

// Helper to calculate remaining days
function getDaysLeft(expireDate) {
    if (!expireDate) return 'N/A';
    const today = new Date();
    const exp = new Date(expireDate);
    const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days` : 'Expired';
}

// Reusable AlertBox Component
const AlertBox = ({ show, message, type, onClose }) => {
    if (!show) return null;
    const baseClasses = "flex items-center justify-between p-4 mb-4 rounded-lg shadow-md";
    const typeClasses = {
        success: "bg-green-100 text-green-800",
        error: "bg-red-100 text-red-800",
    };
    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <span>{message}</span>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

// Modal to view a user's direct permissions
const ViewPermissionsModal = ({ user, permissions, onClose }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/25 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-2xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Direct Permissions for {user.User}</h3>
                <div className="max-h-[60vh] overflow-y-auto bg-gray-50 p-4 rounded-md border">
                    {permissions && permissions.length > 0 ? (
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{permissions.join('\n')}</pre>
                    ) : (
                        <p className="text-gray-500">No direct permissions assigned.</p>
                    )}
                </div>
                <div className="flex justify-end gap-4 pt-6 mt-4 border-t">
                    <button onClick={onClose} className="cursor-pointer px-6 py-2 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};

function UpdateExpiryModal({ user, onClose, onSave }) {
    const [expireDays, setExpireDays] = useState(90);
    const handleSave = () => onSave(user.User, user.Host, expireDays);
    return (
        <div className="fixed inset-0 bg-slate-900/25 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">Update Expiry for {user.User}</h3>
                <div>
                    <label htmlFor="expireDays" className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">New Expiry In</label>
                    <select id="expireDays" value={expireDays} onChange={(e) => setExpireDays(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 cursor-pointer">
                        {expireOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button onClick={onClose} className="cursor-pointer px-6 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="cursor-pointer px-6 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition-colors">Update Expiry</button>
                </div>
            </div>
        </div>
    );
}

// Modal for confirming actions like deletion
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/25 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button onClick={onCancel} className="cursor-pointer px-6 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="cursor-pointer px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors">Confirm</button>
                </div>
            </div>
        </div>
    );
};

// Modal for success notifications
const SuccessModal = ({ title, message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/25 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-center">
                    <button onClick={onClose} className="cursor-pointer px-8 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors">OK</button>
                </div>
            </div>
        </div>
    );
};

// Main component for user management
export default function AdminManagement() {
    const [users, setUsers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [availableTables, setAvailableTables] = useState([]);
    const [userPermissions, setUserPermissions] = useState({});
    const [rolePermissions, setRolePermissions] = useState({});
    const [form, setForm] = useState({ username: "", password: "", role: "", expireDays: 90, permissionsByTable: {} });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [modal, setModal] = useState({ type: null, data: null });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [fetchedUsers, fetchedRoles, fetchedTables] = await Promise.all([
                apiService.getUsers(), apiService.getRoles(), apiService.getTables()
            ]);
            setUsers(fetchedUsers);
            setAvailableRoles(fetchedRoles);
            setAvailableTables(fetchedTables);

            const userPermsPromises = fetchedUsers.map(user => apiService.getUserPermissions(user.User));
            const userPermsResults = await Promise.all(userPermsPromises);
            setUserPermissions(fetchedUsers.reduce((acc, user, i) => ({ ...acc, [user.User]: userPermsResults[i] }), {}));

            const rolePermsPromises = fetchedRoles.map(role => apiService.getRolePermissions(role.roleName));
            const rolePermsResults = await Promise.all(rolePermsPromises);
            setRolePermissions(fetchedRoles.reduce((acc, role, i) => ({ ...acc, [role.roleName]: rolePermsResults[i] }), {}));
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
            setAlert({ show: true, message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value, ...(name === 'role' && value && { permissionsByTable: {} }) }));
    };

    const handlePermissionChangeForForm = (tableName, privilege, type) => {
        setForm(prev => {
            const newState = JSON.parse(JSON.stringify(prev.permissionsByTable));

            switch (type) {
                case 'MASTER_TOGGLE_ALL': {
                    const isMasterChecked = availableTables.every(t =>
                        privilegeOptions.every(p => newState[t]?.includes(p))
                    );
                    availableTables.forEach(t => {
                        newState[t] = isMasterChecked ? [] : [...privilegeOptions];
                    });
                    break;
                }
                case 'MASTER_TOGGLE_PRIVILEGE': {
                    const isPrivilegeCheckedForAll = availableTables.every(t => newState[t]?.includes(privilege));
                    availableTables.forEach(t => {
                        const currentPrivs = newState[t] || [];
                        if (isPrivilegeCheckedForAll) {
                            newState[t] = currentPrivs.filter(p => p !== privilege);
                        } else if (!currentPrivs.includes(privilege)) {
                            newState[t] = [...currentPrivs, privilege];
                        }
                    });
                    break;
                }
                case 'TABLE_TOGGLE_ALL': {
                    const areAllCheckedForTable = privilegeOptions.every(p => newState[tableName]?.includes(p));
                    newState[tableName] = areAllCheckedForTable ? [] : [...privilegeOptions];
                    break;
                }
                case 'SINGLE': {
                    const currentPrivs = newState[tableName] || [];
                    const newPrivs = currentPrivs.includes(privilege)
                        ? currentPrivs.filter(p => p !== privilege)
                        : [...currentPrivs, privilege];
                    newState[tableName] = newPrivs;
                    break;
                }
                default:
                    break;
            }

            Object.keys(newState).forEach(key => {
                if (!newState[key] || newState[key].length === 0) {
                    delete newState[key];
                }
            });

            return { ...prev, permissionsByTable: newState };
        });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password) return;
        try {
            await apiService.createUser({ username: form.username, password: form.password, expireDays: Number(form.expireDays), host: '%' });
            if (form.role) await apiService.grantRoleToUser(form.role, form.username);
            
            const grantPromises = Object.entries(form.permissionsByTable).map(([tableName, privileges]) => {
                if (privileges.length > 0) {
                    return apiService.grantPermissionsToUser({
                        username: form.username,
                        permissions: privileges,
                        tableName: tableName
                    });
                }
                return null;
            }).filter(Boolean);

            if (grantPromises.length > 0) await Promise.all(grantPromises);

            setModal({
                type: 'success-add',
                data: {
                    title: 'User Created!',
                    message: `User '${form.username}' was created successfully.`
                }
            });

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
            setAlert({ show: true, message: errorMessage, type: 'error' });
        }
    };

    const handleDeleteUser = (username, host) => {
        setModal({
            type: 'confirm-delete',
            data: {
                username,
                host,
                title: 'Confirm Deletion',
                message: `Are you sure you want to delete the user '${username}'? This action cannot be undone.`
            }
        });
    };

    const executeDeleteUser = async (username, host) => {
        try {
            await apiService.dropUser(username, host);
            setAlert({ show: true, message: `User '${username}' deleted.`, type: 'success' });
            fetchData();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
            setAlert({ show: true, message: errorMessage, type: 'error' });
        } finally {
            setModal({ type: null, data: null });
        }
    };

    const handleUpdateUserExpiry = async (username, host, expireDays) => {
        try {
            await apiService.updateUserExpiry({ username, host, expireDays });
            setAlert({ show: true, message: `Expiry for user '${username}' updated.`, type: 'success' });
            setModal({ type: null, data: null });
            fetchData();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
            setAlert({ show: true, message: errorMessage, type: 'error' });
        }
    };

    const isAllSelectedMasterForForm = availableTables.length > 0 && availableTables.every(t => privilegeOptions.every(p => form.permissionsByTable[t]?.includes(p)));
    const getMasterPrivilegeStatusForForm = (priv) => availableTables.length > 0 && availableTables.every(t => form.permissionsByTable[t]?.includes(priv));

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            {modal.type === 'expiry' && <UpdateExpiryModal user={modal.data} onClose={() => setModal({ type: null, data: null })} onSave={handleUpdateUserExpiry} />}
            {modal.type === 'view-permissions' && <ViewPermissionsModal user={modal.data} permissions={userPermissions[modal.data.User] || []} onClose={() => setModal({ type: null, data: null })} />}
            {modal.type === 'success-add' && modal.data && (
                <SuccessModal
                    title={modal.data.title}
                    message={modal.data.message}
                    onClose={() => {
                        setModal({ type: null, data: null });
                        setForm({ username: "", password: "", role: "", expireDays: 90, permissionsByTable: {} });
                        fetchData();
                    }}
                />
            )}
            {modal.type === 'confirm-delete' && modal.data && (
                <ConfirmModal
                    title={modal.data.title}
                    message={modal.data.message}
                    onConfirm={() => executeDeleteUser(modal.data.username, modal.data.host)}
                    onCancel={() => setModal({ type: null, data: null })}
                />
            )}
            
            <h2 className="text-3xl font-bold mb-6 text-gray-800">User Management</h2>
            <AlertBox show={alert.show} message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, show: false })} />

            <form onSubmit={handleAddUser} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">Username</label><input name="username" value={form.username} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Enter username" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">Password</label><input name="password" type="password" value={form.password} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Enter password" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">Role (Optional)</label><select name="role" value={form.role} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 cursor-pointer"><option value="">-- No Role --</option>{availableRoles.map(r => <option key={r.roleName} value={r.roleName}>{r.roleName}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">Expire In</label><select name="expireDays" value={form.expireDays} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 cursor-pointer">{expireOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                </div>
                
                {form.role === '' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Direct Permissions (if no role is selected)</label>
                        
                        <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50 mb-6">
                            <h4 className="font-bold text-gray-800 mb-3 text-lg">Master Controls (Apply to ALL tables)</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-orange-700 p-2 border border-orange-300 rounded-md bg-white cursor-pointer">
                                    <input type="checkbox" checked={isAllSelectedMasterForForm} onChange={() => handlePermissionChangeForForm(null, null, 'MASTER_TOGGLE_ALL')} className="h-4 w-4 rounded cursor-pointer" />
                                    ALL PERMISSIONS
                                </label>
                                {privilegeOptions.map(priv => (
                                    <label key={`master-form-${priv}`} className="flex items-center gap-2 text-sm p-2 cursor-pointer">
                                        <input type="checkbox" checked={getMasterPrivilegeStatusForForm(priv)} onChange={() => handlePermissionChangeForForm(null, priv, 'MASTER_TOGGLE_PRIVILEGE')} className="h-4 w-4 rounded cursor-pointer" />
                                        {priv}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto p-2 border rounded-md">
                            {availableTables.map(tableName => {
                                const areAllPrivsForTableChecked = privilegeOptions.every(p => form.permissionsByTable[tableName]?.includes(p));
                                return (
                                    <div key={tableName} className="p-3 border rounded-md bg-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-gray-700">{tableName}</h4>
                                            <label className="flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer">
                                                <input type="checkbox" checked={areAllPrivsForTableChecked} onChange={() => handlePermissionChangeForForm(tableName, null, 'TABLE_TOGGLE_ALL')} className="h-4 w-4 rounded cursor-pointer"/>
                                                All for this table
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1">
                                            {privilegeOptions.map(priv => (
                                                <label key={`${tableName}-form-${priv}`} className="flex items-center gap-1.5 text-sm cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={form.permissionsByTable[tableName]?.includes(priv) || false}
                                                        onChange={() => handlePermissionChangeForForm(tableName, priv, 'SINGLE')}
                                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                                    />
                                                    {priv}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button type="submit" className="w-full md:w-auto px-6 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors cursor-pointer">Add User</button>
            </form>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr className="text-gray-700">
                            <th className="p-4 text-left font-semibold">Username</th>
                            <th className="p-4 text-left font-semibold">Assigned Role(s)</th>
                            <th className="p-4 text-left font-semibold">Direct Permissions</th>
                            <th className="p-4 text-left font-semibold">Expires On</th>
                            <th className="p-4 text-left font-semibold">Time Left</th>
                            <th className="p-4 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="6" className="p-4 text-center">Loading users...</td></tr>
                        ) : users.map(user => (
                            <tr key={`${user.User}-${user.Host}`} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800 whitespace-nowrap">{user.User}</td>
                                <td className="p-4 text-gray-600 whitespace-nowrap">{user.roles?.join(', ') || 'N/A'}</td>
                                <td className="p-4 text-gray-600">
                                    <button onClick={() => setModal({ type: 'view-permissions', data: user })} className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 font-medium transition-colors text-xs">View</button>
                                </td>
                                <td className="p-4 text-gray-600 whitespace-nowrap">{user.expireDate}</td>
                                <td className="p-4 text-gray-600 whitespace-nowrap">{getDaysLeft(user.expireDate)}</td>
                                <td className="p-4 space-x-2 whitespace-nowrap">
                                    <button onClick={() => setModal({ type: 'expiry', data: user })} className="cursor-pointer px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 font-medium transition-colors">Update Expiry</button>
                                    <button onClick={() => handleDeleteUser(user.User, user.Host)} className="cursor-pointer px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 font-medium transition-colors">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
