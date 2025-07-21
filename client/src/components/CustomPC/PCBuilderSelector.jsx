import React, { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons here

export default function PCBuilderSelector({
  items,
  title,
  selectedId,
  onSelect,
}) {
  const scrollContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0); // Internal page for carousel
  
  // Define how many products to show per "page" in the carousel
  // This should match your grid layout (e.g., 4 items for lg:grid-cols-4)
  const productsPerCarouselPage = 4; 

  // Calculate total pages for the internal carousel
  const totalCarouselPages = items && items.length > 0
    ? Math.ceil(items.length / productsPerCarouselPage)
    : 0;

  // Calculate which products to display on the current carousel page
  const startIndex = currentPage * productsPerCarouselPage;
  const endIndex = startIndex + productsPerCarouselPage;
  const displayedItems = items.slice(startIndex, endIndex);

  const handleNextCarouselPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalCarouselPages); // Loop back to start
    // If you want it to stop at the end, use:
    // setCurrentPage((prevPage) => Math.min(prevPage + 1, totalCarouselPages - 1));
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' }); // Scroll back to start of container
    }
  };

  const handlePrevCarouselPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalCarouselPages) % totalCarouselPages); // Loop back to end
    // If you want it to stop at the beginning, use:
    // setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' }); // Scroll back to start of container
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 relative"> {/* Added relative for arrow positioning */}
      <h2 className="font-semibold text-xl mb-4 text-gray-800">{title}</h2>

      <div className="relative"> {/* New div to contain the items grid and arrows */}
        <div
          ref={scrollContainerRef} // Assign ref to the scrollable container
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-hidden" // Use overflow-x-hidden as we control scrolling with buttons
        >
          {displayedItems.length === 0 ? (
            <div className="col-span-full text-gray-500 text-center py-4">No {title} products found.</div>
          ) : (
            displayedItems.map((item) => (
              <button
                key={item.id}
                className={`border rounded-lg p-3 flex flex-col items-center justify-between text-left hover:border-orange-400 transition-all duration-200
                  ${selectedId === item.id
                    ? "border-orange-500 ring-2 ring-orange-300"
                    : "border-gray-200"
                  }`}
                onClick={() => onSelect(item.id)}
                type="button"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-contain mb-2"
                />
                <div className="font-medium text-base text-gray-900 text-center line-clamp-2">{item.name}</div>
                <div className="text-sm text-gray-700 mt-1">${Number(item.price).toFixed(2)}</div>
              </button>
            ))
          )}
        </div>

        {/* Carousel Navigation Buttons */}
        {totalCarouselPages > 1 && (
          <>
            <button
              onClick={handlePrevCarouselPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-300 hover:bg-orange-500 p-2 rounded-full shadow-md transition z-10 opacity-75 hover:opacity-100"
              aria-label="Previous Products"
            >
              <FaChevronLeft className="text-white" />
            </button>
            <button
              onClick={handleNextCarouselPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-300 hover:bg-orange-500 p-2 rounded-full shadow-md transition z-10 opacity-75 hover:opacity-100"
              aria-label="Next Products"
            >
              <FaChevronRight className="text-white" />
            </button>
          </>
        )}
      </div> {/* End of new div for items grid and arrows */}

      {selectedId && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm">
          **Selected:** {items.find((i) => i.id === selectedId)?.name}
        </div>
      )}
    </div>
  );
}