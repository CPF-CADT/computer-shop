import React, { useState, useEffect } from 'react';
import { MdSearch, MdFilterList, MdPersonAdd, MdEdit, MdBlock, MdHistory, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Only one customer from API JSON
  useEffect(() => {
    const mockCustomers = [
      {
        id: 1,
        name: 'John Doe',
        phone: '12345678',
        status: 'active',
        avatar: 'https://i.pinimg.com/736x/fc/58/f6/fc58f67f1a08d72aac200002f2fdd3f1.jpg'
      },
      {
        id: 2,
        name: 'Jane Smith',
        phone: '87654321',
        status: 'blocked',
        avatar: 'https://i.pinimg.com/736x/50/ba/77/50ba771944438cc0fac2d9c0a7a993fe.jpg'
      },
      {
        id: 3,
        name: 'Alice Johnson',
        phone: '55512345',
        status: 'active',
        avatar: 'https://i.pinimg.com/736x/0f/ad/48/0fad48e96644fe804f42e064c5c6829b.jpg'
      },
      { 
        id: 4,
        name: 'Bob Lee',
        phone: '99988877',
        status: 'inactive',
        avatar: 'https://i.pinimg.com/736x/e4/9d/9d/e49d9de6eeea0852eb81e2875f492734.jpg'
      },
      { 
        id: 5,
        name: 'Bob Lee',
        phone: '99988877',
        status: 'inactive',
        avatar: 'https://i.pinimg.com/736x/e4/9d/9d/e49d9de6eeea0852eb81e2875f492734.jpg'
      },
      { 
        id: 6,
        name: 'Bob Lee',
        phone: '99988877',
        status: 'inactive',
        avatar: 'https://i.pinimg.com/736x/e4/9d/9d/e49d9de6eeea0852eb81e2875f492734.jpg'
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

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.password || !newCustomer.confirmPassword) return;
    if (newCustomer.password !== newCustomer.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const nextId = customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    setCustomers([
      ...customers,
      {
        id: nextId,
        name: newCustomer.name,
        phone: newCustomer.phone,
        status: 'active'
      }
    ]);
    setFilteredCustomers([
      ...customers,
      {
        id: nextId,
        name: newCustomer.name,
        phone: newCustomer.phone,
        status: 'active'
      }
    ]);
    setShowAddModal(false);
    setNewCustomer({ name: '', phone: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
          <p className="mt-2 text-gray-600">Manage your customers and view their profiles</p>
        </div>
        <button className="mt-4 lg:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
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
          <h3 className="text-sm font-medium text-gray-600">Province</h3>
          <p className="text-3xl font-bold text-blue-600">
            {customers[0]?.province || '-'}
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
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {customer.avatar && (
                        <img className="h-10 w-10 rounded-full" src={customer.avatar} alt="" />
                      )}
                      <div className={customer.avatar ? "ml-4" : ""}>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <MdPhone className="text-gray-400" />
                      {customer.phone}
                    </div>
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

      {/* Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div className="flex items-center justify-center z-50 fixed inset-0 pointer-events-none">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto">
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
                {selectedCustomer.avatar && (
                  <img src={selectedCustomer.avatar} alt="" className="w-16 h-16 rounded-full" />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-gray-600">{selectedCustomer.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="flex items-center justify-center z-50 fixed inset-0 pointer-events-none">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl pointer-events-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Customer</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={newCustomer.password}
                  onChange={e => setNewCustomer({ ...newCustomer, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={newCustomer.confirmPassword}
                  onChange={e => setNewCustomer({ ...newCustomer, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

