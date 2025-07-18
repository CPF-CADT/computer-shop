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
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "newest", label: "Newest" },
];

export default function Peripherals() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("mouse");
  const [sort, setSort] = useState("newest");

  // Filter and sort products
  let products = mockPeripherals.filter(p => p.type === selectedCategory);
  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  if (sort === "newest") products = [...products].sort((a, b) => b.year - a.year);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <button
              onClick={() => navigate("/")}
              className="hover:text-orange-500 underline"
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
        className="mb-6 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold"
      >
        &larr; Back to Home
      </button>
      <h1 className="text-3xl font-bold text-[#FFA726] mb-8">Peripherals</h1>
      {/* Filter & Sort */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-lg font-semibold border transition ${
                selectedCategory === cat.key
                  ? "bg-[#FFA726] text-white border-[#FFA726]"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-orange-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="ml-auto px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {sortOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>
      {/* New In */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">New In</h2>
        <div className="flex flex-row gap-6">
          {mockPeripherals
            .filter(p => p.type === selectedCategory && p.isNew)
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
      {/* Category Banner & Products */}
      {categories.map(cat => (
        <div key={cat.key} className="mb-12">
          <img
            src={cat.banner}
            alt={`${cat.label} Banner`}
            className="w-full h-40 object-cover rounded-xl mb-6 shadow"
          />
          <h2 className="text-xl font-bold mb-4">{cat.label}</h2>
          <div className="flex flex-row gap-6 flex-wrap">
            {mockPeripherals.filter(p => p.type === cat.key).length > 0 ? (
              mockPeripherals
                .filter(p => p.type === cat.key)
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
                ))
            ) : (
              <div className="w-full text-center text-gray-400 py-12 text-lg font-semibold">
                Product not found.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
