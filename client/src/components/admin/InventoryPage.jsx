import React, { useState, useEffect } from 'react';
import { MdWarning, MdInventory, MdSearch, MdFilterList, MdEdit, MdAdd, MdRemove, MdLocationOn } from 'react-icons/md';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState({ type: 'add', quantity: 0, reason: '' });

  useEffect(() => {
    const mockInventory = [
      {
        id: 1,
        sku: 'LAP-001',
        name: 'Gaming Laptop ASUS ROG',
        category: 'Laptops',
        brand: 'ASUS',
        currentStock: 15,
        minStock: 5,
        maxStock: 50,
        reservedStock: 3,
        availableStock: 12,
        warehouseLocation: 'A-1-05',
        costPrice: 1200.00,
        sellingPrice: 1599.99,
        supplier: 'Tech Distributors Inc.',
        lastRestocked: '2025-07-10',
        status: 'in_stock'
      },
      {
        id: 2,
        sku: 'MON-002',
        name: '27" Gaming Monitor',
        category: 'Monitors',
        brand: 'LG',
        currentStock: 8,
        minStock: 10,
        maxStock: 30,
        reservedStock: 2,
        availableStock: 6,
        warehouseLocation: 'B-2-12',
        costPrice: 250.00,
        sellingPrice: 349.99,
        supplier: 'Display Solutions',
        lastRestocked: '2025-07-05',
        status: 'low_stock'
      },
      {
        id: 3,
        sku: 'KEY-003',
        name: 'Mechanical Keyboard RGB',
        category: 'Keyboards',
        brand: 'Razer',
        currentStock: 25,
        minStock: 15,
        maxStock: 100,
        reservedStock: 5,
        availableStock: 20,
        warehouseLocation: 'C-1-08',
        costPrice: 75.00,
        sellingPrice: 129.99,
        supplier: 'Gaming Gear Ltd.',
        lastRestocked: '2025-07-12',
        status: 'in_stock'
      },
      {
        id: 4,
        sku: 'MOU-004',
        name: 'Wireless Gaming Mouse',
        category: 'Mice',
        brand: 'Logitech',
        currentStock: 3,
        minStock: 10,
        maxStock: 50,
        reservedStock: 1,
        availableStock: 2,
        warehouseLocation: 'C-2-15',
        costPrice: 45.00,
        sellingPrice: 79.99,
        supplier: 'Peripheral Pro',
        lastRestocked: '2025-06-28',
        status: 'critical_low'
      },
      {
        id: 5,
        sku: 'USB-005',
        name: 'USB-C Hub 7-in-1',
        category: 'Accessories',
        brand: 'Anker',
        currentStock: 0,
        minStock: 20,
        maxStock: 100,
        reservedStock: 0,
        availableStock: 0,
        warehouseLocation: 'D-1-03',
        costPrice: 25.00,
        sellingPrice: 49.99,
        supplier: 'Accessory Warehouse',
        lastRestocked: '2025-06-15',
        status: 'out_of_stock'
      }
    ];
    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
  }, []);

  useEffect(() => {
    let filtered = inventory.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredInventory(filtered);
  }, [searchTerm, statusFilter, categoryFilter, inventory]);

  const handleStockAdjustment = () => {
    if (!selectedProduct || stockAdjustment.quantity <= 0) return;

    const updatedInventory = inventory.map(item => {
      if (item.id === selectedProduct.id) {
        const newStock = stockAdjustment.type === 'add' 
          ? item.currentStock + stockAdjustment.quantity
          : Math.max(0, item.currentStock - stockAdjustment.quantity);
        
        const newAvailableStock = newStock - item.reservedStock;
        
        let newStatus = 'in_stock';
        if (newStock === 0) newStatus = 'out_of_stock';
        else if (newStock <= item.minStock * 0.5) newStatus = 'critical_low';
        else if (newStock <= item.minStock) newStatus = 'low_stock';

        return {
          ...item,
          currentStock: newStock,
          availableStock: newAvailableStock,
          status: newStatus,
          lastRestocked: stockAdjustment.type === 'add' ? new Date().toISOString().split('T')[0] : item.lastRestocked
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    setShowStockModal(false);
    setSelectedProduct(null);
    setStockAdjustment({ type: 'add', quantity: 0, reason: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical_low':
        return 'bg-orange-100 text-orange-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical_low':
      case 'out_of_stock':
        return <MdWarning className="text-red-500" />;
      case 'low_stock':
        return <MdWarning className="text-yellow-500" />;
      default:
        return <MdInventory className="text-green-500" />;
    }
  };

  const categories = [...new Set(inventory.map(item => item.category))];
  const lowStockItems = inventory.filter(item => ['low_stock', 'critical_low', 'out_of_stock'].includes(item.status));
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
          <p className="mt-2 text-gray-600">Track stock levels and manage warehouse inventory</p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Export Report
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Bulk Update
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-blue-600">{inventory.length}</p>
            </div>
            <MdInventory className="text-3xl text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
            <MdWarning className="text-3xl text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
              <p className="text-3xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
            </div>
            <MdInventory className="text-3xl text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Stock</p>
              <p className="text-3xl font-bold text-purple-600">
                {inventory.reduce((sum, item) => sum + item.availableStock, 0)}
              </p>
            </div>
            <MdInventory className="text-3xl text-purple-600" />
          </div>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <MdWarning className="text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.sku}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <p className="text-red-600">Current: {item.currentStock} units</p>
                  <p className="text-gray-500">Minimum: {item.minStock} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MdFilterList className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="critical_low">Critical Low</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Levels</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(item.status)}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.sku} • {item.brand}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>Current: <span className="font-medium">{item.currentStock}</span></div>
                    <div>Available: <span className="text-green-600">{item.availableStock}</span></div>
                    <div>Reserved: <span className="text-orange-600">{item.reservedStock}</span></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Min: {item.minStock} | Max: {item.maxStock}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MdLocationOn className="text-gray-400 mr-1" />
                    {item.warehouseLocation}
                  </div>
                  <div className="text-sm text-gray-500">{item.supplier}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>Cost: ${item.costPrice}</div>
                    <div>Selling: ${item.sellingPrice}</div>
                    <div className="font-medium">Total: ${(item.currentStock * item.costPrice).toLocaleString()}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    Last restocked: {new Date(item.lastRestocked).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(item);
                        setShowStockModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Adjust Stock"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(item);
                        setStockAdjustment({ type: 'add', quantity: 1, reason: 'Quick restock' });
                        setShowStockModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                      title="Add Stock"
                    >
                      <MdAdd />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(item);
                        setStockAdjustment({ type: 'remove', quantity: 1, reason: 'Quick adjustment' });
                        setShowStockModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Remove Stock"
                    >
                      <MdRemove />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showStockModal && selectedProduct && (
        <div className="flex items-center justify-center z-50 fixed inset-0 pointer-events-none">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md shadow-2xl pointer-events-auto mx-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Adjust Stock</h2>
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setSelectedProduct(null);
                  setStockAdjustment({ type: 'add', quantity: 0, reason: '' });
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-600">{selectedProduct.sku}</p>
                <p className="text-sm text-gray-600">Current Stock: {selectedProduct.currentStock} units</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Type
                </label>
                <select
                  value={stockAdjustment.type}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="add">Add Stock</option>
                  <option value="remove">Remove Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={stockAdjustment.quantity}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  value={stockAdjustment.reason}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter reason for stock adjustment..."
                ></textarea>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  New stock level will be: {' '}
                  <span className="font-medium">
                    {stockAdjustment.type === 'add' 
                      ? selectedProduct.currentStock + stockAdjustment.quantity
                      : Math.max(0, selectedProduct.currentStock - stockAdjustment.quantity)
                    } units
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setSelectedProduct(null);
                  setStockAdjustment({ type: 'add', quantity: 0, reason: '' });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleStockAdjustment}
                className={`px-4 py-2 rounded-lg text-white ${
                  stockAdjustment.type === 'add' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {stockAdjustment.type === 'add' ? 'Add Stock' : 'Remove Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

