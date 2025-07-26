import React, { useState } from 'react';
import { MdPeople, MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList, MdAttachMoney, MdEmail, MdPhone, MdBadge } from 'react-icons/md';
import { apiService } from '../../service/api';

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
      name: 'Eleanor Vance',
      email: '',
      phone_number: '555-0101',
      salary: 95000,
      work_schedule: 'Mon-Fri 9am-5pm',
      is_active: true,
      hire_date: '2018-03-15',
      position: 'General Manager',
      manager_id: 1,
      department: '',
    },
    {
      id: 2,
      name: 'Theo Crain',
      email: '',
      phone_number: '555-0202',
      salary: 70000,
      work_schedule: 'Mon-Fri 8am-4pm',
      is_active: true,
      hire_date: '2019-06-10',
      position: 'Sales Manager',
      manager_id: 1,
      department: '',
    },
    {
      id: 3,
      name: 'Luke Sanderson',
      email: '',
      phone_number: '555-0303',
      salary: 50000,
      work_schedule: 'Tue-Sat 10am-6pm',
      is_active: false,
      hire_date: '2020-01-20',
      position: 'Delivery Lead',
      manager_id: 2,
      department: '',
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
    const matchesSearch =
      (staff.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.department || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || staff.position === roleFilter || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateStaff = () => {
    
    const newId = Math.max(...staffList.map(s => s.id)) + 1;
    const staffToAdd = {
      id: newId,
      name: newStaff.name,
      email: newStaff.email,
      phone_number: newStaff.phone,
      salary: parseFloat(newStaff.salary),
      work_schedule: newStaff.work_schedule || "Mon-Fri 9am-5pm",
      is_active: newStaff.is_active !== false,
      hire_date: newStaff.hire_date || new Date().toISOString().split('T')[0],
      position: newStaff.position || newStaff.role,
      manager_id: newStaff.manager_id || 1,
      department: newStaff.department || ''
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
      {/* Header */}
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

      {/* Summary Cards */}
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

      {/* Search and Filter */}
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

      {/* Create Staff Modal with improved UX */}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Schedule</label>
                <input
                  type="text"
                  value={newStaff.work_schedule || "Mon-Fri 9am-5pm"}
                  onChange={(e) => setNewStaff({...newStaff, work_schedule: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Active</label>
                <select
                  value={newStaff.is_active === false ? "false" : "true"}
                  onChange={(e) => setNewStaff({...newStaff, is_active: e.target.value === "true"})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date</label>
                <input
                  type="date"
                  value={newStaff.hire_date || ""}
                  onChange={(e) => setNewStaff({...newStaff, hire_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  value={newStaff.position || ""}
                  onChange={(e) => setNewStaff({...newStaff, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager ID</label>
                <input
                  type="number"
                  value={newStaff.manager_id || ""}
                  onChange={(e) => setNewStaff({...newStaff, manager_id: e.target.value})}
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

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto w-full">
        <table className="w-full min-w-[420px]">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Staff</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Role</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Salary</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Work Schedule</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-blue-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-base font-semibold text-gray-900">{staff.name}</div>
                    <div className="text-xs text-gray-500">Hired: {staff.hire_date ? new Date(staff.hire_date).toLocaleDateString() : '-'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MdPhone className="text-blue-400" />
                    {staff.phone_number || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getRoleColor(staff.position || staff.role)}`}>
                    {staff.position || staff.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base font-semibold text-gray-900">${staff.salary ? staff.salary.toLocaleString() : '-'}</div>
                  <div className="text-xs text-gray-500">per month</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{staff.work_schedule || '-'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                    staff.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {staff.is_active ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedStaff(staff);
                        setShowEditModal(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 shadow transition flex items-center gap-1"
                      title="Edit"
                    >
                      <MdEdit size={18} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStaff(staff);
                        setShowSalaryModal(true);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-2 shadow transition flex items-center gap-1"
                      title="Update Salary"
                    >
                      <MdAttachMoney size={18} />
                      <span className="hidden sm:inline">Salary</span>
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 shadow transition flex items-center gap-1"
                      title="Delete"
                    >
                      <MdDelete size={18} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && (
        <div className="flex items-center justify-center z-50 fixed inset-0 pointer-events-none">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md shadow-2xl pointer-events-auto mx-2">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Edit Staff</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={selectedStaff.name}
                  onChange={e => setSelectedStaff({ ...selectedStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={selectedStaff.phone_number}
                  onChange={e => setSelectedStaff({ ...selectedStaff, phone_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Schedule</label>
                <input
                  type="text"
                  value={selectedStaff.work_schedule}
                  onChange={e => setSelectedStaff({ ...selectedStaff, work_schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Active</label>
                <select
                  value={selectedStaff.is_active ? "true" : "false"}
                  onChange={e => setSelectedStaff({ ...selectedStaff, is_active: e.target.value === "true" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date</label>
                <input
                  type="date"
                  value={selectedStaff.hire_date}
                  onChange={e => setSelectedStaff({ ...selectedStaff, hire_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  value={selectedStaff.position}
                  onChange={e => setSelectedStaff({ ...selectedStaff, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager ID</label>
                <input
                  type="number"
                  value={selectedStaff.manager_id}
                  onChange={e => setSelectedStaff({ ...selectedStaff, manager_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleEditStaff(selectedStaff);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Salary Modal */}
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
       
