import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function ProductTable({ products = [], onDelete, onEdit }) {
    if (products.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No products found matching your criteria.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-x-auto w-full">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-gray-100 text-gray-700">
                        <th className="p-3"><input type="checkbox" /></th>
                        <th className="p-3 text-left">Product Name</th>
                        <th className="p-3 text-left">Purchase Unit Price</th>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod) => (
                        <tr key={prod.product_code} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                                <input type="checkbox" />
                            </td>
                            <td className="p-3 flex items-center gap-3">
                                <img src={prod.image_path} alt={prod.name} className="w-10 h-10 rounded object-cover" />
                                <div>
                                    <div className="font-medium">{prod.name}</div>
                                    <div className="text-xs text-gray-400">Code: {prod.product_code}</div>
                                </div>
                            </td>
                            <td className="p-3">
                                ${prod.price?.amount?.toFixed(2) ?? 'N/A'} {prod.price?.currency}
                            </td>
                            <td className="p-3">{prod.category?.title}</td>
                            <td className="p-3">{prod.type?.title}</td>
                            <td className="p-3">
                                <span className="inline-flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${prod.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                    <span>{prod.feedback?.rating} ⭐ ({prod.feedback?.totalReview} reviews)</span>
                                </span>
                            </td>
                            <td className="p-3 flex items-center gap-2">
                                <button onClick={() => onEdit(prod.product_code)} className="p-1 rounded hover:bg-purple-100 text-purple-700" aria-label={`Edit ${prod.name}`}>
                                    <FiEdit2 />
                                </button>
                                <button onClick={() => onDelete(prod.product_code)} className="p-1 rounded hover:bg-red-100 text-red-600" aria-label={`Delete ${prod.name}`}>
                                    <FiTrash2 />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}