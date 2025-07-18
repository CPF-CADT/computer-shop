import React, { useState } from 'react';
import { MdDateRange, MdTrendingUp, MdShoppingCart, MdPeople, MdInventory, MdAttachMoney } from 'react-icons/md';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 125340.50,
      totalOrders: 1456,
      averageOrderValue: 86.12,
      conversionRate: 3.2,
      revenueGrowth: 15.3,
      ordersGrowth: 8.7
    },
    salesByCategory: [
      { category: 'Laptops', sales: 45230, percentage: 36 },
      { category: 'Monitors', sales: 32150, percentage: 26 },
      { category: 'Keyboards', sales: 18900, percentage: 15 },
      { category: 'Mice', sales: 15600, percentage: 12 },
      { category: 'Accessories', sales: 13460, percentage: 11 }
    ],
    topProducts: [
      { name: 'Gaming Laptop ASUS ROG', revenue: 67455, units: 45, growth: 25.3 },
      { name: '27" Gaming Monitor', revenue: 23400, units: 39, growth: 18.7 },
      { name: 'Mechanical Keyboard RGB', revenue: 18900, units: 189, growth: 12.4 },
      { name: 'Wireless Gaming Mouse', revenue: 15600, units: 156, growth: 8.9 },
      { name: 'USB-C Hub', revenue: 12300, units: 246, growth: 15.2 }
    ],
    monthlyData: [
      { month: 'Jan', revenue: 8500, orders: 95 },
      { month: 'Feb', revenue: 12300, orders: 142 },
      { month: 'Mar', revenue: 15600, orders: 178 },
      { month: 'Apr', revenue: 18900, orders: 205 },
      { month: 'May', revenue: 22400, orders: 234 },
      { month: 'Jun', revenue: 25100, orders: 267 },
      { month: 'Jul', revenue: 22640, orders: 235 }
    ]
  };

  const lowStockAlerts = [
    { product: 'Gaming Mouse Razer', currentStock: 3, minStock: 10, category: 'Accessories' },
    { product: 'USB-C Cable', currentStock: 5, minStock: 20, category: 'Accessories' },
    { product: '24" Monitor LG', currentStock: 2, minStock: 8, category: 'Monitors' },
    { product: 'Wireless Keyboard', currentStock: 4, minStock: 15, category: 'Keyboards' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
          <p className="mt-2 text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <div className="flex items-center gap-2">
            <MdDateRange className="text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'sales', label: 'Sales' },
              { id: 'products', label: 'Products' },
              { id: 'inventory', label: 'Inventory' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedReport === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedReport === 'overview' && (
          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-blue-900">${analyticsData.overview.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <MdTrendingUp className="mr-1" />
                      +{analyticsData.overview.revenueGrowth}%
                    </p>
                  </div>
                  <MdAttachMoney className="text-3xl text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Orders</p>
                    <p className="text-3xl font-bold text-green-900">{analyticsData.overview.totalOrders.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <MdTrendingUp className="mr-1" />
                      +{analyticsData.overview.ordersGrowth}%
                    </p>
                  </div>
                  <MdShoppingCart className="text-3xl text-green-600" />
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Avg Order Value</p>
                    <p className="text-3xl font-bold text-purple-900">${analyticsData.overview.averageOrderValue}</p>
                    <p className="text-sm text-purple-600">Per transaction</p>
                  </div>
                  <MdPeople className="text-3xl text-purple-600" />
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-orange-900">{analyticsData.overview.conversionRate}%</p>
                    <p className="text-sm text-orange-600">Website visitors</p>
                  </div>
                  <MdInventory className="text-3xl text-orange-600" />
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {analyticsData.monthlyData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="bg-blue-500 rounded-t w-8"
                      style={{ height: `${(data.revenue / 25100) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {selectedReport === 'sales' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales by Category */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
                <div className="space-y-3">
                  {analyticsData.salesByCategory.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{category.category}</span>
                          <span className="text-sm text-gray-600">${category.sales.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                <div className="space-y-3">
                  {analyticsData.topProducts.slice(0, 5).map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.units} units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+{product.growth}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {selectedReport === 'products' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Performance */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Product Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {analyticsData.topProducts.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">${product.revenue.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="text-green-600">+{product.growth}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category Distribution */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                <div className="space-y-4">
                  {analyticsData.salesByCategory.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{category.category}</span>
                          <span className="text-sm text-gray-600">{category.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {selectedReport === 'inventory' && (
          <div className="p-6 space-y-6">
            {/* Inventory Alerts */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-600">Low Stock Alerts</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="space-y-3">
                  {lowStockAlerts.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.product}</h4>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-red-600 font-medium">
                          {item.currentStock} / {item.minStock} units
                        </p>
                        <p className="text-xs text-gray-500">Current / Minimum</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-medium text-blue-800">Total Products</h4>
                <p className="text-2xl font-bold text-blue-900">89</p>
                <p className="text-sm text-blue-600">In inventory</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-medium text-green-800">In Stock</h4>
                <p className="text-2xl font-bold text-green-900">84</p>
                <p className="text-sm text-green-600">Available items</p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h4 className="font-medium text-red-800">Low Stock</h4>
                <p className="text-2xl font-bold text-red-900">{lowStockAlerts.length}</p>
                <p className="text-sm text-red-600">Need restocking</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
