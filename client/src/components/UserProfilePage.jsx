import React, { useState, useEffect, useCallback } from 'react';
import {
  MdPerson,
  MdPhone,
  MdEdit,
  MdHome,
  MdBusiness,
  MdAdd,
  MdLocationOn,
  MdShoppingBag,
  MdSettings,
  MdLogout,
  MdLocalShipping,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdDelete
} from 'react-icons/md';
import { useAuth } from './context/AuthContext'; // Assuming useAuth provides user data
import { apiService } from '../service/api'; // Assuming apiService is correctly defined
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import toast from 'react-hot-toast'; // For user notifications

// Reusable InputField component (from CheckoutPage, adapted)
const InputField = ({ label, id, type = "text", placeholder, value, onChange, required = true, error, readOnly = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type} id={id} name={id} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400 ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      required={required}
      readOnly={readOnly}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);


export default function UserProfilePage() {
  const { user: authUser, isAuthenticated, logout } = useAuth(); // Get user and logout from AuthContext
  const navigate = useNavigate();
  const { id: customerIdFromUrl } = useParams(); // Get customer ID from URL parameter

  // Use customerIdFromUrl for fetching data, fallback to authUser.id if URL param is not present
  // This ensures that if the route is /user/profile (without ID), it uses the logged-in user's ID
  const customerId = customerIdFromUrl || authUser?.id;

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // Stores address being edited
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false); // State for order detail modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null); // Stores details of the order to display

  const [customerProfile, setCustomerProfile] = useState(null); // Full customer data from API
  const [addresses, setAddresses] = useState([]); 
  const [orders, setOrders] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false); // Loading for order detail modal
  const [apiError, setApiError] = useState(null);

  // State for Add/Edit Address Form
  const [addressFormData, setAddressFormData] = useState({
    street_line: '',
    commune: '', // Include if your API requires it, even if not displayed
    district: '',
    province: '',
    google_map_link: '', // Include if your API requires it, even if not displayed
    phone: '', // This phone is for the address, not the user's main phone
  });

  // Redirect if not authenticated or if customerId is missing
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      toast.error("Please log in to view your profile.");
    } else if (!customerId) {
        setApiError("Customer ID is missing. Cannot load profile.");
        setLoadingProfile(false); 
    }
  }, [isAuthenticated, navigate, customerId]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!customerId) return; 
      setLoadingProfile(true);
      setApiError(null);
      try {
        const data = await apiService.getOneCustomer(customerId); 
        setCustomerProfile(data);
        setAddressFormData(prev => ({ ...prev, phone: data.phone_number || '' }));
      } catch (err) {
        setApiError(err.message || "Failed to load profile data.");
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [customerId]); // Re-fetch if customerId changes

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    if (!customerId) return;
    setLoadingAddresses(true);
    setApiError(null);
    try {
      const data = await apiService.getAddressCustomer(customerId); 
      setAddresses(data);
    } catch (err) {
      setApiError(err.message || "Failed to load addresses.");
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  }, [customerId]); 

  useEffect(() => {
    if (activeTab === 'addresses' && isAuthenticated && customerId) {
      fetchAddresses();
    }
  }, [activeTab, isAuthenticated, customerId, fetchAddresses]);

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    if (!customerId) return;
    setLoadingOrders(true);
    setApiError(null);
    try {
      const data = await apiService.getOrdersByCustomerId(customerId);
      // Map API response to your UI's expected order structure
      const formattedOrders = data.map(order => {
        // Calculate total from order items
        const total = order.items.reduce((sum, item) => sum + (item.OrderItem.qty * parseFloat(item.OrderItem.price_at_purchase)), 0);
        // Determine status text for UI display
        let statusText = order.order_status;

        return {
          id: order.order_id,
          order_date: order.order_date, // Keep original date for detail view
          date: new Date(order.order_date).toLocaleDateString(), // Formatted date for display
          total: total.toFixed(2), // Format total
          status: statusText, // Use backend status directly
          items_count: order.items.length, // Count of items
          address: order.address, // Address details
          products: order.items, // Array of products in the order
          express_handle: order.express_handle, // Express handle
        };
      });
      setOrders(formattedOrders);
    } catch (err) {
      setApiError(err.message || "Failed to load orders.");
      console.error("Failed to fetch orders:", err);
      setOrders([]); // Clear orders on error
    } finally {
      setLoadingOrders(false);
    }
  }, [customerId]);

  useEffect(() => {
    // Fetch orders when activeTab is 'overview'
    if (activeTab === 'overview' && isAuthenticated && customerId) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated, customerId, fetchOrders]);

  const handleViewOrderDetails = useCallback(async (orderId) => {
    setLoadingOrderDetail(true);
    setApiError(null);
    try {
      const orderDetails = await apiService.getUserOrderdetail(orderId);
      // Calculate total for the single order detail fetched
      const totalCalculated = orderDetails.items.reduce((sum, item) => sum + (item.OrderItem.qty * parseFloat(item.OrderItem.price_at_purchase)), 0);

      setSelectedOrderDetails({
        ...orderDetails,
        total: totalCalculated.toFixed(2), // Add calculated total
        status: orderDetails.order_status, // Ensure status is consistent
        // Add other fields you need for display that might not be directly from API but derived
      });
      setShowOrderDetailModal(true);
    } catch (err) {
      setApiError(err.message || "Failed to load order details.");
      toast.error(err.message || "Failed to load order details.");
      console.error("Failed to fetch order details:", err);
    } finally {
      setLoadingOrderDetail(false);
    }
  }, []);

  const getStatusIcon = (status) => {
    switch (status.toUpperCase()) { // Convert to uppercase for consistent matching
      case 'DELIVERED': return <MdCheckCircle className="text-green-500" />;
      case 'SHIPPED': return <MdLocalShipping className="text-blue-500" />;
      case 'PENDING': return <MdRadioButtonUnchecked className="text-orange-500" />;
      default: return <MdRadioButtonUnchecked className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) { // Convert to uppercase for consistent matching
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: MdPerson },
    { id: 'addresses', label: 'Addresses', icon: MdLocationOn },
    { id: 'settings', label: 'Settings', icon: MdSettings },
    { id: 'logout', label: 'Logout', icon: MdLogout }
  ];

  const handleAddEditAddress = async (e) => {
    e.preventDefault();
    setApiError(null);
    try {
      if (editingAddress) {
        // Update existing address
        await apiService.updateAddressCustomer(editingAddress.address_id, {
          street_line: addressFormData.street_line,
          commune: addressFormData.commune,
          district: addressFormData.district,
          province: addressFormData.province,
          google_map_link: addressFormData.google_map_link,
        });
        toast.success("Address updated successfully!");
      } else {
        // Add new address
        await apiService.addAddressCustomer(customerId, {
          street_line: addressFormData.street_line,
          commune: addressFormData.commune,
          district: addressFormData.district,
          province: addressFormData.province,
          google_map_link: addressFormData.google_map_link,
        });
        toast.success("Address added successfully!");
      }
      resetAddressForm();
      fetchAddresses(); // Re-fetch addresses to update UI
    } catch (err) {
      setApiError(err.message || "Failed to save address.");
      toast.error(err.message || "Failed to save address.");
      console.error("Address save error:", err);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    setApiError(null);
    try {
      await apiService.deleteAddressCustomer(addressId);
      toast.success("Address deleted successfully!");
      fetchAddresses(); // Re-fetch addresses to update UI
    } catch (err) {
      setApiError(err.message || "Failed to delete address.");
      toast.error(err.message || "Failed to delete address.");
      console.error("Address delete error:", err);
    }
  };

  const openEditAddressModal = (address) => {
    setEditingAddress(address);
    setAddressFormData({
      street_line: address.street_line || '',
      commune: address.commune || '',
      district: address.district || '',
      province: address.province || '',
      google_map_link: address.google_map_link || '',
      phone: address.phone || '', // Assuming you want to display phone in form
    });
    setShowAddressModal(true);
  };

  const resetAddressForm = () => {
    setEditingAddress(null);
    setAddressFormData({
      street_line: '',
      commune: '',
      district: '',
      province: '',
      google_map_link: '',
      phone: customerProfile?.phone_number || '', // Reset to user's main phone
    });
    setShowAddressModal(false);
  };

  // Show loading state if profile is still loading or if customerId isn't available yet
  if (loadingProfile || !customerId) {
    return <div className="text-center py-20 text-xl font-semibold">Loading profile...</div>;
  }

  // If not authenticated (and not just loading), redirect to login
  if (!isAuthenticated) {
    return null; // The useEffect will handle navigation
  }

  // Display error if API call failed after loading
  if (apiError && !loadingProfile && !loadingAddresses && !loadingOrders && !loadingOrderDetail) {
    return <div className="text-center py-20 text-xl font-semibold text-red-500">{apiError}</div>;
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 min-h-[60px] lg:min-h-screen bg-gradient-to-b from-orange-400 to-orange-300 flex flex-row lg:flex-col py-4 lg:py-8 px-2 lg:px-4 shadow-lg">
        <div className="mb-4 lg:mb-8 flex items-center gap-2">
          <span className="text-xl lg:text-2xl font-bold text-white">My Account</span>
        </div>
        <nav className="flex flex-row lg:flex-col gap-1 w-full">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            if (item.id === 'logout') {
              return (
                <button
                  key={item.id}
                  onClick={logout} // Use the logout function from useAuth
                  className={`flex items-center gap-2 lg:gap-3 px-2 py-2 lg:px-4 lg:py-3 rounded-lg text-left font-medium transition-colors w-full text-white hover:bg-orange-200/60`}
                >
                  <Icon className={`text-lg lg:text-xl text-white`} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 lg:gap-3 px-2 py-2 lg:px-4 lg:py-3 rounded-lg text-left font-medium transition-colors w-full ${
                  activeTab === item.id
                    ? 'bg-white text-orange-600 shadow'
                    : 'text-white hover:bg-orange-200/60'
                }`}
              >
                <Icon className={`text-lg lg:text-xl ${activeTab === item.id ? 'text-orange-500' : 'text-white'}`} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 lg:py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={customerProfile?.profile_img_path || `https://ui-avatars.com/api/?name=${customerProfile?.name || 'User'}&background=6366f1&color=fff`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <MdEdit className="text-sm" />
                </button>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{customerProfile?.name || 'N/A'}</h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MdPhone className="text-lg" />
                  <span>{customerProfile?.phone_number || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <MdShoppingBag className="text-3xl text-blue-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
                  <p className="text-gray-600">Total Orders</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <MdLocationOn className="text-3xl text-green-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-900">{addresses.length}</h3>
                  <p className="text-gray-600">Saved Addresses</p>
                </div>
              </div>

              {/* My Orders (now part of Overview) */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
                {loadingOrders ? (
                  <div className="text-center text-gray-500">Loading orders...</div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <p className="font-medium text-gray-900">Order ID: {order.id}</p>
                              <p className="text-sm text-gray-500">Date: {order.date}</p>
                              <p className="text-sm text-gray-500">Shipping: {order.express_handle || 'Standard'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">Total: ${order.total}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        {/* Removed progress bar */}
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleViewOrderDetails(order.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                          {order.status === 'DELIVERED' && (
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">No orders found.</div>
                )}
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Addresses</h2>
                <button
                  onClick={() => { setEditingAddress(null); resetAddressForm(); setShowAddressModal(true); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <MdAdd />
                  Add Address
                </button>
              </div>

              {loadingAddresses ? (
                <div className="text-center text-gray-500">Loading addresses...</div>
              ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div key={address.address_id} className="border border-gray-200 rounded-lg p-6 relative">
                      {/* Assuming your API returns an 'is_default' flag */}
                      {address.is_default && (
                        <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        {/* You might need to define address.type or derive it */}
                        {address.type === 'Home' ? ( // Assuming 'type' field is available or can be derived
                          <MdHome className="text-2xl text-blue-600" />
                        ) : (
                          <MdLocationOn className="text-2xl text-purple-600" /> // Generic icon if type is unknown
                        )}
                        <h3 className="font-semibold text-gray-900">{address.type || 'Address'}</h3>
                      </div>

                      <div className="space-y-2 mb-4">
                        {/* Assuming address.name is not directly from API, using user's name */}
                        <p className="font-medium text-gray-900">{customerProfile?.name}</p>
                        <p className="text-gray-600">{address.street_line}</p>
                        <p className="text-gray-600">{address.commune ? `${address.commune}, ` : ''}{address.district}, {address.province}</p>
                        <p className="text-gray-600">{address.phone || customerProfile?.phone_number}</p> {/* Use address phone if available, else user's main phone */}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditAddressModal(address)}
                          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <MdEdit className="inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.address_id)}
                          className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">No addresses found. Click "Add Address" to add one.</div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={customerProfile?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        defaultValue={customerProfile?.phone_number || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* Assuming email is not in your customer profile API, or you'd add it here */}
                    {/* <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue={customerProfile?.email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div> */}
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Add/Edit Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleAddEditAddress} className="space-y-3">
              {/* Address Type (mocked, as not in your API schema) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                <select
                  name="type"
                  value={addressFormData.type || ''}
                  onChange={(e) => setAddressFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* Full Name (mocked, as not in your API schema for address) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={customerProfile?.name || ''}
                  readOnly
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <InputField
                label="Street Line"
                id="street_line"
                name="street_line"
                value={addressFormData.street_line}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, street_line: e.target.value }))}
                required={false}
              />
              <InputField
                label="Commune"
                id="commune"
                name="commune"
                value={addressFormData.commune}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, commune: e.target.value }))}
                required={false}
              />
              <InputField
                label="District"
                id="district"
                name="district"
                value={addressFormData.district}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, district: e.target.value }))}
                required={true}
              />
              <InputField
                label="Province"
                id="province"
                name="province"
                value={addressFormData.province}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, province: e.target.value }))}
                required={true}
              />
              <InputField
                label="Google Map Link (Optional)"
                id="google_map_link"
                name="google_map_link"
                value={addressFormData.google_map_link}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, google_map_link: e.target.value }))}
                required={false}
              />
              <InputField
                label="Phone Number"
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone for this address"
                value={addressFormData.phone}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, phone: e.target.value }))}
                required={true}
              />
            </form>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={resetAddressForm}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="address-form"
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetailModal && selectedOrderDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details - {selectedOrderDetails.order_id}</h2> {/* Use order_id */}
            {loadingOrderDetail ? (
              <div className="text-center text-gray-500 py-8">Loading order details...</div>
            ) : (
              <div className="space-y-4">
                <p><strong>Order Date:</strong> {new Date(selectedOrderDetails.order_date).toLocaleString()}</p>
                <p><strong>Status:</strong> <span className={`font-medium ${getStatusColor(selectedOrderDetails.order_status)} px-2 py-1 rounded-full text-xs`}>{selectedOrderDetails.order_status}</span></p> {/* Use order_status */}
                <p><strong>Total Amount:</strong> ${selectedOrderDetails.total}</p> {/* Use calculated total */}
                <p><strong>Shipping Method:</strong> {selectedOrderDetails.express_handle || 'Standard'}</p>
                
                {selectedOrderDetails.address && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Shipping Address:</h3>
                    <p>{selectedOrderDetails.address.street_line}</p>
                    <p>{selectedOrderDetails.address.commune ? `${selectedOrderDetails.address.commune}, ` : ''}{selectedOrderDetails.address.district}, {selectedOrderDetails.address.province}</p>
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Items:</h3>
                  {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? ( 
                    <ul className="space-y-2">
                      {selectedOrderDetails.items.map(item => (
                        <li key={item.product_code} className="flex justify-between text-sm text-gray-700">
                          <span>{item.name} (x{item.OrderItem.qty})</span> 
                          <span>${(item.OrderItem.qty * parseFloat(item.OrderItem.price_at_purchase)).toFixed(2)}</span> 
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No items found for this order.</p>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => { setShowOrderDetailModal(false); setSelectedOrderDetails(null); }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
