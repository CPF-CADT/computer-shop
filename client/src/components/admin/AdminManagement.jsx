import { useState,useCallback ,useEffect } from "react";
import { apiService } from "../../service/api";
import AlertBox from "./AlertBox";
const expireOptions = [
  { label: "3 Months", value: 90 }, { label: "6 Months", value: 180 },
  { label: "12 Months", value: 365 }, { label: "24 Months", value: 730 }
];

function getDaysLeft(expireDate) {
    if (!expireDate) return 'N/A';
    const today = new Date();
    const exp = new Date(expireDate);
    const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days` : 'Expired';
}

export default function AdminManagement() {
  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", role: "", expireDays: 90 });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setAlert({ show: false });
      const [fetchedUsers, fetchedRoles] = await Promise.all([apiService.getUsers(), apiService.getRoles()]);
      setUsers(fetchedUsers);
      setAvailableRoles(fetchedRoles);
      if (fetchedRoles.length > 0) {
        setForm(prev => ({...prev, role: fetchedRoles[0].roleName}));
      }
    } catch (err) {
      setAlert({ show: true, message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.role) return;
    try {
      await apiService.createUser({ username: form.username, password: form.password, expireDays: Number(form.expireDays), host: '%' });
      await apiService.grantRoleToUser(form.role, form.username);
      setAlert({ show: true, message: `User '${form.username}' created and role '${form.role}' assigned.`, type: 'success' });
      setForm({ username: "", password: "", role: availableRoles[0]?.roleName || "", expireDays: 90 });
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: err.message, type: 'error' });
    }
  };

  const handleDeleteUser = async (username, host) => {
    if (window.confirm(`Are you sure you want to delete the user '${username}'?`)) {
      try {
        await apiService.dropUser(username, host);
        setAlert({ show: true, message: `User '${username}' deleted.`, type: 'success' });
        fetchData();
      } catch (err) {
        setAlert({ show: true, message: err.message, type: 'error' });
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">User Management</h2>
      <AlertBox message={alert.message} type={alert.type} onClose={() => setAlert({ show: false })} />
      
      <form onSubmit={handleAddUser} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Form fields... */}
        <div className="lg:col-span-1"><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><input name="username" value={form.username} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Enter username" required/></div>
        <div className="lg:col-span-1"><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input name="password" type="password" value={form.password} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Enter password" required/></div>
        <div className="lg:col-span-1"><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select name="role" value={form.role} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">{availableRoles.map(r => <option key={r.roleName} value={r.roleName}>{r.roleName}</option>)}</select></div>
        <div className="lg:col-span-1"><label className="block text-sm font-medium text-gray-700 mb-1">Expire In</label><select name="expireDays" value={form.expireDays} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">{expireOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
        <div className="lg:col-span-1"><button type="submit" className="w-full px-6 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">Add User</button></div>
      </form>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="p-4 text-left font-semibold">Username</th>
              <th className="p-4 text-left font-semibold">Assigned Role(s)</th>
              <th className="p-4 text-left font-semibold">Expires On</th>
              <th className="p-4 text-left font-semibold">Time Left</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
                <tr><td colSpan="5" className="p-4 text-center">Loading users...</td></tr>
            ) : users.map(user => (
              <tr key={`${user.User}-${user.Host}`} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{user.User}</td>
                <td className="p-4 text-gray-600">{user.roles?.join(', ') || 'N/A'}</td>
                <td className="p-4 text-gray-600">{user.expireDate}</td>
                <td className="p-4 text-gray-600">{getDaysLeft(user.expireDate)}</td>
                <td className="p-4"><button onClick={() => handleDeleteUser(user.User, user.Host)} className="px-4 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 font-medium transition-colors">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
