import React, { useState, useEffect, useCallback } from "react";
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
  MdDelete,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { useAuth } from "./context/AuthContext";
import { apiService } from "../service/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileCard from "./ProfileCard";
const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = true,
  error,
  readOnly = false,
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1.5"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400 ${
        readOnly ? "bg-gray-50 cursor-not-allowed" : ""
      }`}
      required={required}
      readOnly={readOnly}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default function UserProfilePage() {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { id: customerIdFromUrl } = useParams();

  const customerId = customerIdFromUrl || authUser?.id;

  const [activeTab, setActiveTab] = useState("overview");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [customerProfile, setCustomerProfile] = useState(authUser || null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [fullName, setFullName] = useState(
    customerProfile?.name || authUser?.name || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    customerProfile?.phone_number || authUser?.phone_number || ""
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordIncorrect, setPasswordIncorrect] = useState(null);
  const onSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    const updatedData = {
      password: newPassword,
    };
    const checkPassword = await apiService.userLogin(
      phoneNumber,
      currentPassword
    );
    if (checkPassword.success) {
      const updatePassword = await apiService.updateCustomer(
        authUser.id,
        updatedData
      );
      if (updatePassword.status === 200) {
        toast.success("User Update Successful");
        setPasswordIncorrect(null);
        setNewPassword("");
        setConfirmPassword("");
        setPasswordIncorrect("");
      } else {
        toast.error("User Update Fail");
      }
    } else {
      toast.error("Password Incorrect");
      setPasswordIncorrect("Password Incorrect");
    }
  };

  const handleProfileImageUpdate = async (url) => {
    try {
      const updatedData = { profile_img_path: url };
      const check = await apiService.updateCustomer(authUser.id, updatedData);
      if(check.status===200){
        toast.success("Profile image updated!");
      }else{
        toast.error(check.data.message)
      }
    } catch (err) {
      console.error("API Error (updateCustomer):", JSON.stringify(err.response?.data, null, 2));
      toast.error("Failed to update profile.");
    }
  };


  const [addressFormData, setAddressFormData] = useState({
    street_line: "",
    commune: "",
    district: "",
    province: "",
    google_map_link: "",
    phone: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.error("Please log in to view your profile.");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && customerId) {
      setLoadingProfile(true);
      setApiError(null);
      apiService
        .getOneCustomer(customerId)
        .then((data) => {
          setCustomerProfile(data);
          setAddressFormData((prev) => ({
            ...prev,
            phone: data.phone_number || "",
          }));
        })
        .catch((err) => {
          setApiError(err.message || "Failed to load profile data.");
          console.error("Failed to fetch profile:", err);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
  }, [isAuthenticated, customerId]);

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
    if (activeTab === "addresses" && isAuthenticated && customerId) {
      fetchAddresses();
    }
  }, [activeTab, isAuthenticated, customerId, fetchAddresses]);

  const fetchOrders = useCallback(async () => {
    if (!customerId) return;
    setLoadingOrders(true);
    try {
      const data = await apiService.getOrdersByCustomerId(customerId);
      const formattedOrders = data.map((order) => {
        const total = order.items.reduce(
          (sum, item) =>
            sum +
            item.OrderItem.qty * parseFloat(item.OrderItem.price_at_purchase),
          0
        );
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
    if (activeTab === "overview" && isAuthenticated && customerId) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated, customerId, fetchOrders]);

  const handleViewOrderDetails = useCallback(async (orderId) => {
    setLoadingOrderDetail(true);
    try {
      const orderDetails = await apiService.getUserOrderdetail(orderId);
      const totalCalculated = orderDetails.items.reduce(
        (sum, item) =>
          sum +
          item.OrderItem.qty * parseFloat(item.OrderItem.price_at_purchase),
        0
      );

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
      case "DELIVERED":
        return <MdCheckCircle className="text-green-500" />;
      case "SHIPPED":
        return <MdLocalShipping className="text-blue-500" />;
      case "PENDING":
        return <MdRadioButtonUnchecked className="text-orange-500" />;
      default:
        return <MdRadioButtonUnchecked className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: MdPerson },
    { id: "addresses", label: "Addresses", icon: MdLocationOn },
    { id: "settings", label: "Settings", icon: MdSettings },
    { id: "logout", label: "Logout", icon: MdLogout },
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
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
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
      street_line: address.street_line || "",
      commune: address.commune || "",
      district: address.district || "",
      province: address.province || "",
      google_map_link: address.google_map_link || "",
      phone: address.phone || customerProfile?.phone_number || "",
    });
    setShowAddressModal(true);
  };

  const resetAddressForm = () => {
    setEditingAddress(null);
    setAddressFormData({
      street_line: "",
      commune: "",
      district: "",
      province: "",
      google_map_link: "",
      phone: customerProfile?.phone_number || "",
    });
    setShowAddressModal(false);
  };

  if (!isAuthenticated) return null;
  if (!customerProfile && !loadingProfile && apiError)
    return (
      <div className="text-center py-20 text-xl font-semibold text-red-500">
        {apiError}
      </div>
    );
  if (!customerProfile && loadingProfile)
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading profile data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <aside className="hidden lg:flex w-full lg:w-64 bg-gradient-to-b from-orange-400 to-orange-300 flex-col py-8 px-4 shadow-lg">
        <div className="mb-8 flex items-center gap-2">
          <span className="text-2xl font-bold text-white">My Account</span>
        </div>
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={
                item.id === "logout" ? logout : () => setActiveTab(item.id)
              }
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors w-full ${
                activeTab === item.id && item.id !== "logout"
                  ? "bg-white text-orange-600 shadow"
                  : "text-white hover:bg-orange-200/60"
              }`}
            >
              <item.icon
                className={`text-xl ${
                  activeTab === item.id ? "text-orange-500" : "text-white"
                }`}
              />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- Mobile Slide-in Menu & Overlay --- */}
      <>
        {/* Overlay */}
        <div
          className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        {/* Slide-in Menu Panel */}
        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "transform translate-x-0"
              : "transform -translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold text-orange-600">My Account</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
              <MdClose className="text-2xl" />
            </button>
          </div>
          <nav className="mt-4">
            {sidebarItems.map((item) => {
              const action = () => {
                if (item.id === "logout") {
                  logout();
                } else {
                  setActiveTab(item.id);
                }
                setIsMobileMenuOpen(false); // Close menu on selection
              };
              return (
                <button
                  key={item.id}
                  onClick={action}
                  className={`flex items-center gap-4 w-full text-left px-6 py-4 transition-colors ${
                    activeTab === item.id && item.id !== "logout"
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="text-2xl" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </>

      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="lg:hidden mb-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
              <MdMenu className="text-2xl" />
            </button>
          </div>

          {/* <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src={
                    customerProfile?.profile_img_path ||
                    authUser?.profile_img_path ||
                    `https://ui-avatars.com/api/?name=${
                      customerProfile?.name || authUser?.name || "User"
                    }&background=6366f1&color=fff`
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button
                  onClick={handleEditClick}
                  className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <MdEdit className="text-sm" />
                </button>
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {customerProfile?.name || authUser?.name || "N/A"}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MdPhone className="text-lg" />
                  <span>
                    {customerProfile?.phone_number ||
                      authUser?.phone_number ||
                      "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div> */}
          <ProfileCard
            customerProfile={customerProfile}
            authUser={authUser}
            onProfileImageUpdate={handleProfileImageUpdate}
          />
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <MdShoppingBag className="text-3xl text-blue-600 mx-auto mb-2" />
                  {loadingOrders ? (
                    <h3 className="text-2xl font-bold text-gray-900">...</h3>
                  ) : (
                    <h3 className="text-2xl font-bold text-gray-900">
                      {orders.length}
                    </h3>
                  )}
                  <p className="text-gray-600">Total Orders</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <MdLocationOn className="text-3xl text-green-600 mx-auto mb-2" />
                  {loadingAddresses ? (
                    <h3 className="text-2xl font-bold text-gray-900">...</h3>
                  ) : (
                    <h3 className="text-2xl font-bold text-gray-900">
                      {addresses.length}
                    </h3>
                  )}
                  <p className="text-gray-600">Saved Addresses</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  My Orders
                </h2>
                {loadingOrders ? (
                  <div className="text-center text-gray-500 py-4">
                    Loading orders...
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <p className="font-medium text-gray-900">
                                Order ID: {order.id}
                              </p>
                              <p className="text-sm text-gray-500">
                                Date: {order.date}
                              </p>
                              <p className="text-sm text-gray-500">
                                Shipping: {order.express_handle || "Standard"}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-medium text-gray-900">
                              Total: ${order.total}
                            </p>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <button
                            onClick={() => handleViewOrderDetails(order.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                          {order.status === "DELIVERED" && (
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No orders found.
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "addresses" && (
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Addresses
                </h2>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    resetAddressForm();
                    setShowAddressModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center sm:justify-start gap-2 transition-colors"
                >
                  <MdAdd />
                  <span className="whitespace-nowrap">Add Address</span>
                </button>
              </div>
              {loadingAddresses ? (
                <div className="text-center text-gray-500 py-4">
                  Loading addresses...
                </div>
              ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address.address_id}
                      className="border border-gray-200 rounded-lg p-6 relative"
                    >
                      {address.is_default && (
                        <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        {address.type === "Home" ? (
                          <MdHome className="text-2xl text-blue-600" />
                        ) : (
                          <MdLocationOn className="text-2xl text-purple-600" />
                        )}
                        <h3 className="font-semibold text-gray-900">
                          {address.type || "Address"}
                        </h3>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="font-medium text-gray-900">
                          {customerProfile?.name || authUser?.name}
                        </p>
                        <p className="text-gray-600">{address.street_line}</p>
                        <p className="text-gray-600">
                          {address.commune ? `${address.commune}, ` : ""}
                          {address.district}, {address.province}
                        </p>
                        <p className="text-gray-600">
                          {address.phone ||
                            customerProfile?.phone_number ||
                            authUser?.phone_number}
                        </p>
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
                          onClick={() =>
                            handleDeleteAddress(address.address_id)
                          }
                          className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No addresses found. Click "Add Address" to add one.
                </div>
              )}
            </div>
          )}
          {activeTab === "settings" && (
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Account Settings
              </h2>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      {passwordIncorrect && (
                        <p className="text-red-500">{passwordIncorrect}</p>
                      )}
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={onSave}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>
            <form
              id="address-form"
              onSubmit={handleAddEditAddress}
              className="space-y-3"
            >
              <InputField
                label="Street Line"
                id="street_line"
                name="street_line"
                value={addressFormData.street_line}
                onChange={(e) =>
                  setAddressFormData((prev) => ({
                    ...prev,
                    street_line: e.target.value,
                  }))
                }
                required={false}
              />
              <InputField
                label="Commune"
                id="commune"
                name="commune"
                value={addressFormData.commune}
                onChange={(e) =>
                  setAddressFormData((prev) => ({
                    ...prev,
                    commune: e.target.value,
                  }))
                }
                required={false}
              />
              <InputField
                label="District"
                id="district"
                name="district"
                value={addressFormData.district}
                onChange={(e) =>
                  setAddressFormData((prev) => ({
                    ...prev,
                    district: e.target.value,
                  }))
                }
                required={true}
              />
              <InputField
                label="Province"
                id="province"
                name="province"
                value={addressFormData.province}
                onChange={(e) =>
                  setAddressFormData((prev) => ({
                    ...prev,
                    province: e.target.value,
                  }))
                }
                required={true}
              />
              <InputField
                label="Google Map Link (Optional)"
                id="google_map_link"
                name="google_map_link"
                value={addressFormData.google_map_link}
                onChange={(e) =>
                  setAddressFormData((prev) => ({
                    ...prev,
                    google_map_link: e.target.value,
                  }))
                }
                required={false}
              />
              <InputField
                label="Phone Number"
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone for this address"
                value={addressFormData.phone}
                onChange={(e) =>
                  setAddressFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                required={true}
              />
            </form>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={resetAddressForm}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="address-form"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {editingAddress ? "Update Address" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showOrderDetailModal && selectedOrderDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Details - {selectedOrderDetails.order_id}
            </h2>
            {loadingOrderDetail ? (
              <div className="text-center text-gray-500 py-8">
                Loading order details...
              </div>
            ) : (
              <div className="space-y-4">
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(selectedOrderDetails.order_date).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-medium ${getStatusColor(
                      selectedOrderDetails.order_status
                    )} px-2 py-1 rounded-full text-xs`}
                  >
                    {selectedOrderDetails.order_status}
                  </span>
                </p>
                <p>
                  <strong>Total Amount:</strong> ${selectedOrderDetails.total}
                </p>
                <p>
                  <strong>Shipping Method:</strong>{" "}
                  {selectedOrderDetails.express_handle || "Standard"}
                </p>
                {selectedOrderDetails.address && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Shipping Address:
                    </h3>
                    <p>{selectedOrderDetails.address.street_line}</p>
                    <p>
                      {selectedOrderDetails.address.commune
                        ? `${selectedOrderDetails.address.commune}, `
                        : ""}
                      {selectedOrderDetails.address.district},{" "}
                      {selectedOrderDetails.address.province}
                    </p>
                  </div>
                )}
                {
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Items:</h3>
                    {selectedOrderDetails.items &&
                    selectedOrderDetails.items.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedOrderDetails.items.map((item) => (
                          <li
                            key={item.product_code}
                            className="flex flex-col sm:flex-row justify-between text-sm text-gray-700"
                          >
                            <span>
                              {item.name} (x{item.OrderItem.qty})
                            </span>
                            <span>
                              $
                              {(
                                item.OrderItem.qty *
                                parseFloat(item.OrderItem.price_at_purchase)
                              ).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        No items found for this order.
                      </p>
                    )}
                  </div>
                }
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowOrderDetailModal(false);
                  setSelectedOrderDetails(null);
                }}
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
