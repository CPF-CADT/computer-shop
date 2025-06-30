import React, { useState } from "react";

// Mock privileges and tables
const privilegeOptions = [
  "Grant All", "Select", "Insert", "Update", "Delete", "Revoke All"
];
const tableOptions = [
  "users", "products", "orders", "categories", "customers", "messages", "invoices", "discounts"
];

// Mock users with roles
const mockUsers = [
  {
    id: 1,
    username: "Alice Smith",
    privileges: ["Grant All", "Select", "Insert"],
    tables: ["users", "products"]
  },
  {
    id: 2,
    username: "Bob Johnson",
    privileges: ["Select", "Update"],
    tables: ["orders"]
  },
  {
    id: 3,
    username: "Charlie Lee",
    privileges: ["Select", "Delete", "Revoke All"],
    tables: ["customers", "messages"]
  }
];

export default function AdminManageRole() {
  const [users, setUsers] = useState(mockUsers);
  const [form, setForm] = useState({
    username: "",
    privileges: [],
    tables: []
  });

  // Handle checkbox for privileges
  const handlePrivilegeChange = (priv) => {
    setForm((prev) => ({
      ...prev,
      privileges: prev.privileges.includes(priv)
        ? prev.privileges.filter(p => p !== priv)
        : [...prev.privileges, priv]
    }));
  };

  // Handle checkbox for tables
  const handleTableChange = (table) => {
    setForm((prev) => ({
      ...prev,
      tables: prev.tables.includes(table)
        ? prev.tables.filter(t => t !== table)
        : [...prev.tables, table]
    }));
  };

  // Select all privileges
  const handleSelectAllPrivileges = (checked) => {
    setForm((prev) => ({
      ...prev,
      privileges: checked ? [...privilegeOptions] : []
    }));
  };

  // Select all tables
  const handleSelectAllTables = (checked) => {
    setForm((prev) => ({
      ...prev,
      tables: checked ? [...tableOptions] : []
    }));
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!form.username || form.privileges.length === 0 || form.tables.length === 0) return;
    setUsers([
      ...users,
      {
        id: users.length + 1,
        username: form.username,
        privileges: form.privileges,
        tables: form.tables
      }
    ]);
    setForm({
      username: "",
      privileges: [],
      tables: []
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Role Management</h2>
      {/* User Input Form */}
      <form onSubmit={handleAddUser} className="flex flex-col gap-4 mb-8">
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
          <label className="block text-sm font-medium mb-1">Privileges</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={form.privileges.length === privilegeOptions.length}
                onChange={e => handleSelectAllPrivileges(e.target.checked)}
              />
              All
            </label>
            {privilegeOptions.map(priv => (
              <label key={priv} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.privileges.includes(priv)}
                  onChange={() => handlePrivilegeChange(priv)}
                />
                {priv}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tables</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={form.tables.length === tableOptions.length}
                onChange={e => handleSelectAllTables(e.target.checked)}
              />
              All
            </label>
            {tableOptions.map(table => (
              <label key={table} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.tables.includes(table)}
                  onChange={() => handleTableChange(table)}
                />
                {table}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 w-fit"
        >
          Add User Role
        </button>
      </form>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Privileges</th>
              <th className="p-3 text-left">Tables</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.privileges.join(", ")}</td>
                <td className="p-3">{user.tables.join(", ")}</td>
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