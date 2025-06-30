import React, { useState } from "react";

const roleOptions = [
  "Admin",
  "Backend Developer",
  "Frontend Developer",
  "Editor",
  "Viewer"
];
const expireOptions = [
  { label: "3 Months", value: 90 },
  { label: "6 Months", value: 180 },
  { label: "12 Months", value: 365 },
  { label: "24 Months", value: 730 }
];

// Helper to get a future date string
function getExpireDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Helper to calculate days left
function getDaysLeft(expireDate) {
  const today = new Date();
  const exp = new Date(expireDate);
  const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

const mockUsers = [
  {
    id: 1,
    username: "Alice Smith",
    role: "Admin",
    expireDate: getExpireDate(90),
    createdAt: new Date().toISOString().slice(0, 10)
  },
  {
    id: 2,
    username: "Bob Johnson",
    role: "Backend Developer",
    expireDate: getExpireDate(180),
    createdAt: new Date().toISOString().slice(0, 10)
  },
  {
    id: 3,
    username: "Charlie Lee",
    role: "Frontend Developer",
    expireDate: getExpireDate(365),
    createdAt: new Date().toISOString().slice(0, 10)
  }
];

export default function AdminManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "Viewer",
    expireDays: 90 // default to 3 months
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.expireDays) return;
    const expireDate = getExpireDate(Number(form.expireDays));
    setUsers([
      ...users,
      {
        id: users.length + 1,
        username: form.username,
        role: form.role,
        expireDate,
        createdAt: new Date().toISOString().slice(0, 10)
      }
    ]);
    setForm({
      username: "",
      password: "",
      role: "Viewer",
      expireDays: 90
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {/* User Input Form */}
      <form onSubmit={handleAddUser} className="flex flex-wrap gap-4 mb-8 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md"
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md"
            placeholder="Enter password"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md"
          >
            {roleOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expire Date</label>
          <select
            name="expireDays"
            value={form.expireDays}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md"
          >
            {expireOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600"
        >
          Add User
        </button>
      </form>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Expire Date</th>
              <th className="p-3 text-left">Days Left</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.expireDate}</td>
                <td className="p-3">{getDaysLeft(user.expireDate)} days</td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}