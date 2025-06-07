import Categories from "../Categories";

export default function LaptopFilterSidebar({
  selectedSizes, selectedPrices, selectedColors,
  handleSizeChange, handlePriceChange, handleColorChange, clearFilters,
  sizeOptions, priceOptions, colorOptions
}) {
  return (
    <div className="w-64">
      <Categories />
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <div className="font-bold mb-2">Filters</div>
        <button
          className="bg-[#FFA726] text-white px-3 py-1 rounded mb-4"
          onClick={clearFilters}
        >
          Clear Filter
        </button>
        <div className="mb-4">
          <div className="font-semibold mb-1">Category</div>
          {sizeOptions.map((opt) => (
            <label key={opt.value} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedSizes.includes(opt.value)}
                onChange={() => handleSizeChange(opt.value)}
                className="mr-2"
              />
              {opt.label}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Price</div>
          {priceOptions.map((opt) => (
            <label key={opt.label} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedPrices.some(
                  (r) => r.min === opt.min && r.max === opt.max
                )}
                onChange={() => handlePriceChange(opt)}
                className="mr-2"
              />
              {opt.label}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Color</div>
          {colorOptions.map((color) => (
            <label key={color} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedColors.includes(color)}
                onChange={() => handleColorChange(color)}
                className="mr-2"
              />
              <span
                className={`inline-block w-4 h-4 rounded-full mr-2 ${
                  color === "black" ? "bg-black" : "bg-white border"
                }`}
              ></span>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}