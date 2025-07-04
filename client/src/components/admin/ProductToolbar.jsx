export default function ProductToolbar({onAddProductClick}) {
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
      <button
        onClick={onAddProductClick}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Add Product
      </button>
    </div>
  );
}   