import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdLocalOffer, MdSchedule, MdVisibility, MdCode, MdPercent, MdSearch } from 'react-icons/md';

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: 'Summer Sale 2025',
      code: 'SUMMER25',
      type: 'percentage',
      value: 15,
      minAmount: 100,
      maxDiscount: 50,
      startDate: '2025-07-01',
      endDate: '2025-08-31',
      status: 'active',
      usageCount: 45,
      usageLimit: 100,
      categories: ['Laptops', 'Monitors'],
      description: '15% off on laptops and monitors'
    },
    {
      id: 2,
      name: 'Gaming Bundle',
      code: 'GAMING20',
      type: 'percentage',
      value: 20,
      minAmount: 200,
      maxDiscount: 100,
      startDate: '2025-07-15',
      endDate: '2025-07-30',
      status: 'active',
      usageCount: 12,
      usageLimit: 50,
      categories: ['Gaming'],
      description: '20% off on gaming products'
    },
    {
      id: 3,
      name: 'Free Shipping',
      code: 'FREESHIP',
      type: 'shipping',
      value: 0,
      minAmount: 50,
      maxDiscount: 15,
      startDate: '2025-07-01',
      endDate: '2025-12-31',
      status: 'active',
      usageCount: 156,
      usageLimit: 1000,
      categories: ['All'],
      description: 'Free shipping on orders over $50'
    },
    {
      id: 4,
      name: 'New Customer',
      code: 'WELCOME10',
      type: 'fixed',
      value: 25,
      minAmount: 100,
      maxDiscount: 25,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'active',
      usageCount: 89,
      usageLimit: 500,
      categories: ['All'],
      description: '$25 off for new customers'
    },
    {
      id: 5,
      name: 'Black Friday 2024',
      code: 'BLACK50',
      type: 'percentage',
      value: 50,
      minAmount: 500,
      maxDiscount: 200,
      startDate: '2024-11-29',
      endDate: '2024-11-30',
      status: 'expired',
      usageCount: 234,
      usageLimit: 200,
      categories: ['All'],
      description: '50% off everything (expired)'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    discount_type: 'percentage',
    discount_value: 0,
    start_date: '',
    end_date: '',
    // Keep existing fields for backward compatibility
    code: '',
    minAmount: 0,
    maxDiscount: 0,
    usageLimit: 100,
    categories: [],
    description: ''
  });

  const categories = ['All', 'Laptops', 'Monitors', 'Keyboards', 'Mice', 'Gaming', 'Accessories'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiData = {
      title: formData.title,
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      start_date: formData.start_date,
      end_date: formData.end_date
    };
    
    if (editingPromotion) {
      setPromotions(promotions.map(p => 
        p.id === editingPromotion.id 
          ? { 
              ...formData, 
              id: editingPromotion.id, 
              usageCount: editingPromotion.usageCount, 
              status: 'active',
              name: formData.title,
              type: formData.discount_type,
              value: formData.discount_value,
              startDate: formData.start_date,
              endDate: formData.end_date
            }
          : p
      ));
    } else {
      const newPromotion = {
        ...formData,
        id: Math.max(...promotions.map(p => p.id)) + 1,
        usageCount: 0,
        status: 'active',
        name: formData.title,
        type: formData.discount_type,
        value: formData.discount_value,
        startDate: formData.start_date,
        endDate: formData.end_date
      };
      setPromotions([...promotions, newPromotion]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      discount_type: 'percentage',
      discount_value: 0,
      start_date: '',
      end_date: '',
      code: '',
      minAmount: 0,
      maxDiscount: 0,
      usageLimit: 100,
      categories: [],
      description: ''
    });
    setEditingPromotion(null);
    setShowModal(false);
  };

  const handleEdit = (promotion) => {
    setFormData({
      title: promotion.name || promotion.title,
      discount_type: promotion.type || promotion.discount_type,
      discount_value: promotion.value || promotion.discount_value,
      start_date: promotion.startDate || promotion.start_date,
      end_date: promotion.endDate || promotion.end_date,
      code: promotion.code || '',
      minAmount: promotion.minAmount || 0,
      maxDiscount: promotion.maxDiscount || 0,
      usageLimit: promotion.usageLimit || 100,
      categories: promotion.categories || [],
      description: promotion.description || ''
    });
    setEditingPromotion(promotion);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setPromotions(promotions.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'percentage':
        return <MdPercent className="text-blue-500" />;
      case 'fixed':
        return <MdLocalOffer className="text-green-500" />;
      case 'shipping':
        return <MdCode className="text-purple-500" />;
      default:
        return <MdLocalOffer className="text-gray-500" />;
    }
  };

  const filteredPromotions = promotions.filter(promotion => 
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Promotions & Discounts</h1>
          <p className="mt-2 text-gray-600">Create and manage discount codes and promotions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
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
              <p className="text-3xl font-bold text-purple-600">$12,450</p>
            </div>
            <MdPercent className="text-3xl text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-orange-600">18.5%</p>
            </div>
            <MdSchedule className="text-3xl text-orange-600" />
          </div>
        </div>
      </div>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromotions.map((promotion) => (
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
                    <div className="text-sm text-gray-500">
                      Min: ${promotion.minAmount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {promotion.usageCount} / {promotion.usageLimit}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(promotion.usageCount / promotion.usageLimit) * 100}%` }}
                      ></div>
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
                      <button
                        onClick={() => toggleStatus(promotion.id)}
                        className="text-green-600 hover:text-green-900"
                        title={promotion.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <MdVisibility />
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
              ))}
            </tbody>
          </table>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: '425px' }} // Adjust height for ~5 rows
          >
            {/* ...existing code for scrollable content if needed... */}
          </div>
        </div>
      </div>

      {/* Create/Edit Promotion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
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

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Categories
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, categories: [...formData.categories, category] });
                          } else {
                            setFormData({ ...formData, categories: formData.categories.filter(c => c !== category) });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
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
    </div>
  );
}

       
