import { useState, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdPersonAdd, MdEdit, MdBlock, MdHistory, MdEmail, MdPhone, MdLocationOn, MdClose } from 'react-icons/md';
import { apiService } from '../../service/api'; // Adjust path as needed
import toast from 'react-hot-toast'; // For notifications
import Pagination from './Pagination'; // Import the Pagination component
import { Link } from 'react-router-dom'; // For linking to user profile page

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'blocked'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null); // Full details for modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [customerDetailsError, setCustomerDetailsError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone_number: '', // Changed to phone_number to match API
    password: '',
    confirmPassword: ''
  });
  const [addCustomerError, setAddCustomerError] = useState(null);


  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const params = {
        page: currentPage,
        limit: 10, // Items per page
        sort: 'ASC',
        column: 'name',
      };

      if (searchTerm) {
        // Assuming your API can search by name or phone_number with one param
        // You might need to adjust this based on your backend's search capabilities
        params.name = searchTerm;
        params.phone_number = searchTerm; // Assuming backend searches both if provided
      }

      // Filter by status (is_verified in API, status in UI)
      // This mapping might need adjustment based on your backend's actual 'status' field
      if (filterStatus !== 'all') {
        if (filterStatus === 'active') {
          params.is_verifyed = true; // Assuming 'active' means is_verifyed: true
        } else if (filterStatus === 'blocked') {
          // Your API doesn't have a direct 'blocked' status.
          // You might need a separate API endpoint or a different field for this.
          // For now, we'll filter this client-side or assume 'blocked' is not 'is_verifyed'.
          // If 'blocked' means is_verifyed: false, then:
          params.is_verifyed = false;
        }
      }

      const response = await apiService.getAllCustomers(params);
      setCustomers(response.data || []);
      setTotalItems(response.meta?.totalItems || 0);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (err) {
      setApiError(err.message || "Failed to load customers.");
      console.error("Error fetching customers:", err);
      setCustomers([]); // Clear customers on error
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterStatus]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle status change (Block/Unblock)
  const handleStatusChange = async (customerId, currentStatus) => {
    setApiError(null);
    try {
      // Assuming 'blocked' status in UI maps to `is_verifyed: false` and 'active' to `is_verifyed: true`
      // You might need a dedicated API endpoint for blocking/unblocking or a different field.
      // For this example, we'll toggle `is_verifyed` if it represents active/inactive.
      const newIsVerifiedStatus = currentStatus === 'active' ? false : true; // Toggle logic
      const updatePayload = { is_verifyed: newIsVerifiedStatus }; // Assuming API accepts this field

      await apiService.updateCustomer(customerId, updatePayload);
      toast.success(`Customer status updated to ${newIsVerifiedStatus ? 'active' : 'blocked'}!`);
      fetchCustomers(); // Refresh the list
    } catch (err) {
      setApiError(err.message || "Failed to update customer status.");
      toast.error(err.message || "Failed to update customer status.");
      console.error("Status update error:", err);
    }
  };

  // Open customer details modal
  const openCustomerDetails = async (customer) => {
    setSelectedCustomerDetails(null); // Clear previous details
    setShowDetailsModal(true);
    setLoadingDetails(true);
    setCustomerDetailsError(null);
    try {
      // Fetch full customer profile
      const profile = await apiService.getOneCustomer(customer.customer_id);
      // Fetch addresses
      const addresses = await apiService.getAddressCustomer(customer.customer_id);
      // Fetch orders
      const orders = await apiService.getOrdersByCustomerId(customer.customer_id);

      setSelectedCustomerDetails({
        ...profile,
        addresses: addresses,
        orders: orders.map(order => {
          const total = order.items.reduce((sum, item) => sum + (item.OrderItem.qty * parseFloat(item.OrderItem.price_at_purchase)), 0);
          return {
            id: order.order_id,
            date: new Date(order.order_date).toLocaleDateString(),
            total: total.toFixed(2),
            status: order.order_status,
            items_count: order.items.length,
            express_handle: order.express_handle,
            address: order.address,
            products: order.items,
          };
        }),
      });
    } catch (err) {
      setCustomerDetailsError(err.message || "Failed to load customer details.");
      console.error("Error fetching customer details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle adding a new customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setAddCustomerError(null);
    if (newCustomer.password !== newCustomer.confirmPassword) {
      setAddCustomerError('Passwords do not match');
      return;
    }
    try {
      await apiService.registerCustomer({
        name: newCustomer.name,
        phone_number: newCustomer.phone_number,
        password: newCustomer.password,
      });
      toast.success("Customer added successfully!");
      setShowAddModal(false);
      setNewCustomer({ name: '', phone_number: '', password: '', confirmPassword: '' });
      fetchCustomers(); // Refresh the customer list
    } catch (err) {
      setAddCustomerError(err.message || "Failed to add customer.");
      toast.error(err.message || "Failed to add customer.");
      console.error("Add customer error:", err);
    }
  };

  // Map API status to UI status for filtering and display
  const mapApiStatusToUi = (isVerifyed) => {
    // This mapping needs to be consistent with your backend's definition of 'status'
    // If your backend has a 'status' field directly, use that.
    // Assuming 'is_verifyed: true' means 'active', 'is_verifyed: false' means 'inactive' or 'blocked'.
    // You might need a separate field for 'blocked' if it's distinct from 'inactive'.
    return isVerifyed ? 'active' : 'inactive'; // Default to inactive if not verified
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading customers...</div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="text-center py-20 text-xl font-semibold text-red-500">{apiError}</div>
    );
  }

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
          <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Active Customers</h3>
          <p className="text-3xl font-bold text-green-600">{customers.filter(c => mapApiStatusToUi(c.is_verifyed) === 'active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Inactive/Blocked Customers</h3>
          <p className="text-3xl font-bold text-red-600">{customers.filter(c => mapApiStatusToUi(c.is_verifyed) !== 'active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Verified Customers</h3>
          <p className="text-3xl font-bold text-blue-600">{customers.filter(c => c.is_verifyed).length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name or phone..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} // Reset page on search
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} // Reset page on filter
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option> {/* Use 'inactive' instead of 'blocked' if API only has is_verifyed */}
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <div className="w-full max-w-full">
          <table className="w-full min-w-[420px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-gray-50"> {/* Use customer_id as key */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {customer.profile_img_path && (
                          <img className="h-10 w-10 rounded-full" src={customer.profile_img_path} alt="" />
                        )}
                        <div className={customer.profile_img_path ? "ml-4" : ""}>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <MdPhone className="text-gray-400" />
                        {customer.phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        mapApiStatusToUi(customer.is_verifyed) === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800' // Assuming non-active is 'blocked' or 'inactive'
                      }`}>
                        {mapApiStatusToUi(customer.is_verifyed)}
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
                        {/* Edit button - currently not implemented with API */}
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Edit Customer"
                          // onClick={() => handleEditCustomer(customer)} // Implement this function
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleStatusChange(customer.customer_id, mapApiStatusToUi(customer.is_verifyed))}
                          className={`${mapApiStatusToUi(customer.is_verifyed) === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={mapApiStatusToUi(customer.is_verifyed) === 'active' ? 'Deactivate Customer' : 'Activate Customer'}
                        >
                          <MdBlock />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomerDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Customer Details</h2>
              <button
                onClick={() => { setShowDetailsModal(false); setSelectedCustomerDetails(null); setCustomerDetailsError(null); }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {loadingDetails ? (
              <div className="text-center text-gray-500 py-8">Loading details...</div>
            ) : customerDetailsError ? (
              <div className="text-center text-red-500 py-8">{customerDetailsError}</div>
            ) : (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="flex items-center space-x-4 border-b pb-4">
                  {selectedCustomerDetails.profile_img_path && (
                    <img src={selectedCustomerDetails.profile_img_path} alt="" className="w-16 h-16 rounded-full" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{selectedCustomerDetails.name}</h3>
                    <p className="text-gray-600 flex items-center gap-1"><MdPhone className="text-gray-400" />{selectedCustomerDetails.phone_number}</p>
                    <p className="text-gray-600 flex items-center gap-1"><MdEmail className="text-gray-400" />{selectedCustomerDetails.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Addresses */}
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><MdLocationOn />Addresses</h4>
                  {selectedCustomerDetails.addresses && selectedCustomerDetails.addresses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedCustomerDetails.addresses.map(addr => (
                        <div key={addr.address_id} className="border p-3 rounded-md text-sm">
                          <p className="font-medium">{addr.street_line}</p>
                          <p>{addr.commune ? `${addr.commune}, ` : ''}{addr.district}, {addr.province}</p>
                          <p className="text-gray-500">{addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No addresses found.</p>
                  )}
                </div>

                {/* Orders */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2"><MdHistory />Orders</h4>
                  {selectedCustomerDetails.orders && selectedCustomerDetails.orders.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCustomerDetails.orders.map(order => (
                        <div key={order.id} className="border p-3 rounded-md text-sm">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">Order ID: {order.id}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-gray-600">Date: {order.date}</p>
                          <p className="text-gray-600">Total: ${order.total}</p>
                          <p className="text-gray-600">Items: {order.items_count}</p>
                          <p className="text-gray-600">Shipping: {order.express_handle || 'Standard'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No orders found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Customer</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {addCustomerError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm">
                {addCustomerError}
              </div>
            )}
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
                  value={newCustomer.phone_number}
                  onChange={e => setNewCustomer({ ...newCustomer, phone_number: e.target.value })}
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
