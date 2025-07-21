import React, { useState } from 'react';
import { MdPeople, MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList, MdAttachMoney, MdEmail, MdPhone, MdBadge } from 'react-icons/md';

export default function StaffManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const roles = ['Admin', 'Support', 'Delivery', 'Sales', 'Manager', 'Accountant'];

  
  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+855 12 345 678',
      role: 'Admin',
      salary: 1200,
      status: 'active',
      hireDate: '2023-01-15',
      department: 'IT'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+855 98 765 432',
      role: 'Support',
      salary: 800,
      status: 'active',
      hireDate: '2023-03-20',
      department: 'Customer Service'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      phone: '+855 77 123 456',
      role: 'Delivery',
      salary: 600,
      status: 'active',
      hireDate: '2023-05-10',
      department: 'Logistics'
    },
    {
      id: 4,
      name: 'Lisa Brown',
      email: 'lisa.brown@company.com',
      phone: '+855 88 987 654',
      role: 'Sales',
      salary: 900,
      status: 'inactive',
      hireDate: '2022-11-05',
      department: 'Sales'
    }
  ]);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Support',
    salary: '',
    department: ''
  });

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateStaff = () => {
    const newId = Math.max(...staffList.map(s => s.id)) + 1;
    const staffToAdd = {
      ...newStaff,
      id: newId,
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0],
      salary: parseFloat(newStaff.salary)
    };
    setStaffList([...staffList, staffToAdd]);
    setNewStaff({ name: '', email: '', phone: '', role: 'Support', salary: '', department: '' });
    setShowCreateModal(false);
  };

  const handleUpdateSalary = (staffId, newSalary) => {
    setStaffList(staffList.map(staff => 
      staff.id === staffId ? { ...staff, salary: parseFloat(newSalary) } : staff
    ));
    setShowSalaryModal(false);
  };

  const handleEditStaff = (updatedStaff) => {
    setStaffList(staffList.map(staff => 
      staff.id === updatedStaff.id ? updatedStaff : staff
    ));
    setShowEditModal(false);
  };

  const handleDeleteStaff = (staffId) => {
    setStaffList(staffList.filter(staff => staff.id !== staffId));
  };

  const totalStaff = staffList.length;
  const activeStaff = staffList.filter(s => s.status === 'active').length;
  const totalSalaryExpense = staffList.reduce((sum, staff) => sum + staff.salary, 0);

  const getRoleColor = (role) => {
    const colors = {
      'Admin': 'bg-red-100 text-red-800',
      'Support': 'bg-blue-100 text-blue-800',
      'Delivery': 'bg-green-100 text-green-800',
      'Sales': 'bg-purple-100 text-purple-800',
      'Manager': 'bg-orange-100 text-orange-800',
      'Accountant': 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 w-full max-w-full">
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
          min-width: 400px;
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
            min-width: 120px;
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="mt-2 text-gray-600">Manage staff accounts, roles, and salaries</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mt-4 lg:mt-0"
        >
          <MdAdd />
          Add New Staff
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-blue-600">{totalStaff}</p>
              <p className="text-sm text-gray-500">All employees</p>
            </div>
            <MdPeople className="text-3xl text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-3xl font-bold text-green-600">{activeStaff}</p>
              <p className="text-sm text-gray-500">Currently working</p>
            </div>
            <MdBadge className="text-3xl text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Expense</p>
              <p className="text-3xl font-bold text-orange-600">${totalSalaryExpense.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total salaries</p>
            </div>
            <MdAttachMoney className="text-3xl text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Salary</p>
              <p className="text-3xl font-bold text-purple-600">${(totalSalaryExpense / totalStaff).toFixed(0)}</p>
              <p className="text-sm text-gray-500">Per employee</p>
            </div>
            <MdAttachMoney className="text-3xl text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative min-w-0">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="flex items-center justify-center z-50 fixed inset-0 pointer-events-none">
          <div className="bg-white rounded-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md shadow-2xl pointer-events-auto mx-2">
            <h2 className="text-xl font-bold mb-4">Create New Staff Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary ($)</label>
                <input
                  type="number"
                  value={newStaff.salary}
                  onChange={(e) => setNewStaff({...newStaff, salary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStaff}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Staff
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-x-auto w-full">
        <table className="w-full min-w-[420px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                    <div className="text-sm text-gray-500">Hired: {new Date(staff.hireDate).toLocaleDateString()}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1">
                    <MdEmail className="text-gray-400" />
                    {staff.email}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MdPhone className="text-gray-400" />
                    {staff.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(staff.role)}`}>
                    {staff.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {staff.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${staff.salary.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">per month</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedStaff(staff);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStaff(staff);
                        setShowSalaryModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <MdAttachMoney />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showSalaryModal && selectedStaff && (
        <div className="flex items-center justify-center z-50 fixed inset-0 pointer-events-none">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md shadow-2xl pointer-events-auto mx-2">
            <h2 className="text-xl font-bold mb-4">Update Salary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Staff: {selectedStaff.name}</p>
                <p className="text-sm text-gray-600">Current Salary: ${selectedStaff.salary.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Monthly Salary ($)</label>
                <input
                  type="number"
                  defaultValue={selectedStaff.salary}
                  id="newSalary"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSalaryModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newSalary = document.getElementById('newSalary').value;
                  handleUpdateSalary(selectedStaff.id, newSalary);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Update Salary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
