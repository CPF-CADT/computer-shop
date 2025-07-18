// src/components/Product/ProductCarousel.jsx

import React, { useRef } from 'react';
import ProductCard from './ProductCard'; // Make sure this path is correct
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductCarousel = ({ title, products }) => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) {
    return null; // Don't render anything if there are no products
  }

  return (
    <div className="flex flex-col mt-8">
      <h3 className="font-bold text-xl mb-4">{title}</h3>
      <div className="relative">
        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide" // scrollbar-hide is a common utility
        >
          {products.map(product => (
            <div className="flex-none w-72" key={product.product_code}>
              <ProductCard
                // Pass props correctly to the card
                productId={product.product_code}
                image_path={product.image_path}
                name={product.name}
                price={product.price}
                feedback={product.feedback}
                discount={product.discount}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => handleScroll(-300)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-md transition z-10"
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => handleScroll(300)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-md transition z-10"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;