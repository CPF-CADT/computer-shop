import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdEdit, MdDelete, MdLocalOffer, MdSchedule, MdVisibility, MdCode, MdPercent, MdSearch, MdCheckCircle, MdCancel } from 'react-icons/md';
import { apiService } from '../../service/api';
import toast from 'react-hot-toast';
import { useCategory } from '../context/CategoryContext';

export default function PromotionsPage() {
  const { categories: allCategories, brands: allBrands, typeProducts: allTypeProducts, loadingCategories } = useCategory();

  const [searchTerm, setSearchTerm] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    discount_type: 'percentage',
    discount_value: 0,
    start_date: '',
    end_date: '',
    code: '', // Optional
  });

  // State for product selection modal
  const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);
  const [productsForPromotion, setProductsForPromotion] = useState([]); // Products to display in modal
  const [selectedProductsToApply, setSelectedProductsToApply] = useState([]); // Product codes selected for current promotion
  const [currentPromotionToApply, setCurrentPromotionToApply] = useState(null); // The promotion being applied to products
  const [productSearchTerm, setProductSearchTerm] = useState(''); // Search term for products in modal
  const [loadingProducts, setLoadingProducts] = useState(false);

  // New states for product filters within the modal
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedProductBrand, setSelectedProductBrand] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('');

  // New state for targeting type in modal: 'specific', 'category', 'type', 'brand'
  const [productTargetingType, setProductTargetingType] = useState('specific');
  const [selectedTargetCategoryIds, setSelectedTargetCategoryIds] = useState([]);
  const [selectedTargetTypeIds, setSelectedTargetTypeIds] = useState([]);
  const [selectedTargetBrandIds, setSelectedTargetBrandIds] = useState([]);


  // Fetch all promotions on component mount
  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await apiService.getAllPromotions();
      const formattedPromotions = data.map(promo => ({
        id: promo.promotion_id,
        name: promo.title,
        code: promo.code || '',
        type: promo.discount_type,
        value: promo.discount_value,
        startDate: promo.start_date,
        endDate: promo.end_date,
        status: new Date(promo.end_date) < new Date() ? 'expired' : 'active', // Derived
        usageCount: 0, // Mocked, replace with API data if available
        usageLimit: 1000, // Mocked, replace with API data if available
        description: promo.description || '', // Assuming description can come from API
      }));
      setPromotions(formattedPromotions);
    } catch (err) {
      setApiError(err.message || "Failed to load promotions.");
      console.error("Error fetching promotions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  // Fetch products for the selection modal based on filters
  const fetchProductsForPromotion = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const params = {
        limit: 50, // Limit products in the selection modal
        name: productSearchTerm, // Search by product name
      };

      // Ensure API expects 'type_id' or 'type_name' based on your backend.
      // If your API's `getProducts` expects the name (e.g., "VGA") for `type_product` parameter,
      // then `selectedProductType` should be `type.name`. If it expects ID, it should be `type.id`.
      // Based on previous discussions, it assumes `type_product` expects the name (title).
      if (selectedProductType) { // selectedProductType will now hold the name (e.g. "VGA")
        params.type_product = selectedProductType;
      }
      if (selectedProductBrand) { // selectedProductBrand holds the name (e.g., "ASUS")
        params.brand = selectedProductBrand;
      }
      if (selectedProductCategory) { // selectedProductCategory holds the title (e.g., "Laptops")
        params.category = selectedProductCategory;
      }

      const response = await apiService.getProducts(params);
      setProductsForPromotion(response.data || []);
    } catch (err) {
      toast.error("Failed to load products for selection.");
      console.error("Error fetching products for promotion:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, [productSearchTerm, selectedProductType, selectedProductBrand, selectedProductCategory]);

  useEffect(() => {
    if (showProductSelectionModal && !loadingCategories) { // Only fetch products if categories are loaded
      fetchProductsForPromotion();
    }
  }, [showProductSelectionModal, productSearchTerm, selectedProductType, selectedProductBrand, selectedProductCategory, fetchProductsForPromotion, loadingCategories]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    try {
      const apiData = {
        title: formData.title,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value), // Ensure it's a number
        start_date: formData.start_date,
        end_date: formData.end_date,
        code: formData.code || null, // Send null if empty
      };

      if (editingPromotion) {
        await apiService.updatePromotion(editingPromotion.id, apiData);
        toast.success("Promotion updated successfully!");
      } else {
        await apiService.createPromotion(apiData);
        toast.success("Promotion created successfully!");
      }
      resetForm();
      fetchPromotions(); // Refresh list
    } catch (err) {
      setApiError(err.message || "Failed to save promotion.");
      toast.error(err.message || "Failed to save promotion.");
      console.error("Promotion save error:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      discount_type: 'percentage',
      discount_value: 0,
      start_date: '',
      end_date: '',
      code: '',
    });
    setEditingPromotion(null);
    setShowModal(false);
  };

  const handleEdit = (promotion) => {
    setFormData({
      title: promotion.name || promotion.title, // Use name or title
      discount_type: promotion.type || promotion.discount_type,
      discount_value: promotion.value || promotion.discount_value,
      start_date: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '', // Format date for input
      end_date: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '', // Format date for input
      code: promotion.code || '',
    });
    setEditingPromotion(promotion);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    setApiError(null);
    try {
      await apiService.deletePromotion(id);
      toast.success("Promotion deleted successfully!");
      fetchPromotions(); // Refresh list
    } catch (err) {
      setApiError(err.message || "Failed to delete promotion.");
      toast.error(err.message || "Failed to delete promotion.");
      console.error("Promotion delete error:", err);
    }
  };

  const handleApplyPromotionClick = (promotion) => {
    setCurrentPromotionToApply(promotion);
    setSelectedProductsToApply([]); // Reset for new selection
    setProductSearchTerm(''); // Clear search
    setSelectedProductType(''); // Clear filters
    setSelectedProductBrand('');
    setSelectedProductCategory('');
    setProductTargetingType('specific'); // Default to specific product
    setSelectedTargetCategoryIds([]);
    setSelectedTargetTypeIds([]);
    setSelectedTargetBrandIds([]);
    setShowProductSelectionModal(true);
  };

  const handleApplyProductsSubmit = async () => {
    if (!currentPromotionToApply) {
      toast.error("No promotion selected.");
      return;
    }

    setApiError(null);
    let payload = { promotionId: currentPromotionToApply.id };
    let successMessage = `Promotion '${currentPromotionToApply.name}' applied`;

    if (productTargetingType === 'specific') {
      if (selectedProductsToApply.length === 0) {
        toast.error("Please select at least one specific product.");
        return;
      }
      payload.productCodes = selectedProductsToApply;
      successMessage += ` to ${selectedProductsToApply.length} specific products!`;
    } else if (productTargetingType === 'category') {
      if (selectedTargetCategoryIds.length === 0) {
        toast.error("Please select at least one category.");
        return;
      }
      payload.categoryIds = selectedTargetCategoryIds;
      successMessage += ` to products in selected categories!`;
    } else if (productTargetingType === 'type') {
      if (selectedTargetTypeIds.length === 0) {
        toast.error("Please select at least one product type.");
        return;
      }
      payload.typeIds = selectedTargetTypeIds;
      successMessage += ` to products of selected types!`;
    } else if (productTargetingType === 'brand') {
      if (selectedTargetBrandIds.length === 0) {
        toast.error("Please select at least one brand.");
        return;
      }
      payload.brandIds = selectedTargetBrandIds;
      successMessage += ` to products of selected brands!`;
    } else {
      toast.error("Please select a targeting method.");
      return;
    }

    try {
      await apiService.applyPromotionBatch(payload);
      toast.success(successMessage);
      setShowProductSelectionModal(false);
      // Reset all states related to product selection
      setSelectedProductsToApply([]);
      setProductSearchTerm('');
      setSelectedProductType('');
      setSelectedProductBrand('');
      setSelectedProductCategory('');
      setProductTargetingType('specific');
      setSelectedTargetCategoryIds([]);
      setSelectedTargetTypeIds([]);
      setSelectedTargetBrandIds([]);
      fetchPromotions(); // Refresh promotions to update usage stats if applicable
    } catch (err) {
      setApiError(err.message || "Failed to apply promotion.");
      toast.error(err.message || "Failed to apply promotion.");
      console.error("Apply promotion error:", err);
    }
  };

  const handleRevokePromotion = async (promotionId, productCode) => {
    if (!window.confirm(`Are you sure you want to revoke this promotion from product ${productCode}?`)) return;
    setApiError(null);
    try {
      await apiService.revokePromotionFromProduct(promotionId, productCode);
      toast.success(`Promotion revoked from product ${productCode}.`);
      fetchPromotions(); // Refresh promotions to update usage stats if applicable
    } catch (err) {
      setApiError(err.message || "Failed to revoke promotion.");
      toast.error(err.message || "Failed to revoke promotion.");
      console.error("Revoke promotion error:", err);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'percentage': return <MdPercent className="text-blue-500" />;
      case 'fixed': return <MdLocalOffer className="text-green-500" />;
      case 'shipping': return <MdCode className="text-purple-500" />;
      default: return <MdLocalOffer className="text-gray-500" />;
    }
  };

  const filteredPromotions = promotions.filter(promotion =>
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (promotion.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || loadingCategories) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading promotions and categories...</div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-800">Promotions & Discounts</h1>
          <p className="mt-2 text-gray-600">Create and manage discount codes and promotions</p>
        </div>
        <button
          onClick={() => { setEditingPromotion(null); resetForm(); setShowModal(true); }}
          className="mt-4 lg:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd />
          Create Promotion
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Promotions</p>
              <p className="text-3xl font-bold text-green-600">
                {promotions.filter(p => p.status === 'active').length}
              </p>
            </div>
            <MdLocalOffer className="text-3xl text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usage</p>
              <p className="text-3xl font-bold text-blue-600">
                {/* Usage count is mocked, replace with API data if available */}
                {promotions.reduce((sum, p) => sum + p.usageCount, 0)}
              </p>
            </div>
            <MdCode className="text-3xl text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Savings Generated</p>
              <p className="text-3xl font-bold text-purple-600">$0</p> {/* Mocked, replace with actual calculation */}
            </div>
            <MdPercent className="text-3xl text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-orange-600">0%</p> {/* Mocked, replace with actual calculation */}
            </div>
            <MdSchedule className="text-3xl text-orange-600" />
          </div>
        </div>
      </div>

      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {apiError}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search promotions by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromotions.length > 0 ? (
                filteredPromotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(promotion.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{promotion.name}</div>
                          <div className="text-sm text-gray-500">{promotion.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">
                        {promotion.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {promotion.type === 'percentage' && `${promotion.value}%`}
                        {promotion.type === 'fixed' && `$${promotion.value}`}
                        {promotion.type === 'shipping' && 'Free Shipping'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(promotion.startDate).toLocaleDateString()}</div>
                      <div>{new Date(promotion.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(promotion.status)}`}>
                        {promotion.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(promotion)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <MdEdit />
                        </button>
                        {/* Apply/Revoke button */}
                        <button
                          onClick={() => handleApplyPromotionClick(promotion)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Apply to Products"
                        >
                          <MdAdd />
                        </button>
                        <button
                          onClick={() => handleDelete(promotion.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No promotions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Promotion Modal */}
      {showModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Promotion Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Discount Type and Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.discount_type === 'percentage' ? 'Percentage (%)' :
                      formData.discount_type === 'fixed' ? 'Amount ($)' : 'Shipping Cost ($)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Start and End Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Optional fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description (removed from API, but kept in form if needed for local display) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description || ''} // Handle undefined if not set
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Optional description..."
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Selection Modal */}
      {showProductSelectionModal && currentPromotionToApply && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Apply/Revoke Promotion: "{currentPromotionToApply.name}"
              </h2>
              <button
                onClick={() => { setShowProductSelectionModal(false); setSelectedProductsToApply([]); setProductSearchTerm(''); setSelectedProductType(''); setSelectedProductBrand(''); setSelectedProductCategory(''); setProductTargetingType('specific'); setSelectedTargetCategoryIds([]); setSelectedTargetTypeIds([]); setSelectedTargetBrandIds([]); }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Targeting Type Selection */}
            <div className="mb-4 border-b pb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Apply Promotion To:</h3>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="productTargeting"
                    value="specific"
                    checked={productTargetingType === 'specific'}
                    onChange={(e) => setProductTargetingType(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-800">Specific Products</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="productTargeting"
                    value="category"
                    checked={productTargetingType === 'category'}
                    onChange={(e) => setProductTargetingType(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-800">By Category</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="productTargeting"
                    value="type"
                    checked={productTargetingType === 'type'}
                    onChange={(e) => setProductTargetingType(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-800">By Product Type</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="productTargeting"
                    value="brand"
                    checked={productTargetingType === 'brand'}
                    onChange={(e) => setProductTargetingType(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-800">By Brand</span>
                </label>
              </div>
            </div>

            {/* Conditional Filters based on productTargetingType */}
            {productTargetingType === 'specific' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Product</label>
                  <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
                    <select
                      value={selectedProductType}
                      onChange={(e) => setSelectedProductType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {allTypeProducts.map(type => (
                        <option key={type.id} value={type.name}>{type.name}</option> 
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Brand</label>
                    <select
                      value={selectedProductBrand}
                      onChange={(e) => setSelectedProductBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Brands</option>
                      {allBrands.map(brand => (
                        <option key={brand.id} value={brand.name}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                    <select
                      value={selectedProductCategory}
                      onChange={(e) => setSelectedProductCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                      {allCategories.map(category => (
                        <option key={category.id} value={category.title}>{category.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {loadingProducts ? (
                  <div className="text-center text-gray-500 py-8">Loading products...</div>
                ) : productsForPromotion.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto border p-3 rounded-md">
                    {productsForPromotion.map(product => (
                      <div key={product.product_code} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            value={product.product_code}
                            checked={selectedProductsToApply.includes(product.product_code)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductsToApply(prev => [...prev, product.product_code]);
                              } else {
                                setSelectedProductsToApply(prev => prev.filter(code => code !== product.product_code));
                              }
                            }}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-800">{product.name} ({product.product_code})</span>
                        </div>
                        {/* Revoke button for individual products */}
                        <button
                          onClick={() => handleRevokePromotion(currentPromotionToApply.id, product.product_code)}
                          className="text-red-500 hover:text-red-700 text-sm"
                          title="Revoke from this product"
                        >
                          <MdCancel /> Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">No products found matching filters.</div>
                )}
              </>
            )}

            {/* Category Selection for Batch Apply */}
            {productTargetingType === 'category' && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Select Categories:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto border p-3 rounded-md">
                  {allCategories.map(category => (
                    <label key={category.id} className="flex items-center text-sm text-gray-800">
                      <input
                        type="checkbox"
                        value={category.id}
                        checked={selectedTargetCategoryIds.includes(category.id)}
                        onChange={(e) => {
                          const id = parseInt(e.target.value);
                          if (e.target.checked) {
                            setSelectedTargetCategoryIds(prev => [...prev, id]);
                          } else {
                            setSelectedTargetCategoryIds(prev => prev.filter(catId => catId !== id));
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="ml-2">{category.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Product Type Selection for Batch Apply */}
            {productTargetingType === 'type' && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Select Product Types:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto border p-3 rounded-md">
                  {allTypeProducts.map(type => (
                    <label key={type.id} className="flex items-center text-sm text-gray-800">
                      <input
                        type="checkbox"
                        value={type.id}
                        checked={selectedTargetTypeIds.includes(type.id)}
                        onChange={(e) => {
                          const id = parseInt(e.target.value);
                          if (e.target.checked) {
                            setSelectedTargetTypeIds(prev => [...prev, id]);
                          } else {
                            setSelectedTargetTypeIds(prev => prev.filter(typeId => typeId !== id));
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="ml-2">{type.name}</span> {/* FIX: Use type.name */}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Selection for Batch Apply */}
            {productTargetingType === 'brand' && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Select Brands:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto border p-3 rounded-md">
                  {allBrands.map(brand => (
                    <label key={brand.id} className="flex items-center text-sm text-gray-800">
                      <input
                        type="checkbox"
                        value={brand.id} // Use brand.id for backend API
                        checked={selectedTargetBrandIds.includes(brand.id)}
                        onChange={(e) => {
                          const id = parseInt(e.target.value);
                          if (e.target.checked) {
                            setSelectedTargetBrandIds(prev => [...prev, id]);
                          } else {
                            setSelectedTargetBrandIds(prev => prev.filter(brandId => brandId !== id));
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="ml-2">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}


            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => { setShowProductSelectionModal(false); setSelectedProductsToApply([]); setProductSearchTerm(''); setSelectedProductType(''); setSelectedProductBrand(''); setSelectedProductCategory(''); setProductTargetingType('specific'); setSelectedTargetCategoryIds([]); setSelectedTargetTypeIds([]); setSelectedTargetBrandIds([]); }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleApplyProductsSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={
                  (productTargetingType === 'specific' && selectedProductsToApply.length === 0) ||
                  (productTargetingType === 'category' && selectedTargetCategoryIds.length === 0) ||
                  (productTargetingType === 'type' && selectedTargetTypeIds.length === 0) ||
                  (productTargetingType === 'brand' && selectedTargetBrandIds.length === 0)
                }
              >
                Apply Promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
