import { useState } from 'react';
import Categories from "../Categories";

const defaultSizeOptions = [
  { value: '13inch', label: '13"' },
  { value: '14inch', label: '14"' },
  { value: '15inch', label: '15.6"' },
  { value: '17inch', label: '17.3"' }
];

const defaultPriceOptions = [
  { min: 0, max: 1000, label: 'Under $1,000' },
  { min: 1000, max: 2000, label: '$1,000 - $2,000' },
  { min: 2000, max: 3000, label: '$2,000 - $3,000' },
  { min: 3000, max: Infinity, label: 'Over $3,000' }
];

const defaultColorOptions = ['Black', 'Silver', 'White'];

export default function LaptopFilterSidebar({ onFilterChange }) {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const handleSizeChange = (value) => {
    const newSizes = selectedSizes.includes(value) 
      ? selectedSizes.filter(v => v !== value)
      : [...selectedSizes, value];
    setSelectedSizes(newSizes);
    onFilterChange({ sizes: newSizes, prices: selectedPrices, colors: selectedColors });
  };

  const handlePriceChange = (range) => {
    const newPrices = selectedPrices.some(p => p.min === range.min && p.max === range.max)
      ? selectedPrices.filter(p => p.min !== range.min || p.max !== range.max)
      : [...selectedPrices, range];
    setSelectedPrices(newPrices);
    onFilterChange({ sizes: selectedSizes, prices: newPrices, colors: selectedColors });
  };

  const handleColorChange = (color) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    setSelectedColors(newColors);
    onFilterChange({ sizes: selectedSizes, prices: selectedPrices, colors: newColors });
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedPrices([]);
    setSelectedColors([]);
    onFilterChange({ sizes: [], prices: [], colors: [] });
  };

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
          <div className="font-semibold mb-1">Screen Size</div>
          {defaultSizeOptions.map((opt) => (
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
          <div className="font-semibold mb-1">Price Range</div>
          {defaultPriceOptions.map((opt) => (
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
          {defaultColorOptions.map((color) => (
            <label key={color} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedColors.includes(color)}
                onChange={() => handleColorChange(color)}
                className="mr-2"
              />
              <span
                className={`inline-block w-4 h-4 rounded-full mr-2 ${
                  color.toLowerCase() === "black" ? "bg-black" : "bg-white border"
                }`}
              ></span>
              {color}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}