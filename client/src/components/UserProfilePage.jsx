import React, { useState, useEffect, useCallback } from 'react';
import {
  MdPerson,
  MdPhone,
  MdEdit,
  MdHome,
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
import { useAuth } from './context/AuthContext';
import { apiService } from '../service/api';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  // Get user data and authentication status directly from AuthContext
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { id: customerIdFromUrl } = useParams();

  // Determine the customerId to use. Prioritize URL param, then authUser.id
  // This will ensure customerId is available as early as authUser.id is.
  const customerId = customerIdFromUrl || authUser?.id;

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Initialize customerProfile state with authUser data if available.
  // This ensures the profile header has data immediately.
  const [customerProfile, setCustomerProfile] = useState(authUser || null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(false); // Set to false initially as authUser might already populate customerProfile
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [addressFormData, setAddressFormData] = useState({
    street_line: '',
    commune: '',
    district: '',
    province: '',
    google_map_link: '',
    phone: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      toast.error("Please log in to view your profile.");
    }
  }, [isAuthenticated, navigate]);

  // Fetch customer profile from API for the most up-to-date data
  useEffect(() => {
    // Only fetch if authenticated AND customerId is available
    if (isAuthenticated && customerId) {
      setLoadingProfile(true);
      setApiError(null);
      apiService.getOneCustomer(customerId)
        .then(data => {
          setCustomerProfile(data); // This will update the profile with fresh API data
          setAddressFormData(prev => ({ ...prev, phone: data.phone_number || '' }));
        })
        .catch(err => {
          setApiError(err.message || "Failed to load profile data.");
          console.error("Failed to fetch profile:", err);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
    // If not authenticated or customerId is not available, we don't attempt to fetch.
    // The initial `customerProfile` will be from `authUser` if available.
  }, [isAuthenticated, customerId]);


  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    if (!customerId) return;
    setLoadingAddresses(true);
    try {
      const data = await apiService.getAddressCustomer(customerId);
      setAddresses(data);
    } catch (err) {
      toast.error("Failed to load addresses.");
      console.error("Failed to fetch addresses:", err);
      setAddresses([]);
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
    try {
      const data = await apiService.getOrdersByCustomerId(customerId);
      const formattedOrders = data.map(order => {
        const total = order.items.reduce((sum, item) => sum + (item.OrderItem.qty * parseFloat(item.OrderItem.price_at_purchase)), 0);
        return {
          id: order.order_id,
          order_date: order.order_date,
          date: new Date(order.order_date).toLocaleDateString(),
          total: total.toFixed(2),
          status: order.order_status,
          items_count: order.items.length,
          address: order.address,
          express_handle: order.express_handle,
        };
      });
      setOrders(formattedOrders);
    } catch (err) {
      toast.error("Failed to load orders.");
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (activeTab === 'overview' && isAuthenticated && customerId) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated, customerId, fetchOrders]);

  const handleViewOrderDetails = useCallback(async (orderId) => {
    setLoadingOrderDetail(true);
    try {
      const orderDetails = await apiService.getUserOrderdetail(orderId);
      const totalCalculated = orderDetails.items.reduce((sum, item) => sum + (item.OrderItem.qty * parseFloat(item.OrderItem.price_at_purchase)), 0);

      setSelectedOrderDetails({
        ...orderDetails,
        total: totalCalculated.toFixed(2),
        status: orderDetails.order_status,
      });
      setShowOrderDetailModal(true);
    } catch (err) {
      toast.error(err.message || "Failed to load order details.");
      console.error("Failed to fetch order details:", err);
    } finally {
      setLoadingOrderDetail(false);
    }
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return <MdCheckCircle className="text-green-500" />;
      case 'SHIPPED': return <MdLocalShipping className="text-blue-500" />;
      case 'PENDING': return <MdRadioButtonUnchecked className="text-orange-500" />;
      default: return <MdRadioButtonUnchecked className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
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
    try {
      if (editingAddress) {
        await apiService.updateAddressCustomer(editingAddress.address_id, {
          street_line: addressFormData.street_line,
          commune: addressFormData.commune,
          district: addressFormData.district,
          province: addressFormData.province,
          google_map_link: addressFormData.google_map_link,
        });
        toast.success("Address updated successfully!");
      } else {
        await apiService.addAddressCustomer(customerId, {
          street_line: addressFormData.street_line,
          commune: addressFormData.commune,
          district: addressFormData.district,
          province: addressFormData.province,
          google_map_link: addressFormData.google_map_link,
          phone: addressFormData.phone,
        });
        toast.success("Address added successfully!");
      }
      resetAddressForm();
      fetchAddresses();
    } catch (err) {
      toast.error(err.message || "Failed to save address.");
      console.error("Address save error:", err);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await apiService.deleteAddressCustomer(addressId);
      toast.success("Address deleted successfully!");
      fetchAddresses();
    } catch (err) {
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
      phone: address.phone || customerProfile?.phone_number || '',
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
      phone: customerProfile?.phone_number || '',
    });
    setShowAddressModal(false);
  };

  // If not authenticated, the useEffect will handle redirection.
  if (!isAuthenticated) {
    return null;
  }

  // If customerProfile is null (meaning either not yet loaded, or failed to load),
  // AND it's not currently loading, AND there's an API error, then show the error.
  // Otherwise, if it's still loading (and customerProfile is null), show a loading message.
  if (!customerProfile && !loadingProfile && apiError) {
    return <div className="text-center py-20 text-xl font-semibold text-red-500">{apiError}</div>;
  }

  // If there's no customerProfile yet (either still loading or failed), show a loading indicator.
  // This ensures the page doesn't show "N/A" if `authUser` was also initially null.
  if (!customerProfile && loadingProfile) {
    return <div className="text-center py-20 text-xl font-semibold">Loading profile data...</div>;
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
                  onClick={logout}
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
                  // Prioritize customerProfile.profile_img_path, then authUser.profile_img_path
                  src={customerProfile?.profile_img_path || authUser?.profile_img_path || `https://ui-avatars.com/api/?name=${customerProfile?.name || authUser?.name || 'User'}&background=6366f1&color=fff`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <MdEdit className="text-sm" />
                </button>
              </div>
              <div className="flex-1">
                {/* Prioritize customerProfile.name, then authUser.name */}
                <h1 className="text-2xl font-bold text-gray-900">{customerProfile?.name || authUser?.name || 'N/A'}</h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MdPhone className="text-lg" />
                  {/* Prioritize customerProfile.phone_number, then authUser.phone_number */}
                  <span>{customerProfile?.phone_number || authUser?.phone_number || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional rendering for tabs */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <MdShoppingBag className="text-3xl text-blue-600 mx-auto mb-2" />
                  {loadingOrders ? (
                      <h3 className="text-2xl font-bold text-gray-900">...</h3>
                  ) : (
                      <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
                  )}
                  <p className="text-gray-600">Total Orders</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <MdLocationOn className="text-3xl text-green-600 mx-auto mb-2" />
                  {loadingAddresses ? (
                      <h3 className="text-2xl font-bold text-gray-900">...</h3>
                  ) : (
                      <h3 className="text-2xl font-bold text-gray-900">{addresses.length}</h3>
                  )}
                  <p className="text-gray-600">Saved Addresses</p>
                </div>
              </div>

              {/* My Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
                {loadingOrders ? (
                  <div className="text-center text-gray-500 py-4">Loading orders...</div>
                ) : (
                  orders.length > 0 ? (
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
                  )
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
                <div className="text-center text-gray-500 py-4">Loading addresses...</div>
              ) : (
                addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div key={address.address_id} className="border border-gray-200 rounded-lg p-6 relative">
                        {address.is_default && (
                          <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                          {address.type === 'Home' ? (
                            <MdHome className="text-2xl text-blue-600" />
                          ) : (
                            <MdLocationOn className="text-2xl text-purple-600" />
                          )}
                          <h3 className="font-semibold text-gray-900">{address.type || 'Address'}</h3>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p className="font-medium text-gray-900">{customerProfile?.name || authUser?.name}</p>
                          <p className="text-gray-600">{address.street_line}</p>
                          <p className="text-gray-600">{address.commune ? `${address.commune}, ` : ''}{address.district}, {address.province}</p>
                          <p className="text-gray-600">{address.phone || customerProfile?.phone_number || authUser?.phone_number}</p>
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
                )
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
                        // Prioritize customerProfile.name, then authUser.name
                        defaultValue={customerProfile?.name || authUser?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        // Prioritize customerProfile.phone_number, then authUser.phone_number
                        defaultValue={customerProfile?.phone_number || authUser?.phone_number || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form id="address-form" onSubmit={handleAddEditAddress} className="space-y-3">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={customerProfile?.name || authUser?.name || ''} // Use authUser as fallback
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details - {selectedOrderDetails.order_id}</h2>
            {loadingOrderDetail ? (
              <div className="text-center text-gray-500 py-8">Loading order details...</div>
            ) : (
              <div className="space-y-4">
                <p><strong>Order Date:</strong> {new Date(selectedOrderDetails.order_date).toLocaleString()}</p>
                <p><strong>Status:</strong> <span className={`font-medium ${getStatusColor(selectedOrderDetails.order_status)} px-2 py-1 rounded-full text-xs`}>{selectedOrderDetails.order_status}</span></p>
                <p><strong>Total Amount:</strong> ${selectedOrderDetails.total}</p>
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