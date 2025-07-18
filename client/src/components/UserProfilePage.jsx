import React, { useState } from 'react';
import { 
  MdPerson, 
  MdPhone, 
  MdEdit, 
  MdHome, 
  MdBusiness, 
  MdAdd, 
  MdLocationOn,
  MdShoppingBag,
  MdFavorite,
  MdSettings,
  MdLogout,
  MdLocalShipping,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdDelete
} from 'react-icons/md';

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Mock user data
  const user = {
    name: 'John Doe',
    phone: '+855 12 345 678',
    email: 'john.doe@example.com',
    profilePicture: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff'
  };

  // Mock addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      address: '123 Main Street, Apt 4B',
      city: 'Phnom Penh',
      phone: '+855 12 345 678',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: 'John Doe',
      address: '456 Business District, Floor 10',
      city: 'Phnom Penh',
      phone: '+855 98 765 432',
      isDefault: false
    }
  ]);

  // Mock orders
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 299.99,
      status: 'delivered',
      items: 2,
      progress: 100
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      total: 149.99,
      status: 'shipped',
      items: 1,
      progress: 75
    },
    {
      id: 'ORD-003',
      date: '2024-01-22',
      total: 79.99,
      status: 'ordered',
      items: 1,
      progress: 25
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <MdCheckCircle className="text-green-500" />;
      case 'shipped':
        return <MdLocalShipping className="text-blue-500" />;
      case 'ordered':
        return <MdRadioButtonUnchecked className="text-orange-500" />;
      default:
        return <MdRadioButtonUnchecked className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'ordered':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: MdPerson },
    { id: 'orders', label: 'My Orders', icon: MdShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MdLocationOn },
    { id: 'wishlist', label: 'Wishlist', icon: MdFavorite },
    { id: 'settings', label: 'Settings', icon: MdSettings },
    { id: 'logout', label: 'Logout', icon: MdLogout }
  ];

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
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <MdEdit className="text-sm" />
                </button>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MdPhone className="text-lg" />
                  <span>{user.phone}</span>
                </div>
                <p className="text-gray-500 mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
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
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <MdFavorite className="text-3xl text-red-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-900">12</h3>
                  <p className="text-gray-600">Wishlist Items</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h2>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${order.total}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div className="flex items-center gap-3 mb-3 sm:mb-0">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-500">Ordered on {order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${order.total}</p>
                        <p className="text-sm text-gray-500">{order.items} item(s)</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Order Progress</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Addresses</h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <MdAdd />
                  Add Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-6 relative">
                    {address.isDefault && (
                      <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                      {address.type === 'Home' ? (
                        <MdHome className="text-2xl text-blue-600" />
                      ) : (
                        <MdBusiness className="text-2xl text-purple-600" />
                      )}
                      <h3 className="font-semibold text-gray-900">{address.type}</h3>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="font-medium text-gray-900">{address.name}</p>
                      <p className="text-gray-600">{address.address}</p>
                      <p className="text-gray-600">{address.city}</p>
                      <p className="text-gray-600">{address.phone}</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <MdEdit className="inline mr-1" />
                        Edit
                      </button>
                      <button className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Wishlist</h2>
              <div className="text-center py-12">
                <MdFavorite className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Shopping
                </button>
              </div>
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
                        defaultValue={user.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        defaultValue={user.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue={user.email}
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
      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="flex items-center justify-center z-50 fixed inset-0 pointer-events-none">
          <div className="bg-white rounded-xl p-4 w-full max-w-xs sm:max-w-sm max-h-[70vh] overflow-y-auto shadow-2xl pointer-events-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                <select className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Home</option>
                  <option>Office</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="default-address"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="default-address" className="ml-2 text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

        
