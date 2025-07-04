import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// The component now receives `products` and an `onDelete` function as props
export default function ProductTable({ products, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-3"><input type="checkbox" /></th>
            <th className="p-3 text-left">Product Name</th>
            <th className="p-3 text-left">Purchase Unit Price</th>
            <th className="p-3 text-left">Products</th>
            <th className="p-3 text-left">Views</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id} className="border-b hover:bg-gray-50">
              <td className="p-3"><input type="checkbox" /></td>
              <td className="p-3 flex items-center gap-3">
                <img src={prod.image} alt="" className="w-10 h-10 rounded" />
                <div>
                  <div className="font-medium">{prod.name}</div>
                  <div className="text-xs text-gray-400">{prod.sku}</div>
                </div>
              </td>
              <td className="p-3">${prod.price}</td>
              <td className="p-3">{prod.quantity}</td>
              <td className="p-3">{prod.views}</td>
              <td className="p-3">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>{prod.status}</span>
                </span>
              </td>
              <td className="p-3 flex gap-2">
                <button className="p-1 rounded hover:bg-purple-100 text-purple-700">
                  <FiEdit2 />
                </button>
                {/* The delete button now calls the onDelete function passed via props */}
                <button
                  onClick={() => onDelete(prod.id)}
                  className="p-1 rounded hover:bg-red-100 text-red-600"
                >
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