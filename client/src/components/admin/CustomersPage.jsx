import React, { useState, useEffect } from 'react';
import { MdSearch, MdFilterList, MdPersonAdd, MdEdit, MdBlock, MdHistory, MdEmail, MdPhone } from 'react-icons/md';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock customer data
  useEffect(() => {
    const mockCustomers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        totalOrders: 12,
        totalSpent: 2450.80,
        joinDate: '2024-03-15',
        lastOrder: '2025-07-10',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 987-6543',
        status: 'active',
        totalOrders: 8,
        totalSpent: 1890.50,
        joinDate: '2024-05-20',
        lastOrder: '2025-07-12',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=ec4899&color=fff'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1 (555) 456-7890',
        status: 'blocked',
        totalOrders: 3,
        totalSpent: 450.25,
        joinDate: '2024-01-10',
        lastOrder: '2025-06-15',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff'
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+1 (555) 321-0987',
        status: 'active',
        totalOrders: 15,
        totalSpent: 3250.75,
        joinDate: '2023-11-08',
        lastOrder: '2025-07-14',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=10b981&color=fff'
      },
      {
        id: 5,
        name: 'David Brown',
        email: 'david@example.com',
        phone: '+1 (555) 654-3210',
        status: 'inactive',
        totalOrders: 2,
        totalSpent: 199.99,
        joinDate: '2024-07-01',
        lastOrder: '2024-07-05',
        avatar: 'https://ui-avatars.com/api/?name=David+Brown&background=8b5cf6&color=fff'
      },
      {
        id: 6,
        name: 'David Brown',
        email: 'david@example.com',
        phone: '+1 (555) 654-3210',
        status: 'inactive',
        totalOrders: 2,
        totalSpent: 199.99,
        joinDate: '2024-07-01',
        lastOrder: '2024-07-05',
        avatar: 'https://ui-avatars.com/api/?name=David+Brown&background=8b5cf6&color=fff'
      },
      {
        id: 7,
        name: 'David Brown',
        email: 'david@example.com',
        phone: '+1 (555) 654-3210',
        status: 'inactive',
        totalOrders: 2,
        totalSpent: 199.99,
        joinDate: '2024-07-01',
        lastOrder: '2024-07-05',
        avatar: 'https://ui-avatars.com/api/?name=David+Brown&background=8b5cf6&color=fff'
      },
      {
        id: 8,
        name: 'David Brown',
        email: 'david@example.com',
        phone: '+1 (555) 654-3210',
        status: 'inactive',
        totalOrders: 2,
        totalSpent: 199.99,
        joinDate: '2024-07-01',
        lastOrder: '2024-07-05',
        avatar: 'https://ui-avatars.com/api/?name=David+Brown&background=8b5cf6&color=fff'
      }
    ];
    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
  }, []);

  // Filter customers based on search and status
  useEffect(() => {
    let filtered = customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );

    if (filterStatus !== 'all') {
      filtered = filtered.filter(customer => customer.status === filterStatus);
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, filterStatus, customers]);

  const handleStatusChange = (customerId, newStatus) => {
    setCustomers(customers.map(customer => 
      customer.id === customerId ? { ...customer, status: newStatus } : customer
    ));
  };

  const openCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
          <p className="mt-2 text-gray-600">Manage your customers and view their profiles</p>
        </div>
        <button className="mt-4 lg:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <MdPersonAdd />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Total Customers</h3>
          <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Active Customers</h3>
          <p className="text-3xl font-bold text-green-600">{customers.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Blocked Customers</h3>
          <p className="text-3xl font-bold text-red-600">{customers.filter(c => c.status === 'blocked').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
          </table>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: '425px' }} // Adjust height for ~5 rows
          >
            <table className="w-full">
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={customer.avatar} alt="" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">Joined {new Date(customer.joinDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <MdEmail className="text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MdPhone className="text-gray-400" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.totalOrders} orders</div>
                      <div className="text-sm text-gray-500">Last: {new Date(customer.lastOrder).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${customer.totalSpent.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' :
                        customer.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openCustomerDetails(customer)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <MdHistory />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Edit Customer"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleStatusChange(customer.id, customer.status === 'blocked' ? 'active' : 'blocked')}
                          className={`${customer.status === 'blocked' ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                          title={customer.status === 'blocked' ? 'Unblock Customer' : 'Block Customer'}
                        >
                          <MdBlock />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Customer Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-center space-x-4">
                <img src={selectedCustomer.avatar} alt="" className="w-16 h-16 rounded-full" />
                <div>
                  <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  <p className="text-gray-600">{selectedCustomer.phone}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold">Total Orders</h4>
                  <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold">Total Spent</h4>
                  <p className="text-2xl font-bold text-green-600">${selectedCustomer.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="font-semibold mb-3">Recent Order History</h4>
                <div className="space-y-2">
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">#ORD-001</span>
                      <span className="text-green-600">$299.99</span>
                    </div>
                    <div className="text-sm text-gray-600">Gaming Mouse - Delivered on {selectedCustomer.lastOrder}</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">#ORD-002</span>
                      <span className="text-green-600">$899.99</span>
                    </div>
                    <div className="text-sm text-gray-600">Mechanical Keyboard - Delivered on 2025-07-08</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
