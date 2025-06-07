import { useState } from "react";
import { Link } from "react-router-dom";
import LaptopFilterSidebar from "./LaptopCompo.jsx/LaptopFilterSidebar";
import LaptopBreadcrumb from "./LaptopCompo.jsx/LaptopBreadcrumb";
import LaptopSortBar from "./LaptopCompo.jsx/LaptopSortBar";
import LaptopBanner from "./LaptopCompo.jsx/LaptopBanner";
import LaptopProductGrid from "./LaptopCompo.jsx/LaptopProductGrid";
import G713PI from "../assets/G713PI.jpg";

// Example product data
const allLaptops = [
  {
    image: G713PI,
    title: "ASUS ROG Strix G17 | G713PI",
    assetName: "AMD R9-7945HX, 64GB DDR5 RAM, 1TB SSD",
    oldPrice: 1499.0,
    newPrice: 1399.0,
    reviews: 4,
    rating: 5,
    size: "17.3",
    price: 1899,
    color: "black",
  },
  {
    image: G713PI,
    title: "ASUS ROG Strix G17 | G713PI",
    assetName: "AMD R9-7945HX, 64GB DDR5 RAM, 1TB SSD",
    oldPrice: 1499.0,
    newPrice: 1399.0,
    reviews: 4,
    rating: 5,
    size: "17.3",
    price: 1899,
    color: "black",
  },
  // ...add more laptops
];

const sizeOptions = [
  { label: "14 inches", value: "14" },
  { label: "15.4 - 17.6 inches", value: "15-17" },
  { label: "18'4 inches", value: "18.4" },
];
const priceOptions = [
  { label: "$0.00 - $1,000.00", min: 0, max: 1000 },
  { label: "$1,000.00 - $2,000.00", min: 1000, max: 2000 },
];
const colorOptions = ["black", "white"];

export default function Laptop() {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  // Filtering logic
  const filteredLaptops = allLaptops.filter((laptop) => {
    const sizeMatch =
      selectedSizes.length === 0 ||
      selectedSizes.some((sz) =>
        sz === "15-17"
          ? parseFloat(laptop.size) >= 15.4 && parseFloat(laptop.size) <= 17.6
          : laptop.size === sz
      );
    const priceMatch =
      selectedPrices.length === 0 ||
      selectedPrices.some(
        (range) =>
          laptop.newPrice >= range.min && laptop.newPrice <= range.max
      );
    const colorMatch =
      selectedColors.length === 0 || selectedColors.includes(laptop.color);

    return sizeMatch && priceMatch && colorMatch;
  });

  // Handlers
  const handleSizeChange = (value) => {
    setSelectedSizes((prev) =>
      prev.includes(value)
        ? prev.filter((sz) => sz !== value)
        : [...prev, value]
    );
  };
  const handlePriceChange = (range) => {
    setSelectedPrices((prev) =>
      prev.some((r) => r.min === range.min && r.max === range.max)
        ? prev.filter((r) => r.min !== range.min || r.max !== range.max)
        : [...prev, range]
    );
  };
  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };
  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedPrices([]);
    setSelectedColors([]);
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <LaptopFilterSidebar
        selectedSizes={selectedSizes}
        selectedPrices={selectedPrices}
        selectedColors={selectedColors}
        handleSizeChange={handleSizeChange}
        handlePriceChange={handlePriceChange}
        handleColorChange={handleColorChange}
        clearFilters={clearFilters}
        sizeOptions={sizeOptions}
        priceOptions={priceOptions}
        colorOptions={colorOptions}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Back Button */}
        <div className="mb-2">
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold"
          >
            &larr; Back
          </Link>
        </div>
        <LaptopBreadcrumb />
        <h1 className="text-2xl font-bold mb-4">Laptops</h1>
        <LaptopSortBar />
        <LaptopBanner />
        <LaptopProductGrid products={filteredLaptops} />
      </div>
    </div>
  );
}