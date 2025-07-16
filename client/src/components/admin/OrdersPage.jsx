import React, { useState, useEffect } from 'react';
import { MdSearch, MdFilterList, MdEdit, MdPrint, MdLocalShipping, MdCancel, MdRefresh, MdVisibility, MdDownload } from 'react-icons/md';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Mock orders data
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+1 (555) 123-4567',
        orderDate: '2025-07-15T10:30:00',
        status: 'pending',
        total: 1599.99,
        shipping: 15.00,
        tax: 128.00,
        subtotal: 1456.99,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        items: [
          { name: 'Gaming Laptop ASUS ROG', quantity: 1, price: 1599.99, sku: 'LAP-001' }
        ],
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        trackingNumber: null
      },
      {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+1 (555) 987-6543',
        orderDate: '2025-07-15T09:15:00',
        status: 'processing',
        total: 849.97,
        shipping: 15.00,
        tax: 67.98,
        subtotal: 766.99,
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        items: [
          { name: '27" Gaming Monitor', quantity: 1, price: 349.99, sku: 'MON-002' },
          { name: 'Mechanical Keyboard RGB', quantity: 1, price: 129.99, sku: 'KEY-003' },
          { name: 'Wireless Gaming Mouse', quantity: 1, price: 287.01, sku: 'MOU-004' }
        ],
        paymentMethod: 'PayPal',
        paymentStatus: 'paid',
        trackingNumber: null
      },
      {
        id: 'ORD-003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        customerPhone: '+1 (555) 456-7890',
        orderDate: '2025-07-14T16:20:00',
        status: 'shipped',
        total: 649.99,
        shipping: 15.00,
        tax: 52.00,
        subtotal: 582.99,
        shippingAddress: {
          street: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        items: [
          { name: 'Gaming Laptop ASUS ROG', quantity: 1, price: 649.99, sku: 'LAP-002' }
        ],
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        trackingNumber: 'TRK123456789'
      },
      {
        id: 'ORD-004',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah@example.com',
        customerPhone: '+1 (555) 321-0987',
        orderDate: '2025-07-14T14:10:00',
        status: 'delivered',
        total: 479.98,
        shipping: 0.00,
        tax: 38.40,
        subtotal: 441.58,
        shippingAddress: {
          street: '321 Elm St',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101',
          country: 'USA'
        },
        items: [
          { name: 'Wireless Gaming Mouse', quantity: 2, price: 79.99, sku: 'MOU-004' },
          { name: 'USB-C Hub 7-in-1', quantity: 4, price: 49.99, sku: 'USB-005' }
        ],
        paymentMethod: 'Stripe',
        paymentStatus: 'paid',
        trackingNumber: 'TRK987654321'
      },
      {
        id: 'ORD-005',
        customerName: 'David Brown',
        customerEmail: 'david@example.com',
        customerPhone: '+1 (555) 654-3210',
        orderDate: '2025-07-13T11:45:00',
        status: 'cancelled',
        total: 299.99,
        shipping: 15.00,
        tax: 24.00,
        subtotal: 260.99,
        shippingAddress: {
          street: '654 Maple Dr',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA'
        },
        items: [
          { name: 'Mechanical Keyboard RGB', quantity: 1, price: 129.99, sku: 'KEY-003' },
          { name: 'Wireless Gaming Mouse', quantity: 1, price: 169.99, sku: 'MOU-005' }
        ],
        paymentMethod: 'Credit Card',
        paymentStatus: 'refunded',
        trackingNumber: null
      },
      {
        id: 'ORD-006',
        customerName: 'David Brown',
        customerEmail: 'david@example.com',
        customerPhone: '+1 (555) 654-3210',
        orderDate: '2025-07-13T11:45:00',
        status: 'cancelled',
        total: 299.99,
        shipping: 15.00,
        tax: 24.00,
        subtotal: 260.99,
        shippingAddress: {
          street: '654 Maple Dr',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA'
        },
        items: [
          { name: 'Mechanical Keyboard RGB', quantity: 1, price: 129.99, sku: 'KEY-003' },
          { name: 'Wireless Gaming Mouse', quantity: 1, price: 169.99, sku: 'MOU-005' }
        ],
        paymentMethod: 'Credit Card',
        paymentStatus: 'refunded',
        trackingNumber: null
      },
      {
        id: 'ORD-007',
        customerName: 'David Brown',
        customerEmail: 'david@example.com',
        customerPhone: '+1 (555) 654-3210',
        orderDate: '2025-07-13T11:45:00',
        status: 'cancelled',
        total: 299.99,
        shipping: 15.00,
        tax: 24.00,
        subtotal: 260.99,
        shippingAddress: {
          street: '654 Maple Dr',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA'
        },
        items: [
          { name: 'Mechanical Keyboard RGB', quantity: 1, price: 129.99, sku: 'KEY-003' },
          { name: 'Wireless Gaming Mouse', quantity: 1, price: 169.99, sku: 'MOU-005' }
        ],
        paymentMethod: 'Credit Card',
        paymentStatus: 'refunded',
        trackingNumber: null
      }
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders.filter(order => 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        let trackingNumber = order.trackingNumber;
        if (newStatus === 'shipped' && !trackingNumber) {
          trackingNumber = `TRK${Date.now()}`;
        } else if (newStatus === 'cancelled' || newStatus === 'pending') {
          trackingNumber = null;
        }
        return { ...order, status: newStatus, trackingNumber };
      }
      return order;
    });
    setOrders(updatedOrders);
    setShowStatusModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const printInvoice = (order) => {
    // Mock print functionality
    console.log('Printing invoice for order:', order.id);
    alert(`Invoice for order ${order.id} sent to printer`);
  };

  const exportOrders = () => {
    // Mock export functionality
    console.log('Exporting orders...');
    alert('Orders exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="mt-2 text-gray-600">View and manage customer orders</p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button
            onClick={exportOrders}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <MdDownload />
            Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <MdRefresh />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Processing</h3>
          <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status === 'processing').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Shipped</h3>
          <p className="text-3xl font-bold text-purple-600">{orders.filter(o => o.status === 'shipped').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Delivered</h3>
          <p className="text-3xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, email, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: '425px', overflowY: 'auto' }}>
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-56 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="w-56 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 text-left align-middle">
                  <td className="w-56 px-6 py-4 whitespace-nowrap align-middle">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      {order.trackingNumber && (
                        <div className="text-sm text-gray-500">Track: {order.trackingNumber}</div>
                      )}
                    </div>
                  </td>
                  <td className="w-56 px-6 py-4 whitespace-nowrap align-middle">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="w-32 px-6 py-4 whitespace-nowrap align-middle">
                    <div className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                  </td>
                  <td className="w-32 px-6 py-4 whitespace-nowrap align-middle">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="w-40 px-6 py-4 whitespace-nowrap align-middle">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                    </div>
                  </td>
                  <td className="w-40 px-6 py-4 whitespace-nowrap align-middle text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                    <br />
                    {new Date(order.orderDate).toLocaleTimeString()}
                  </td>
                  <td className="w-32 px-6 py-4 whitespace-nowrap align-middle text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <MdVisibility />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowStatusModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Update Status"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => printInvoice(order)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Print Invoice"
                      >
                        <MdPrint />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="flex items-center justify-center z-50 fixed inset-0 pointer-events-none">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl pointer-events-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order Details - {selectedOrder.id}</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                </div>

                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Order Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Payment Status:</strong> 
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                  {selectedOrder.trackingNumber && (
                    <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.sku}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Summary */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping:</span>
                  <span>${selectedOrder.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax:</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => printInvoice(selectedOrder)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <MdPrint />
                Print Invoice
              </button>
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setShowStatusModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <MdEdit />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="flex items-center justify-center z-50 fixed inset-0 pointer-events-none">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl pointer-events-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Order Status</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Order ID: {selectedOrder.id}</p>
                <p className="text-sm text-gray-600">Customer: {selectedOrder.customerName}</p>
                <p className="text-sm text-gray-600">Current Status: 
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <div className="space-y-2">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      className={`w-full text-left px-4 py-2 rounded-lg border hover:bg-gray-50 ${
                        selectedOrder.status === status ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}