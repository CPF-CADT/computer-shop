import { useState,useCallback ,useEffect } from "react";
import AlertBox from "./AlertBox";
import { apiService } from "../../service/api";
const privilegeOptions = [
  "ALL PRIVILEGES", "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "GRANT OPTION"
];

export default function AdminManageRole() {
  const [roles, setRoles] = useState([]);
  const [availableTables, setAvailableTables] = useState([]); // Dynamic tables
  const [permissions, setPermissions] = useState({});
  const [form, setForm] = useState({ roleName: "", privileges: [], tables: [] });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setAlert({ show: false });
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

  const handlePrivilegeChange = (priv) => setForm(prev => ({...prev, privileges: prev.privileges.includes(priv) ? prev.privileges.filter(p => p !== priv) : [...prev.privileges, priv]}));
  const handleTableChange = (table) => setForm(prev => ({...prev, tables: prev.tables.includes(table) ? prev.tables.filter(t => t !== table) : [...prev.tables, table]}));
  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  // FIXED "SELECT ALL" LOGIC
  const handleSelectAllTables = (e) => {
      if (e.target.checked) {
          setForm(prev => ({...prev, tables: [...availableTables]}));
      } else {
          setForm(prev => ({...prev, tables: []}));
      }
  };

  const handleAddRole = async (e) => {
      e.preventDefault();
      if (!form.roleName || form.privileges.length === 0) return;
      try {
          await apiService.createRole(form.roleName);
          if (form.tables.length > 0) {
              for (const table of form.tables) {
                  await apiService.grantPermissionsToRole({ roleName: form.roleName, permissions: form.privileges, tableName: table });
              }
          } else {
               await apiService.grantPermissionsToRole({ roleName: form.roleName, permissions: form.privileges });
          }
          setAlert({ show: true, message: `Role '${form.roleName}' created and permissions granted.`, type: 'success' });
          setForm({ roleName: "", privileges: [], tables: [] });
          fetchInitialData();
      } catch (err) {
          setAlert({ show: true, message: err.message, type: 'error' });
      }
  };
  
  const handleDeleteRole = async (roleName) => {
      if(window.confirm(`Are you sure you want to delete the role '${roleName}'?`)){
          try {
              await apiService.dropRole(roleName);
              setAlert({ show: true, message: `Role '${roleName}' deleted.`, type: 'success' });
              fetchInitialData();
          } catch(err) {
              setAlert({ show: true, message: err.message, type: 'error' });
          }
      }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Role Management</h2>
      <AlertBox message={alert.message} type={alert.type} onClose={() => setAlert({ show: false })} />
      <form onSubmit={handleAddRole} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
          <input name="roleName" value={form.roleName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Enter role name" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Privileges</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {privilegeOptions.map(priv => (
              <label key={priv} className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.privileges.includes(priv)} onChange={() => handlePrivilegeChange(priv)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"/>
                {priv}
              </label>
            ))}
          </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Grant on Tables (Optional, grants to all if none selected)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <input type="checkbox" 
                        onChange={handleSelectAllTables}
                        checked={availableTables.length > 0 && form.tables.length === availableTables.length}
                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"/>
                    All Tables
                </label>
                 {availableTables.map(table => (
                    <label key={table} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" checked={form.tables.includes(table)} onChange={() => handleTableChange(table)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"/>
                      {table}
                    </label>
                ))}
            </div>
        </div>
        <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">Add Role & Grant</button>
      </form>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="p-4 text-left font-semibold">Role Name</th>
              <th className="p-4 text-left font-semibold">Assigned Permissions</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
                <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr>
            ) : roles.map(role => (
              <tr key={role.roleName} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{role.roleName}</td>
                <td className="p-4 text-gray-600"><pre className="whitespace-pre-wrap text-xs font-mono">{permissions[role.roleName] ? permissions[role.roleName].join('\n') : 'No permissions'}</pre></td>
                <td className="p-4"><button onClick={() => handleDeleteRole(role.roleName)} className="px-4 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 font-medium transition-colors">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
