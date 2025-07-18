import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../service/api';

// Import Static Components and Assets
import Categories from "./Categories";
import Navigate from "./Navigate";
import { OverlayHome, OverlayBrands } from "./Overlay";
import ProductCard from "./Product/ProductCard";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import HotProduct from "./Product/HotProduct";
import ServiceProvide from "./Advertise/ServiceProvide";
import BannerGPU from "./Advertise/BannerGPU";
import GPU from '../assets/RTX3080.png';
import Monitor from '../assets/Monitor/Rog Monitor.png';
import Mouse from '../assets/Mouse/Rog Mouse.png';
import Keyboard from '../assets/Keyboard/Keyboard Razer.png';


// Reusable Carousel Component for horizontal product lists with pagination
const ProductCarousel = ({ title, products, productsPerPage = 4 }) => {
  const scrollContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col mt-8">
      <h3 className="font-bold text-xl mb-4">{title}</h3>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-hidden gap-8 pb-4 scrollbar-hide" 
        >
          {displayedProducts.map(product => {
            const originalPrice = parseFloat(product.price.amount);
            let discountedPrice = originalPrice;
            if (product.discount && product.discount.type === 'Percentage') {
              discountedPrice = originalPrice * (1 - parseFloat(product.discount.value) / 100);
            }
            return (
              <div className="flex-none w-1/4" key={product.product_code}> 
                <ProductCard
                  productId={product.product_code}
                  image={product.image_path}
                  title={product.name}
                  description={product.description}
                  oldPrice={originalPrice.toFixed(2)}
                  newPrice={discountedPrice.toFixed(2)}
                  reviews={product.feedback.totalReview}
                  rating={parseFloat(product.feedback.rating)}
                  imgClassName="w-full h-48 object-contain"
                />
              </div>
            )
          })}
        </div>
        {totalPages > 1 && ( // Only show buttons if there's more than one page
          <>
            <button onClick={handlePrevPage} className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-300 hover:bg-orange-500 p-3 rounded-full shadow-md transition z-10 opacity-75 hover:opacity-100" aria-label="Scroll left"><FaChevronLeft /></button>
            <button onClick={handleNextPage} className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-300 hover:bg-orange-500 p-3 rounded-full shadow-md transition z-10 opacity-75 hover:opacity-100" aria-label="Scroll right"><FaChevronRight /></button>
          </>
        )}
      </div>
    </div>
  );
};


// Main Home Page Component
export default function Home() {
  const [newInProducts, setNewInProducts] = useState([]);
  const [lowEndPCs, setLowEndPCs] = useState([]);
  const [rogLaptops, setRogLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Increased limits to allow for pagination within carousels
        const [newInResponse, lowEndResponse, rogResponse] = await Promise.all([
          apiService.getProducts({ limit: 12, sort: 'desc', order_column: 'product_code' }), // Fetch more for pagination
          apiService.getProducts({ limit: 12, type_product: 'VGA', sort: 'asc', order_column: 'price' }), // Fetch more for pagination
          apiService.getProducts({ limit: 12, brand: 'ASUS', sort: 'asc', type_product: 'Labtop' }) // Fetch more for pagination
        ]);
        setNewInProducts(newInResponse.data);
        setLowEndPCs(lowEndResponse.data);
        setRogLaptops(rogResponse.data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading awesome gear...</div>;
  if (error) return <div className="text-center py-20 text-xl font-semibold text-red-500">{error}</div>;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-row gap-x-10 mt-6"><Categories /><div className="w-full flex flex-col "><Navigate /><OverlayHome /></div></div>
      <div className="flex flex-col"><h2 className="text-2xl font-bold my-5">All Brands</h2><OverlayBrands /></div>
      <div className="flex flex-row gap-10 justify-between">
        <HotProduct brand_model={'NVIDIA GeForce RTX'} type_product={'Graphic Card'} slogan={'Hurry Up, Limited time offer!'} box_width={610} image={GPU}/>
        <HotProduct brand_model={'ROG 4K OLED'} type_product={'Monitor'} slogan={'Hurry Up, Limited time offer!'} box_width={300} image={Monitor}/>
        <HotProduct brand_model={'Razer Wireless'} type_product={'Mouse'} slogan={'Hurry Up, Limited time offer!'} box_width={100} image={Mouse}/>
        <HotProduct brand_model={'Razer Wireless'} type_product={'Keyboard'} slogan={'Hurry Up, Limited time offer!'} box_width={100} image={Keyboard}/>
      </div>

      <ProductCarousel title="New In" products={newInProducts} />
      
      <ProductCarousel title="Budget-Friendly Gaming PCs" products={lowEndPCs} />
      
      <div className="mt-8"><BannerGPU /></div>
      <ProductCarousel title="ROG Series Laptops" products={rogLaptops} />
      <div className="mt-10"><ServiceProvide /></div>
    </div>
  );
}