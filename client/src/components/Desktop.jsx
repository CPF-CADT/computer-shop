import { useState } from "react";
import { Link } from "react-router-dom";
import { mockPC } from "../data/mockData";
import DesktopFilterSidebar from "./DesktopCompo.jsx/DesktopFilterSidebar";
import DesktopBreadcrumb from "./DesktopCompo.jsx/DesktopBreadcrumb";
import LaptopSortBar from "./LaptopCompo.jsx/LaptopSortBar";
import LaptopBanner from "./LaptopCompo.jsx/LaptopBanner";
import LaptopProductGrid from "./LaptopCompo.jsx/LaptopProductGrid";
import LaptopLatestProducts from "./LaptopCompo.jsx/LaptopLatestProducts";

export default function Desktop() {
  const [filteredProducts, setFilteredProducts] = useState(mockPC);

  const handleFilterChange = ({
    sizes = [],
    prices = [],
    caseTypes = [],
    brands = [],
    customDesktopOnly = false,
  }) => {
    let filtered = mockPC;

    // Filter by case size (assume product.caseSize exists)
    if (sizes.length > 0) {
      filtered = filtered.filter((product) =>
        sizes.some((size) =>
          (product.caseSize || "").toLowerCase().includes(size)
        )
      );
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

    // Filter by case type (assume product.caseType exists, e.g. 'glass' or 'normal')
    if (caseTypes && caseTypes.length > 0) {
      filtered = filtered.filter((product) =>
        caseTypes.some((type) =>
          (product.caseType || "").toLowerCase().includes(type)
        )
      );
    }

    // Filter by brand (assume product.brand exists)
    if (brands && brands.length > 0) {
      filtered = filtered.filter((product) =>
        brands.some((brand) =>
          (product.brand || "").toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Filter by custom desktop (assume product.isCustomDesktop is boolean)
    if (customDesktopOnly) {
      filtered = filtered.filter((product) => product.isCustomDesktop === true);
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="flex gap-8">
      <div className="flex flex-col gap-4">
        <DesktopFilterSidebar onFilterChange={handleFilterChange} />
        <LaptopLatestProducts />
      </div>
      <div className="flex-1">
        <div className="mb-2">
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold"
          >
            &larr; Back
          </Link>
        </div>
        <DesktopBreadcrumb />
        <h1 className="text-2xl font-bold mb-4">Desktops</h1>
        <LaptopSortBar />
        <LaptopBanner />
        <LaptopProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}