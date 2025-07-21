import { useState } from 'react';
import Categories from "../Categories";

const defaultSizeOptions = [
  { value: 'mini', label: 'Mini Tower' },
  { value: 'mid', label: 'Mid Tower' },
  { value: 'full', label: 'Full Tower' }
];

const defaultPriceOptions = [
  { min: 0, max: 1000, label: 'Under $1,000' },
  { min: 1000, max: 2000, label: '$1,000 - $2,000' },
  { min: 2000, max: 3000, label: '$2,000 - $3,000' },
  { min: 3000, max: Infinity, label: 'Over $3,000' }
];

const defaultCaseTypeOptions = [
  { value: 'glass', label: 'Glass Case' },
  { value: 'normal', label: 'Normal Case' }
];

const defaultBrandOptions = [
  'ASUS', 'MSI', 'Acer', 'Dell', 'HP', 'Lenovo', 'Custom'
];

export default function DesktopFilterSidebar({ onFilterChange }) {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedCaseTypes, setSelectedCaseTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [customDesktopOnly, setCustomDesktopOnly] = useState(false);

  const handleSizeChange = (value) => {
    const newSizes = selectedSizes.includes(value)
      ? selectedSizes.filter(v => v !== value)
      : [...selectedSizes, value];
    setSelectedSizes(newSizes);
    triggerFilterChange({ sizes: newSizes });
  };

  const handlePriceChange = (range) => {
    const newPrices = selectedPrices.some(p => p.min === range.min && p.max === range.max)
      ? selectedPrices.filter(p => p.min !== range.min || p.max !== range.max)
      : [...selectedPrices, range];
    setSelectedPrices(newPrices);
    triggerFilterChange({ prices: newPrices });
  };

  const handleCaseTypeChange = (value) => {
    const newTypes = selectedCaseTypes.includes(value)
      ? selectedCaseTypes.filter(t => t !== value)
      : [...selectedCaseTypes, value];
    setSelectedCaseTypes(newTypes);
    triggerFilterChange({ caseTypes: newTypes });
  };

  const handleBrandChange = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    triggerFilterChange({ brands: newBrands });
  };

  const handleCustomDesktopChange = () => {
    const newValue = !customDesktopOnly;
    setCustomDesktopOnly(newValue);
    triggerFilterChange({ customDesktopOnly: newValue });
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedPrices([]);
    setSelectedCaseTypes([]);
    setSelectedBrands([]);
    setCustomDesktopOnly(false);
    onFilterChange({
      sizes: [],
      prices: [],
      caseTypes: [],
      brands: [],
      customDesktopOnly: false
    });
  };

  const triggerFilterChange = (changed = {}) => {
    onFilterChange({
      sizes: changed.sizes !== undefined ? changed.sizes : selectedSizes,
      prices: changed.prices !== undefined ? changed.prices : selectedPrices,
      caseTypes: changed.caseTypes !== undefined ? changed.caseTypes : selectedCaseTypes,
      brands: changed.brands !== undefined ? changed.brands : selectedBrands,
      customDesktopOnly: changed.customDesktopOnly !== undefined ? changed.customDesktopOnly : customDesktopOnly
    });
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
          <div className="font-semibold mb-1">Case Size</div>
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
          <div className="font-semibold mb-1">Case Type</div>
          {defaultCaseTypeOptions.map((opt) => (
            <label key={opt.value} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedCaseTypes.includes(opt.value)}
                onChange={() => handleCaseTypeChange(opt.value)}
                className="mr-2"
              />
              {opt.label}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Brand</div>
          {defaultBrandOptions.map((brand) => (
            <label key={brand} className="flex items-center text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="mr-2"
              />
              {brand}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={customDesktopOnly}
              onChange={handleCustomDesktopChange}
              className="mr-2"
            />
            Custom Desktop Only
          </label>
        </div>
      </div>
    </div>
  );
}
