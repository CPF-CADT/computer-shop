import { useState, useEffect, useCallback } from 'react';
import { 
    MdSearch, MdFilterList, MdEdit, MdPrint, MdRefresh, MdVisibility, MdDownload, 
    MdChevronLeft, MdChevronRight 
} from 'react-icons/md';
import { apiService} from '../../service/api';

// A custom hook for debouncing input to prevent excessive API calls
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// Data for the Province filter dropdown
const cambodianProvinces = [
  'Banteay Meanchey', 'Battambang', 'Kampong Cham', 'Kampong Chhnang', 
  'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kandal', 'Koh Kong', 
  'Kratie', 'Mondulkiri', 'Phnom Penh', 'Preah Vihear', 'Prey Veng', 
  'Pursat', 'Ratanakiri', 'Siem Reap', 'Preah Sihanouk', 'Stung Treng', 
  'Svay Rieng', 'Takeo', 'Oddar Meanchey', 'Kep', 'Pailin', 'Tboung Khmum'
];

export default function OrdersPage() {
  // Data and loading state
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, limit: 10 });
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  
  // Debounced search term for efficient API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Centralized function to fetch data based on current filters and page
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchTerm || undefined,
        // API might expect capitalized status, e.g., 'Pending'
        status: statusFilter !== 'all' ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : undefined,
        province: provinceFilter !== 'all' ? provinceFilter : undefined,
      };

      const promises = [apiService.getOrders(params)];
      if (isRefresh || !summary) {
        promises.push(apiService.getOrderSummary());
      }
      
      const [ordersResponse, summaryResponse] = await Promise.all(promises);

      setPagination(prev => ({
        ...prev,
        totalPages: ordersResponse.meta.totalPages,
      }));

      const mappedOrders = ordersResponse.data.map(order => ({
        id: order.order_id,
        customerName: order.customer.name,
        customerEmail: 'N/A',
        customerPhone: order.customer.phone_number,
        orderDate: order.order_date,
        status: order.order_status.toLowerCase(),
        total: parseFloat(order.totalMoney),
        items: [],
        paymentMethod: 'N/A',
        paymentStatus: 'paid',
        shippingAddress: {
          street: order.address.street_line,
          city: order.address.district,
          state: order.address.province,
          zipCode: '',
          country: 'Cambodia'
        },
        trackingNumber: null,
      }));

      setOrders(mappedOrders);
      if (summaryResponse) {
          setSummary(summaryResponse);
      }

    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchTerm, statusFilter, provinceFilter, summary]);

  // Effect to re-fetch data whenever filters or page change
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Reset page to 1 when filters change
  useEffect(() => {
    setPagination(p => ({ ...p, page: 1 }));
  }, [debouncedSearchTerm, statusFilter, provinceFilter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const openOrderDetails = async (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
    setDetailLoading(true);
    try {
      const detailedData = await apiService.getUserOrderdetail(order.id);
      const mappedItems = detailedData.items.map(item => ({
        name: item.name,
        sku: item.product_code,
        quantity: item.OrderItem.qty,
        price: parseFloat(item.OrderItem.price_at_purchase)
      }));
      const subtotal = mappedItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
      const shippingAndTax = order.total - subtotal;
      setSelectedOrder(prev => ({
        ...prev,
        items: mappedItems,
        subtotal: subtotal,
        shipping: shippingAndTax > 0 ? shippingAndTax : 0,
        tax: 0,
      }));
    } catch (err) {
      console.error("Failed to fetch order details:", err);
    } finally {
      setDetailLoading(false);
    }
  };
  
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    // TODO: Add an API call to your backend to persist this change.
    // e.g., apiService.updateOrderStatus(orderId, { status: newStatus });
    setShowStatusModal(false);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const printInvoice = (order) => {
    console.log('Printing invoice for order:', order.id);
    alert(`Invoice for order ${order.id} sent to printer`);
  };

  const exportOrders = () => {
    console.log('Exporting orders...');
    alert('Orders exported successfully');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="mt-2 text-gray-600">View and manage customer orders</p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button onClick={exportOrders} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <MdDownload /> Export
          </button>
          <button onClick={() => fetchData(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <MdRefresh /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">{summary?.totalOrders.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{summary?.counts?.Pending.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Processing</h3>
          <p className="text-3xl font-bold text-blue-600">{summary?.counts?.Processing.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h3 className="text-sm font-medium text-gray-600">Cancelled</h3>
           <p className="text-3xl font-bold text-red-600">{summary?.counts?.Cancelled?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Delivered</h3>
          <p className="text-3xl font-bold text-green-600">{summary?.counts?.Delivered.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or order ID..."
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
           <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Provinces</option>
              {cambodianProvinces.sort().map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-10">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="7" className="text-center py-10 text-red-500">Error: {error}</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-10">No orders found.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openOrderDetails(order)} className="text-blue-600 hover:text-blue-900" title="View Details"><MdVisibility /></button>
                        <button onClick={() => { setSelectedOrder(order); setShowStatusModal(true); }} className="text-green-600 hover:text-green-900" title="Update Status"><MdEdit /></button>
                        <button onClick={() => printInvoice(order)} className="text-purple-600 hover:text-purple-900" title="Print Invoice"><MdPrint /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between p-4 border-t">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <MdChevronLeft/> Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next <MdChevronRight/>
          </button>
        </div>
      </div>

      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order Details - {selectedOrder.id}</h2>
              <button onClick={() => setShowOrderModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            {detailLoading ? (
              <div className="text-center p-8">Loading details...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                      <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                    </div>
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Order Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status}
                          </span>
                        </p>
                    </div>
                  </div>
                </div>

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

                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Subtotal:</span>
                      <span>${(selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Shipping & Tax (est.):</span>
                      <span>${(selectedOrder.shipping || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => printInvoice(selectedOrder)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"><MdPrint /> Print Invoice</button>
                    <button onClick={() => { setShowOrderModal(false); setShowStatusModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><MdEdit /> Update Status</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Order Status</h2>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <div className="space-y-2">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      className={`w-full text-left px-4 py-2 rounded-lg border hover:bg-gray-50 ${selectedOrder.status === status ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}