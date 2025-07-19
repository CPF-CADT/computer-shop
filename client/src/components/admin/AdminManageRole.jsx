import { useState, useCallback, useEffect } from "react";
import { apiService } from "../../service/api";
// This array is the single source of truth for all privileges shown in the UI.
const privilegeOptions = [
    "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "GRANT OPTION"
];


// Modal to view permissions
const ViewPermissionsModal = ({ title, permissions, onClose }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-2xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
                <div className="max-h-[60vh] overflow-y-auto bg-gray-50 p-4 rounded-md border">
                    {permissions && permissions.length > 0 ? (
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{permissions.join('\n')}</pre>
                    ) : (
                        <p className="text-gray-500">No permissions assigned.</p>
                    )}
                </div>
                <div className="flex justify-end gap-4 pt-6 mt-4 border-t">
                    <button onClick={onClose} className="cursor-pointer px-6 py-2 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};

// Modal for confirming actions like deletion
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
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
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
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


// Main component for role management
export default function AdminManageRole() {
    const [roles, setRoles] = useState([]);
    const [availableTables, setAvailableTables] = useState([]);
    const [permissions, setPermissions] = useState({});
    const [form, setForm] = useState({ roleName: "", permissionsByTable: {} });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [modal, setModal] = useState({ type: null, data: null });

    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(true);
            const [fetchedRoles, fetchedTables] = await Promise.all([
                apiService.getRoles(),
                apiService.getTables()
            ]);
            setRoles(fetchedRoles);
            setAvailableTables(fetchedTables);

            const permsPromises = fetchedRoles.map(role => apiService.getRolePermissions(role.roleName));
            const permsResults = await Promise.all(permsPromises);
            const permsMap = fetchedRoles.reduce((acc, role, index) => {
                acc[role.roleName] = permsResults[index];
                return acc;
            }, {});
            setPermissions(permsMap);
        } catch (err) {
            setAlert({ show: true, message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

    const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

    const handleAddRole = async (e) => {
        e.preventDefault();
        if (!form.roleName) {
            setAlert({ show: true, message: "Role name is required.", type: 'error' });
            return;
        }
        try {
            await apiService.createRole(form.roleName);
            
            const grantPromises = Object.entries(form.permissionsByTable).map(([tableName, privileges]) => {
                if (privileges.length > 0) {
                    return apiService.grantPermissionsToRole({
                        roleName: form.roleName,
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
                    title: 'Role Created!',
                    message: `Role '${form.roleName}' was created successfully.`
                }
            });

        } catch (err) {
            setAlert({ show: true, message: err.message, type: 'error' });
        }
    };

    const handleDeleteRole = (roleName) => {
        setModal({
            type: 'confirm-delete',
            data: {
                roleName,
                title: 'Confirm Deletion',
                message: `Are you sure you want to delete the role '${roleName}'? This action cannot be undone.`
            }
        });
    };
    
    const executeDeleteRole = async (roleName) => {
        try {
            await apiService.dropRole(roleName);
            setAlert({ show: true, message: `Role '${roleName}' deleted.`, type: 'success' });
            fetchInitialData();
        } catch (err) {
            setAlert({ show: true, message: err.message, type: 'error' });
        } finally {
            setModal({ type: null, data: null });
        }
    };

    const isAllSelectedMasterForForm = availableTables.length > 0 && availableTables.every(t => privilegeOptions.every(p => form.permissionsByTable[t]?.includes(p)));
    const getMasterPrivilegeStatusForForm = (priv) => availableTables.length > 0 && availableTables.every(t => form.permissionsByTable[t]?.includes(priv));

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            {modal.type === 'view-role-permissions' && modal.data && (
                <ViewPermissionsModal
                    title={`Permissions for Role: ${modal.data.roleName}`}
                    permissions={permissions[modal.data.roleName] || []}
                    onClose={() => setModal({ type: null, data: null })}
                />
            )}
            {modal.type === 'success-add' && modal.data && (
                <SuccessModal
                    title={modal.data.title}
                    message={modal.data.message}
                    onClose={() => {
                        setModal({ type: null, data: null });
                        setForm({ roleName: "", permissionsByTable: {} });
                        fetchInitialData();
                    }}
                />
            )}
            {modal.type === 'confirm-delete' && modal.data && (
                <ConfirmModal
                    title={modal.data.title}
                    message={modal.data.message}
                    onConfirm={() => executeDeleteRole(modal.data.roleName)}
                    onCancel={() => setModal({ type: null, data: null })}
                />
            )}
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Role Management</h2>            
            <form onSubmit={handleAddRole} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                    <input name="roleName" value={form.roleName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Enter role name" required />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Direct Permissions</label>
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
                
                <button type="submit" className="cursor-pointer px-6 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">Add Role & Grant</button>
            </form>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md w-full">
                <style>{`
                  .modern-table-container {
                    width: 100%;
                    overflow-x: auto;
                    background: white;
                    border-radius: 0.75rem;
                    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
                  }
                  .modern-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    min-width: 340px;
                  }
                  .modern-table th, .modern-table td {
                    padding: 12px 10px;
                    text-align: left;
                    font-size: 15px;
                    border-bottom: 1px solid #f3f4f6;
                    background: white;
                  }
                  .modern-table th {
                    background: #f9fafb;
                    font-weight: 600;
                    color: #374151;
                  }
                  .modern-table tr:last-child td {
                    border-bottom: none;
                  }
                  @media (max-width: 900px) {
                    .modern-table, .modern-table th, .modern-table td {
                      font-size: 13px;
                      min-width: 100px;
                    }
                  }
                  @media (max-width: 600px) {
                    .modern-table-container {
                      border-radius: 0.5rem;
                      box-shadow: none;
                      padding: 0;
                    }
                    .modern-table, .modern-table thead, .modern-table tbody, .modern-table th, .modern-table td, .modern-table tr {
                      display: block;
                      width: 100%;
                    }
                    .modern-table thead {
                      display: none;
                    }
                    .modern-table tr {
                      margin-bottom: 1.2rem;
                      border-radius: 0.5rem;
                      box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
                      background: white;
                      border: 1px solid #f3f4f6;
                    }
                    .modern-table td {
                      padding: 10px 8px 10px 50%;
                      position: relative;
                      border: none;
                      min-width: unset;
                      max-width: unset;
                      font-size: 13px;
                      background: white;
                      word-break: break-word;
                    }
                    .modern-table td:before {
                      position: absolute;
                      top: 10px;
                      left: 16px;
                      width: 45%;
                      white-space: pre-wrap;
                      font-weight: 600;
                      color: #6b7280;
                      content: attr(data-label);
                      font-size: 12px;
                    }
                  }
                `}</style>
                <div className="modern-table-container">
                  <table className="modern-table">
                    <thead>
                        <tr className="text-gray-700">
                            <th>Role Name</th>
                            <th>Assigned Permissions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (<tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr>) : roles.map(role => (
                            <tr key={role.roleName} className="hover:bg-gray-50">
                                <td data-label="Role Name">{role.roleName}</td>
                                <td data-label="Assigned Permissions">
                                    <button onClick={() => setModal({ type: 'view-role-permissions', data: role })} className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 font-medium transition-colors text-xs">View</button>
                                </td>
                                <td data-label="Actions">
                                    <button onClick={() => handleDeleteRole(role.roleName)} className="cursor-pointer px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 font-medium transition-colors">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
            </div>
        </div>
    );
}