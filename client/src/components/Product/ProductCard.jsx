// src/components/Product/ProductCard.jsx

import React from 'react';
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  if (!product) {
    return null;
  }

  const brandName = typeof product.brand === 'object' && product.brand !== null
    ? product.brand.name
    : product.brand;

  const originalPrice = parseFloat(product.price?.amount || 0);
  let discountedPrice = originalPrice;
  if (product.discount?.type && product.discount?.value) {
    discountedPrice = originalPrice * (1 - parseFloat(product.discount.value) / 100);
  }

  const handleClick = (e) => {
    e.preventDefault();
    if (product.product_code) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate(`/product/${product.product_code}/detail`);
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer h-full">
      <div className="rounded-md p-3 md:p-5 w-full h-full bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="flex justify-center items-center mb-2">
            <img
              src={product.image_path}
              alt={product.name}
              className="w-full h-40 md:h-48 object-contain"
            />
          </div>
          
          <p className="text-xs text-gray-500 font-medium mb-1 uppercase">{brandName || 'Generic Brand'}</p>
          
          <div className="font-semibold text-gray-800 text-sm break-words mb-2">
            {product.name}
          </div>

          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < (product.feedback?.rating || 0) ? "text-yellow-400" : "text-gray-300"}
                size={16}
              />
            ))}
            <span className="ml-2 text-gray-500 text-xs md:text-sm">
              ({product.feedback?.totalReview || 0})
            </span>
          </div>
        </div>

        <div>
          {originalPrice > discountedPrice && (
            <div className="text-gray-400 line-through text-sm">
              ${originalPrice.toFixed(2)}
            </div>
          )}
          <div className="text-xl md:text-2xl font-bold text-black">
            ${discountedPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}