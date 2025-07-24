import React, { useState, useEffect } from "react";
import { apiService } from "../service/api";
import { FaChevronDown } from "react-icons/fa"; // Import the icon for the accordion

// Import other components...
import Categories from "./Categories";
import Navigate from "./Navigate";
import { OverlayHome, OverlayBrands } from "./Overlay";
import HotProduct from "./Product/HotProduct";
import ServiceProvide from "./Advertise/ServiceProvide";
import BannerGPU from "./Advertise/BannerGPU";
import GPU from "../assets/RTX3080.png";
import Monitor from "../assets/Monitor/Rog Monitor.png";
import Mouse from "../assets/Mouse/Rog Mouse.png";
import Keyboard from "../assets/Keyboard/Keyboard Razer.png";
import CustomPCPromo from "./CustomePC";
import ProductCarousel from "./Product/ProductCarousel";

export default function Home() {
  // --- State for the mobile categories accordion ---
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  // Your existing state and useEffect hooks remain the same
  const [newInProducts, setNewInProducts] = useState([]);
  const [lowEndPCs, setLowEndPCs] = useState([]);
  const [rogLaptops, setRogLaptops] = useState([]);
  const [loadingNewIn, setLoadingNewIn] = useState(true);
  const [errorNewIn, setErrorNewIn] = useState(null);
  const [loadingLowEnd, setLoadingLowEnd] = useState(true);
  const [errorLowEnd, setErrorLowEnd] = useState(null);
  const [loadingRog, setLoadingRog] = useState(true);
  const [errorRog, setErrorRog] = useState(null);

  useEffect(() => {
    // ... your data fetching logic remains the same
    const fetchNewInProducts = async () => {
      try {
        setLoadingNewIn(true);
        const response = await apiService.getProducts({ limit: 12, sort: "desc", order_column: "product_code" });
        setNewInProducts(response.data || []);
      } catch (err) {
        setErrorNewIn("Failed to load new in products.");
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
        const response = await apiService.getProducts({ limit: 12, type_product: "VGA", sort: "asc", order_column: "price" });
        setLowEndPCs(response.data || []);
      } catch (err) {
        setErrorLowEnd("Failed to load budget-friendly PCs.");
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
        const response = await apiService.getProducts({ limit: 12, brand: "ASUS", sort: "asc", type_product: "Labtop" });
        setRogLaptops(response.data || []);
      } catch (err) {
        setErrorRog("Failed to load ROG series laptops.");
      } finally {
        setLoadingRog(false);
      }
    };
    fetchRogLaptops();
  }, []);

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-x-10 mt-6">
          {/* --- CATEGORIES SECTION (NOW RESPONSIVE) --- */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            {/* 1. Accordion Header (Visible only on mobile) */}
            <div
              className="bg-gray-100 p-3 rounded-md flex justify-between items-center cursor-pointer md:hidden"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              <h3 className="font-bold text-lg">Categories</h3>
              <FaChevronDown
                className={`transform transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`}
              />
            </div>

            {/* 2. Categories List */}
            {/* On mobile, visibility is controlled by state. On desktop, it's always visible. */}
            <div className={`mt-2 ${isCategoriesOpen ? 'block' : 'hidden'} md:block`}>
              <Categories />
            </div>
          </div>

          <div className="w-full md:w-3/4 flex flex-col gap-y-5">
            <Navigate />
            <OverlayHome />
          </div>
        </div>

        {/* ... The rest of your Home component remains the same ... */}
        <div className="flex flex-col mb-5">
          <h2 className="text-xl md:text-2xl font-bold my-5">All Brands</h2>
          <OverlayBrands />
        </div>
        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-5 justify-between">
          <HotProduct brand_model={"NVIDIA GeForce RTX"} type_product={"Graphic Card"} slogan={"Hurry Up, Limited time offer!"} image={GPU}/>
          <HotProduct brand_model={"ROG 4K OLED"} type_product={"Monitor"} slogan={"Hurry Up, Limited time offer!"} image={Monitor}/>
          <HotProduct brand_model={"Razer Wireless"} type_product={"Mouse"} slogan={"Hurry Up, Limited time offer!"} image={Mouse}/>
          <HotProduct brand_model={"Razer Wireless"} type_product={"Keyboard"} slogan={"Hurry Up, Limited time offer!"} image={Keyboard}/>
        </div>
        <div>
          <CustomPCPromo />
        </div>

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
        <div className="mt-8">
          <BannerGPU />
        </div>
        <ProductCarousel
          title="ROG Series Laptops"
          products={rogLaptops}
          isLoading={loadingRog}
          error={errorRog}
        />
      </div>
      <div className="mt-10">
        <ServiceProvide />
      </div>
    </>
  );
}