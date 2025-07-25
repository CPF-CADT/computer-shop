import { useState, useEffect, useCallback } from 'react';
import { MdWarning, MdInventory, MdSearch, MdAdd, MdRemove } from 'react-icons/md';
import { apiService } from '../../service/api';
import toast from 'react-hot-toast';
import Pagination from './Pagination'; // Assuming you have this component

export default function InventoryPage() {
  // State for data and loading
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for dashboard summary cards
  const [summaryData, setSummaryData] = useState({ totalProducts: 0, lowStockCount: 0, inventoryValue: 0 });
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  // Simplified state for filters: only name search and stock sort direction
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    name: "",      
    sort: 'asc',  
  });

  // State for the stock adjustment modal
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'add' or 'decrease'
  const [adjustmentAmount, setAdjustmentAmount] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch products from the API, always sorting by stock
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = {
        ...filters,
        order_column: 'stock_quantity', // Ensure this matches your API parameter for stock quantity
      };
      const res = await apiService.getProducts(queryParams);
      setProducts(res.data || []);
      // Assuming meta contains totalItems for pagination
      setSummaryData(prev => ({ ...prev, totalProducts: res.meta?.totalItems || 0 }));
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch inventory.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);
  
  // The fetchSummaryData can be re-enabled if you have an API for it
  /*
  const fetchSummaryData = async () => { ... };
  */

  useEffect(() => {
    fetchProducts();
    // fetchSummaryData(); // Re-enable if you have the API
  }, [fetchProducts]);

  // Handlers for UI interactions
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };
  
  const openModal = (product, mode) => {
    setSelectedProduct(product);
    setModalMode(mode);
    setAdjustmentAmount(1); // Reset to a sensible default
    setShowStockModal(true);
  };

  const closeModal = () => {
    setShowStockModal(false);
    setSelectedProduct(null);
    setModalMode(null);
    setAdjustmentAmount(1);
  };
  
  const handleStockUpdate = async () => {
    if (!selectedProduct || !modalMode || adjustmentAmount <= 0) {
        toast.error("Please enter a valid quantity.");
        return;
    }

    setIsUpdating(true);

    // Calculate the new stock based on the mode (add/decrease)
    let newStock;
    if (modalMode === 'add') {
      newStock = selectedProduct.stock + adjustmentAmount;
    } else { // mode is 'decrease'
      newStock = Math.max(0, selectedProduct.stock - adjustmentAmount);
    }
    
    try {
      // Send the *final calculated stock amount* to the API
      await apiService.updateProduct(selectedProduct.product_code, {stock_quantity:newStock});
      toast.success("Stock updated successfully!");
      closeModal();
      fetchProducts(); // Refresh the table
      // fetchSummaryData(); // Refresh summary cards if API exists
    } catch (error) {
      toast.error(error.message || "Failed to update stock.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const totalPages = Math.ceil(summaryData.totalProducts / filters.limit);

  // Calculate new total for modal preview
  const newTotalPreview = selectedProduct ? (
      modalMode === 'add' 
      ? selectedProduct.stock + adjustmentAmount 
      : Math.max(0, selectedProduct.stock - adjustmentAmount)
  ) : 0;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <p className="mt-1 text-gray-600">Track and update product stock levels.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards remain the same, data is placeholder until fetchSummaryData is active */}
        <div className="bg-white p-5 rounded-lg shadow-sm">...</div>
        <div className="bg-white p-5 rounded-lg shadow-sm">...</div>
        <div className="bg-white p-5 rounded-lg shadow-sm">...</div>
      </div>
      
      {/* Simplified Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow w-full md:w-auto">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-shrink-0 w-full md:w-auto">
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Sort by stock"
          >
            <option value="asc">Sort: Stock (Low to High)</option>
            <option value="desc">Sort: Stock (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-10 text-gray-500">Loading inventory...</td></tr>
              ) : error ? (
                <tr><td colSpan="4" className="text-center py-10 text-red-500">{error}</td></tr>
              ) : products.length > 0 ? (
                products.map((item) => {
                  const status = getStatus(item.stock);
                  return (
                    <tr key={item.product_code} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-md object-cover" src={item.image_path} alt={item.name} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.product_code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-800">{item.stock}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>{status.text}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {/* UPDATED ACTION BUTTONS */}
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => openModal(item, 'add')}
                                className="p-2 rounded-full text-green-700 bg-green-100 hover:bg-green-200"
                                title="Add Stock"
                            >
                                <MdAdd size={18} />
                            </button>
                            <button
                                onClick={() => openModal(item, 'decrease')}
                                className="p-2 rounded-full text-red-700 bg-red-100 hover:bg-red-200"
                                title="Decrease Stock"
                            >
                                <MdRemove size={18} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                 <tr><td colSpan="4" className="text-center py-10 text-gray-500">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {!isLoading && totalPages > 1 && (
            <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>

      {/* UPDATED Stock Adjustment Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-2 capitalize">{modalMode} Stock</h2>
            <p className="text-sm text-gray-600 mb-4">{selectedProduct.name}</p>
            
            <div>
              <label htmlFor="stock-quantity" className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                Quantity to {modalMode}
              </label>
              <input
                id="stock-quantity"
                type="number"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
               <p className="text-sm text-gray-500 mt-2">
                Current: <span className="font-medium">{selectedProduct.stock}</span> → New Total: <span className="font-bold">{newTotalPreview}</span>
               </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={handleStockUpdate}
                disabled={isUpdating}
                className={`px-4 py-2 text-white rounded-lg flex items-center justify-center ${
                    modalMode === 'add' 
                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300' 
                    : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                }`}
              >
                {isUpdating ? 'Saving...' : `Confirm ${modalMode}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}