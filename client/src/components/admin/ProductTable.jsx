import React, { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const sampleProducts = [
  {
    id: 1,
    name: "Gabriela Cashmere Blazer",
    sku: "SKU-12345",
    price: 120,
    quantity: 24,
    views: 320,
    status: "Active",
    image: "https://placehold.co/40x40/f0f0f0/333?text=IMG"
  },
  // ...add more sample products
];

export default function ProductTable() {
  const [products] = useState(sampleProducts);

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
                <button className="p-1 rounded hover:bg-red-100 text-red-600">
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