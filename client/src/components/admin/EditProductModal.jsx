import React, { useState, useEffect } from 'react';
import { apiService } from '../../service/api'; // Adjust this import path if needed

export default function EditProductModal({ isOpen, onClose, onSave, productCode, categories, brands, types }) {
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && productCode) {
            const fetchProduct = async () => {
                setIsLoading(true);
                setError('');
                try {
                    const productData = await apiService.getOneProduct(productCode);
                    setFormData({
                        ...productData,
                        category: productData.category?.id || '',
                        brand: productData.brand?.id || '',
                        type: productData.type?.id || '',
                        price:productData.price.amount
                    });
                } catch (err) {
                    setError('Failed to load product data.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProduct();
        }
    }, [isOpen, productCode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(productCode, formData);
    };

    if (!isOpen) {
        return null;
    }

    return (
        /* ## THIS IS THE CHANGE ## */
        /* This div creates the semi-transparent dark background. */
        <div className="fixed inset-0 z-40 flex justify-center items-center">
            
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-xl m-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
                        <p className="text-sm text-gray-500">Product Code: {productCode}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>

                {isLoading && <p className="p-6 text-center">Loading product details...</p>}
                {error && <p className="p-6 text-center text-red-500">{error}</p>}
                
                {!isLoading && formData && (
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
                                <input type="text" name="name" id="edit-name" value={formData.name || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label htmlFor="edit-price" className="block text-sm font-medium text-gray-600 mb-1">Price ($)</label>
                                <input type="number" name="price" id="edit-price" value={formData.price || 0} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" step="0.01" required />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                <textarea name="description" id="edit-description" value={formData.description || ''} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                            </div>
                            <div>
                                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                                <select name="category" id="edit-category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="edit-brand" className="block text-sm font-medium text-gray-600 mb-1">Brand</label>
                                <select name="brand" id="edit-brand" value={formData.brand} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                    <option value="">Select Brand</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="edit-type" className="block text-sm font-medium text-gray-600 mb-1">Product Type</label>
                                <select name="type" id="edit-type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                   <option value="">Select Type</option>
                                   {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none">
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}