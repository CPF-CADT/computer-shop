import { useState, useEffect  } from 'react';
import { MdShoppingCart, MdPeople, MdInventory, MdAttachMoney, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { apiService } from '../../service/api';
export default function DashboardPage() {
  const [loadingCounts, setLoadingCounts] = useState(true);
const [loadingSales, setLoadingSales] = useState(true);
const [orderLoading, setOrderLoading] = useState(true);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    newOrders: 0,
    lowStockItems: 0,
  });

  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

 useEffect(() => {
  async function fetchCounts() {
    setLoadingCounts(true);
    try {
      const data = await apiService.getStoreStatsCount({ tables: ['Orders', 'Customer', 'Product'] });
      setStats(prev => ({
        ...prev,
        totalOrders: data.Orders || 0,
        totalCustomers: data.Customer || 0,
        totalProducts: data.Product || 0,
      }));
    } catch (error) {
      console.error('Error fetching counts:', error.message);
    } finally {
      setLoadingCounts(false);
    }
  }

  async function fetchSales() {
    setLoadingSales(true);
    try {
      const saleInfo = await apiService.getStoreSaleInfor(5);
      setStats(prev => ({
        ...prev,
        totalRevenue: saleInfo.totalAmount || 0,
      }));
      setTopProducts(saleInfo.topProducts || []);
    } catch (error) {
      console.error('Error fetching sales info:', error.message);
    } finally {
      setLoadingSales(false);
    }
  }
  
  const fetchOrders = async (page, limit, sortBy, sortType,includesItem) => {
    setOrderLoading(true);
    try {
      const data = await apiService.getOrders({ page, limit, sortBy, sortType,includesItem });
      setRecentOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setOrderLoading(false);
    }
  }

  fetchCounts();
  fetchSales();
  fetchOrders(1,7,'date','ASC',false)
}, []);


  // const recentOrders = [
  //   { id: '#ORD-001', customer: 'John Doe', total: '$299.99', status: 'Shipped', date: '2025-07-15' },
  //   { id: '#ORD-002', customer: 'Jane Smith', total: '$1,299.99', status: 'Processing', date: '2025-07-15' },
  //   { id: '#ORD-003', customer: 'Mike Johnson', total: '$599.99', status: 'Delivered', date: '2025-07-14' },
  //   { id: '#ORD-004', customer: 'Sarah Wilson', total: '$899.99', status: 'Pending', date: '2025-07-14' },
  // ];

  // const sssss = [
  //   { name: 'Gaming Laptop ASUS ROG', sales: 45, revenue: '$67,455' },
  //   { name: 'Mechanical Keyboard RGB', sales: 89, revenue: '$8,900' },
  //   { name: 'Wireless Gaming Mouse', sales: 156, revenue: '$7,800' },
  //   { name: '27" Gaming Monitor', sales: 23, revenue: '$11,500' },
  // ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">
                  {loadingCounts ? 'Loading...' : stats.totalOrders}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MdShoppingCart className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">{loadingCounts ? 'Loading...' : stats.totalCustomers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <MdPeople className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{loadingCounts ? 'Loading...' : stats.totalProducts} </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MdInventory className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-l font-bold text-gray-900">{loadingSales ? 'Loading...' : `$${stats.totalRevenue.toLocaleString()}`}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <MdAttachMoney className="text-l text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderLoading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.order_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.customer.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${order.totalMoney}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.order_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.order_status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Top Selling Products</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          {loadingSales ? 'Loading...' : 
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.product_code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.totalSoldQty} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">$ {product.totalPriceSold}</p>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors">
            <h3 className="font-medium text-blue-900">Add New Product</h3>
            <p className="text-sm text-blue-600 mt-1">Add items to your inventory</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors">
            <h3 className="font-medium text-green-900">Process Orders</h3>
            <p className="text-sm text-green-600 mt-1">{stats.newOrders} orders pending</p>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg text-left hover:bg-orange-100 transition-colors">
            <h3 className="font-medium text-orange-900">Create Promotion</h3>
            <p className="text-sm text-orange-600 mt-1">Boost your sales</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg text-left hover:bg-purple-100 transition-colors">
            <h3 className="font-medium text-purple-900">View Analytics</h3>
            <p className="text-sm text-purple-600 mt-1">Check detailed reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}