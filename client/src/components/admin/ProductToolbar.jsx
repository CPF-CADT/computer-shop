import React from "react";

export default function ProductToolbar() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <div className="flex gap-2">

        <select className="px-3 py-2 rounded-md border border-gray-300">
          <option>Show: All Products</option>
        </select>
        <select className="px-3 py-2 rounded-md border border-gray-300">
          <option>Sort by: Default</option>
        </select>
        <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 font-medium">
          Filter
        </button>
      </div>
      <button className="px-6 py-2 rounded-md bg-[#FFA726] text-white font-semibold hover:bg-purple-800 transition">
        + Add Product
      </button>
    </div>
  );
}