import { useState } from "react";
import { Link } from "react-router-dom";
import { mockLaptop } from "../data/mockData";
import ProductCard from "./Product/ProductCard";
import LaptopFilterSidebar from "./LaptopCompo.jsx/LaptopFilterSidebar";
import LaptopBreadcrumb from "./LaptopCompo.jsx/LaptopBreadcrumb";
import LaptopSortBar from "./LaptopCompo.jsx/LaptopSortBar";
import LaptopBanner from "./LaptopCompo.jsx/LaptopBanner";
import LaptopProductGrid from "./LaptopCompo.jsx/LaptopProductGrid";

export default function Laptop() {
  const [filteredProducts, setFilteredProducts] = useState(mockLaptop);

  const handleFilterChange = ({ sizes, prices, colors }) => {
    let filtered = mockLaptop;

    // Filter by size
    if (sizes.length > 0) {
      filtered = filtered.filter((product) => {
        const screenSize = product.description.match(/(\d+\.?\d*)['"]/) || [];
        return sizes.some((size) => {
          const sizeValue = size.replace("inch", "");
          return screenSize[1] === sizeValue;
        });
      });
    }

    // Filter by price
    if (prices.length > 0) {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price.amount);
        return prices.some(
          (range) => price >= range.min && price <= range.max
        );
      });
    }

    // Filter by color
    if (colors.length > 0) {
      filtered = filtered.filter((product) =>
        colors.some((color) =>
          product.description.toLowerCase().includes(color.toLowerCase())
        )
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="flex gap-8">
      <LaptopFilterSidebar onFilterChange={handleFilterChange} />
      <div className="flex-1">
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
        <LaptopProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}