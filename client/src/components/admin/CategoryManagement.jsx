import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdCategory, MdLabel, MdSearch } from 'react-icons/md';
import { apiService } from '../../service/api';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [typeProducts, setTypeProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('categories');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [categoriesData, brandsData, typesData] = await Promise.all([
        apiService.getAllCategories(),
        apiService.getAllBrands(),
        apiService.getAllTypeProducts()
      ]);
      
      setCategories(categoriesData || []);
      setBrands(brandsData || []);
      setTypeProducts(typesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'categories') {
        if (editingItem) {
          // Update category
          await apiService.updateCategory(editingItem.id, formData);
        } else {
          // Create new category
          await apiService.createCategory(formData);
        }
      } else if (activeTab === 'brands') {
        if (editingItem) {
          // Update brand
          await apiService.updateBrand(editingItem.id, formData);
        } else {
          // Create new brand
          await apiService.createBrand(formData);
        }
      } else if (activeTab === 'types') {
        if (editingItem) {
          // Update type
          await apiService.updateTypeProduct(editingItem.id, formData);
        } else {
          // Create new type
          await apiService.createTypeProduct(formData);
        }
      }
      
      await fetchAllData(); // Refresh data
      resetForm();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      name: item.name || '',
      description: item.description || ''
    });
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      if (activeTab === 'categories') {
        await apiService.deleteCategory(id);
      } else if (activeTab === 'brands') {
        await apiService.deleteBrand(id);
      } else if (activeTab === 'types') {
        await apiService.deleteTypeProduct(id);
      }
      
      await fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      name: '',
      description: ''
    });
    setEditingItem(null);
    setShowModal(false);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'categories':
        return categories.filter(cat => 
          (cat.title || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'brands':
        return brands.filter(brand => 
          (brand.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'types':
        return typeProducts.filter(type => 
          (type.title || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'categories':
        return 'Categories';
      case 'brands':
        return 'Brands';
      case 'types':
        return 'Product Types';
      default:
        return '';
    }
  };

  const getFormFields = () => {
    switch (activeTab) {
      case 'categories':
        return [
          { key: 'title', label: 'Category Title', required: true }
        ];
      case 'brands':
        return [
          { key: 'name', label: 'Brand Name', required: true }
        ];
      case 'types':
        return [
          { key: 'title', label: 'Type Title', required: true }
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
          <p className="mt-2 text-gray-600">Manage product categories, brands, and types</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 lg:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd />
          Add {getTabTitle().slice(0, -1)}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
            </div>
            <MdCategory className="text-3xl text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Brands</p>
              <p className="text-3xl font-bold text-green-600">{brands.length}</p>
            </div>
            <MdLabel className="text-3xl text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Product Types</p>
              <p className="text-3xl font-bold text-purple-600">{typeProducts.length}</p>
            </div>
            <MdCategory className="text-3xl text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'categories', label: 'Categories' },
              { id: 'brands', label: 'Brands' },
              { id: 'types', label: 'Product Types' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${getTabTitle().toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'brands' ? 'Name' : 'Title'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getCurrentData().map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.title || item.name}
                    </div>
                    {item.description && (
                      <div className="text-sm text-gray-500">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {getCurrentData().length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No {getTabTitle().toLowerCase()} found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? `Edit ${getTabTitle().slice(0, -1)}` : `Add New ${getTabTitle().slice(0, -1)}`}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {getFormFields().map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={field.required}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Optional description..."
                ></textarea>
              </div>

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
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
