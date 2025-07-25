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
  fetchOrders(1,7,'date','DESC',false)
}, []);


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
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
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
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
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
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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