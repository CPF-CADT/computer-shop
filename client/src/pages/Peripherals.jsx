import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPeripherals } from "../data/mockData";
import ProductCard from "../components/Product/ProductCard";

const categories = [
  { key: "mouse", label: "Mouse", banner: "/assets/Mouse/mouse-banner.png" },
  { key: "keyboard", label: "Keyboard", banner: "/assets/Keyboard/keyboard-banner.png" },
  { key: "headset", label: "Headset", banner: "/assets/Headset/headset-banner.png" },
  { key: "network", label: "Network", banner: "/assets/Network/network-banner.png" },
];

const sortOptions = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Highest Rated" },
];

export default function Peripherals() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("mouse");
  const [sort, setSort] = useState("newest");

  // Filter and sort products
  let products = mockPeripherals.filter(p => p.type === selectedCategory);
  
  // Apply sorting based on selected option
  if (sort === "price-asc") {
    products = [...products].sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      return priceA - priceB;
    });
  } else if (sort === "price-desc") {
    products = [...products].sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      return priceB - priceA;
    });
  } else if (sort === "newest") {
    products = [...products].sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return yearB - yearA;
    });
  } else if (sort === "rating") {
    products = [...products].sort((a, b) => {
      const ratingA = parseFloat(a.rating) || 0;
      const ratingB = parseFloat(b.rating) || 0;
      return ratingB - ratingA;
    });
  }

  // Debug logging to check if sorting is working
  console.log("Current sort:", sort);
  console.log("Products after sorting:", products.map(p => ({ name: p.name, price: p.price, year: p.year, rating: p.rating })));

  const currentCategory = categories.find(cat => cat.key === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:text-orange-500 underline transition-colors duration-200"
              >
                Home
              </button>
            </li>
            <li className="text-gray-400 px-2">›</li>
            <li className="text-gray-700 font-semibold">Peripherals</li>
          </ol>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 sm:mb-6 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-semibold border border-gray-200 transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <span className="text-lg">←</span>
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>

        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFA726] mb-2">
            Peripherals
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover the latest gaming and productivity peripherals
          </p>
        </div>

        {/* Filter & Sort Section */}
        <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 lg:hidden">Categories</h3>
              <div className="grid grid-cols-2 sm:flex gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold border transition-all duration-200 text-sm sm:text-base ${
                      selectedCategory === cat.key
                        ? "bg-[#FFA726] text-white border-[#FFA726] shadow-md transform scale-105"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:ml-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2 lg:hidden">
                Sort by
              </label>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="w-full lg:w-auto px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white text-sm sm:text-base min-w-[200px] transition-all duration-200"
              >
                {sortOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* New In Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">New In</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {currentCategory.label}
            </span>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {mockPeripherals
              .filter(p => p.type === selectedCategory && p.isNew)
              .slice(0, 5)
              .map(product => (
                <ProductCard
                  key={product.product_code}
                  productId={product.product_code}
                  image={product.image_path}
                  title={product.name}
                  description={product.description}
                  oldPrice={product.oldPrice || product.price}
                  newPrice={product.price}
                  reviews={product.reviews}
                  rating={product.rating}
                />
              ))}
          </div>
        </div>

        {/* Selected Category Banner & Products */}
        <div className="mb-8 sm:mb-12">
          {/* Category Banner */}
          <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
            <img
              src={currentCategory.banner}
              alt={`${currentCategory.label} Banner`}
              className="w-full h-32 sm:h-40 lg:h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                {currentCategory.label}
              </h2>
              <p className="text-white/90 text-sm sm:text-base mt-1">
                {products.length} products available
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard
                  key={product.product_code}
                  productId={product.product_code}
                  image={product.image_path}
                  title={product.name}
                  description={product.description}
                  oldPrice={product.oldPrice || product.price}
                  newPrice={product.price}
                  reviews={product.reviews}
                  rating={product.rating}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16 sm:py-20">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  Try selecting a different category or check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
