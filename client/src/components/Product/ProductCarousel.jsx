import { useRef } from 'react';
import ProductCard from './ProductCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ProductCarousel({ title, products, isLoading, error }) {
  const scrollContainerRef = useRef(null);
  if (isLoading) {
    return <div className="text-center py-10 text-lg">Loading {title}...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-lg text-red-500">{error}</div>;
  }
  
  if (!products || products.length === 0) {
    return null;
  }

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
        const { scrollLeft, clientWidth } = scrollContainerRef.current;
        const scrollAmount = clientWidth * 0.8;
        const newScrollPosition = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
        scrollContainerRef.current.scrollTo({ left: newScrollPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col mt-8">
      <h3 className="font-bold text-lg md:text-xl mb-4">{title}</h3>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
        >
          {products.map((product) => (
            <div
              className="flex-none w-[80%] sm:w-1/2 md:w-1/3 lg:w-1/4"
              key={product.product_code}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="hidden md:block">
          <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-300 hover:bg-orange-500 p-3 rounded-full shadow-md z-10">
            <FaChevronLeft />
          </button>
          <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-300 hover:bg-orange-500 p-3 rounded-full shadow-md z-10">
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}