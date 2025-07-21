import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../service/api';
import { useCategory } from './context/CategoryContext'; // Import useCategory hook

// Import Static Components and Assets
import Categories from "./Categories"; // Assuming this component uses category data
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
import CustomPCPromo from './CustomePC';

// Reusable Carousel Component for horizontal product lists with pagination
const ProductCarousel = ({ title, products, productsPerPage = 4, isLoading, error }) => {
  const scrollContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex flex-col mt-8">
        <h3 className="font-bold text-xl mb-4">{title}</h3>
        <div className="text-center py-10 text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col mt-8">
        <h3 className="font-bold text-xl mb-4">{title}</h3>
        <div className="text-center py-10 text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null; 
  }

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


export default function Home() {
  const [newInProducts, setNewInProducts] = useState([]);
  const [lowEndPCs, setLowEndPCs] = useState([]);
  const [rogLaptops, setRogLaptops] = useState([]);

  // Loading states for each carousel's data
  const [loadingNewIn, setLoadingNewIn] = useState(true);
  const [errorNewIn, setErrorNewIn] = useState(null);

  const [loadingLowEnd, setLoadingLowEnd] = useState(true);
  const [errorLowEnd, setErrorLowEnd] = useState(null);

  const [loadingRog, setLoadingRog] = useState(true);
  const [errorRog, setErrorRog] = useState(null);

  // useCategory handles its own loading and error internally for the Categories component
  const { loadingCategories, categoryError } = useCategory();


  useEffect(() => {
    const fetchNewInProducts = async () => {
      try {
        setLoadingNewIn(true);
        setErrorNewIn(null);
        const response = await apiService.getProducts({ limit: 12, sort: 'desc', order_column: 'product_code' });
        setNewInProducts(response.data);
      } catch (err) {
        setErrorNewIn('Failed to load new in products.');
        console.error(err);
      } finally {
        setLoadingNewIn(false);
      }
    };
    fetchNewInProducts();
  }, []);

  useEffect(() => {
    const fetchLowEndPCs = async () => {
      try {
        setLoadingLowEnd(true);
        setErrorLowEnd(null);
        const response = await apiService.getProducts({ limit: 12, type_product: 'VGA', sort: 'asc', order_column: 'price' });
        setLowEndPCs(response.data);
      } catch (err) {
        setErrorLowEnd('Failed to load budget-friendly PCs.');
        console.error(err);
      } finally {
        setLoadingLowEnd(false);
      }
    };
    fetchLowEndPCs();
  }, []);

  useEffect(() => {
    const fetchRogLaptops = async () => {
      try {
        setLoadingRog(true);
        setErrorRog(null);
        const response = await apiService.getProducts({ limit: 12, brand: 'ASUS', sort: 'asc', type_product: 'Labtop' });
        setRogLaptops(response.data);
      } catch (err) {
        setErrorRog('Failed to load ROG series laptops.');
        console.error(err);
      } finally {
        setLoadingRog(false);
      }
    };
    fetchRogLaptops();
  }, []);


  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-row gap-x-10 mt-6">
        {/* Categories component will handle its own loading, potentially via useCategory context */}
        <Categories />
        <div className="w-full flex flex-col gap-y-5 ">
          <Navigate />
          <OverlayHome />
        </div>
      </div>
      <div className="flex flex-col mb-5">
        <h2 className="text-2xl font-bold my-5">All Brands</h2>
        <OverlayBrands />
      </div>
      <div className="flex flex-row gap-10 justify-between">
        <HotProduct brand_model={'NVIDIA GeForce RTX'} type_product={'Graphic Card'} slogan={'Hurry Up, Limited time offer!'} box_width={610} image={GPU}/>
        <HotProduct brand_model={'ROG 4K OLED'} type_product={'Monitor'} slogan={'Hurry Up, Limited time offer!'} box_width={300} image={Monitor}/>
        <HotProduct brand_model={'Razer Wireless'} type_product={'Mouse'} slogan={'Hurry Up, Limited time offer!'} box_width={100} image={Mouse}/>
        <HotProduct brand_model={'Razer Wireless'} type_product={'Keyboard'} slogan={'Hurry Up, Limited time offer!'} box_width={100} image={Keyboard}/>
      </div>
      <div>
        <CustomPCPromo />
      </div>
      {/* Pass loading and error states to ProductCarousel */}
      <ProductCarousel
        title="New In"
        products={newInProducts}
        isLoading={loadingNewIn}
        error={errorNewIn}
      />

      <ProductCarousel
        title="Budget-Friendly Gaming PCs"
        products={lowEndPCs}
        isLoading={loadingLowEnd}
        error={errorLowEnd}
      />

      <div className="mt-8"><BannerGPU /></div>
      <ProductCarousel
        title="ROG Series Laptops"
        products={rogLaptops}
        isLoading={loadingRog}
        error={errorRog}
      />
      <div className="mt-10"><ServiceProvide /></div>
    </div>
  );
}