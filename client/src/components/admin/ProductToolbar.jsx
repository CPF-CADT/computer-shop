export default function ProductToolbar({
  filters = {}, 
  onFilterChange,
  onApplyFilters,
  onAddProductClick,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 p-4 bg-white rounded-lg shadow">
      <div className="flex flex-wrap items-center gap-3">
        {/* This line will no longer cause an error */}
        <input
          type="text"
          name="name"
          placeholder="Search by name..."
          value={filters.name || ""} 
          onChange={handleInputChange}
          className="px-3 py-2 rounded-md border border-gray-300 w-full md:w-auto"
        />
        <select
          name="sort"
          value={filters.sort || "asc"}
          onChange={handleInputChange}
          className="px-3 py-2 rounded-md border border-gray-300"
        >
          <option value="asc">Sort: A-Z</option>
          <option value="desc">Sort: Z-A</option>
        </select>
        <button
          onClick={onApplyFilters}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 font-medium"
        >
          Apply Filters
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