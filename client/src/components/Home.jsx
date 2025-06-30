import Categories from "./Categories";
import Navigate from "./Navigate";
import { OverlayHome, OverlayBrands } from "./Overlay";
import HotProduct from "./Product/HotProduct";
import ServiceProvide from "./Advertise/ServiceProvide";
import BannerGPU from "./Advertise/BannerGPU";
import ProductCard from "./Product/ProductCard";
import ProductSectionGroup from './Product/ProductSectionGroup';

import GPU from '../assets/RTX3080.png';
import Monitor from '../assets/Monitor/Rog Monitor.png';
import Mouse from '../assets/Mouse/Rog Mouse.png';
import Keyboard from '../assets/Keyboard/Keyboard Razer.png';

// Import your mock data
import { homePageLaptops, mockPC, mockLaptop } from "../data/mockData";

export default function Home() {
  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-row gap-x-10 mt-6">
          <Categories />
          <div className="w-full flex flex-col ">
            <Navigate />
            <OverlayHome />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold my-5">All Brands</h2>
          <OverlayBrands />
          <span className="mt-5 mx-auto w-full bg-gray-50 rounded-md my-6 px-6 py-4 flex justify-center">
            we provide all best computer with high quality original from company, cheap cheap, buy 1 free 1 for every PC
          </span>
        </div>
        <div className="flex flex-row gap-10 justify-between">
          <HotProduct brand_model={'NVIDIA GeForce RTX'} type_product={'Graphic Card'} slogan={'Huury Up, Limited time offer only!!'} box_width={610} image={GPU}/>
          <HotProduct brand_model={'ROG 4K OLED'} type_product={'Monitor'} slogan={'Huury Up, Limited time offer only!!'} box_width={300} image={Monitor}/>
          <HotProduct brand_model={'Razer Wire'} type_product={'Mouse'} slogan={'Huury Up, Limited time offer only!!'} box_width={100} image={Mouse}/>
          <HotProduct brand_model={'Razer Wire'} type_product={'Keyboard'} slogan={'Huury Up, Limited time offer only!!'} box_width={100} image={Keyboard}/>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold my-6">New In</h2>
        <div className="flex flex-row gap-9">
          {homePageLaptops.map(product => (
            <ProductCard
              key={product.product_code}
              productId={product.product_code}
              image={product.image_path}
              title={product.name}
              description={product.description}
              oldPrice={parseFloat(product.price.amount)}
              newPrice={
                product.discount && product.discount.type === "Percentage"
                  ? (parseFloat(product.price.amount) * (1 - parseFloat(product.discount.value) / 100)).toFixed(2)
                  : parseFloat(product.price.amount)
              }
              reviews={product.feedback.totalReview}
              rating={parseFloat(product.feedback.rating)}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="w-full bg-gray-50 rounded-md my-6 px-6 py-4 flex justify-center">
          <span className="text-center text-base">
            <span className="font-semibold text-orange-500">own</span> it now, up to 6 months interest free{' '}
            <a href="#" className="text-indigo-900 underline text-sm font-medium">learn more</a>
          </span>
        </div>
      </div>
      <div>
        <BannerGPU />
      </div>

      {/* Low End, High End, Used PC Section */}
      <div className="flex flex-col mt-8">
        <h3 className="font-bold text-lg mb-2">Low End</h3>
        <div className="flex flex-row gap-9">
          {mockPC.slice(0, 3).map(product => (
            <ProductCard
              key={product.product_code}
              productId={product.product_code}
              image={product.image_path}
              title={product.name}
              description={product.description}
              oldPrice={parseFloat(product.price.amount) + 500}
              newPrice={parseFloat(product.price.amount)}
              reviews={product.feedback.totalReview}
              rating={parseFloat(product.feedback.rating)}
            />
          ))}
        </div>
      </div>
      {/* ROG O series Section */}
      <div className="flex flex-col mt-8">
        <h3 className="font-bold text-lg mb-2">ROG O series</h3>
        <div className="relative">
          <div className="flex overflow-x-auto gap-9 pb-2 
            scrollbar-thin scrollbar-thumb-orange-400/60 scrollbar-track-gray-100/20 
            hover:scrollbar-thumb-orange-500/80">
            {mockLaptop.map(product => (
              <div className="flex-none" key={product.product_code}>
                <ProductCard
                  productId={product.product_code}
                  image={product.image_path}
                  title={product.name}
                  description={product.description}
                  oldPrice={parseFloat(product.price.amount) + 500}
                  newPrice={parseFloat(product.price.amount)}
                  reviews={product.feedback.totalReview}
                  rating={parseFloat(product.feedback.rating)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Accessories Section Example */}
      <div className="flex flex-col mt-8">
        <h3 className="font-bold text-lg mb-2">Accessories</h3>
        <div className="flex flex-row gap-9">
          {/* Example static accessories, replace with mock data if available */}
          {[1,2,3,4].map(idx => (
            <ProductCard
              key={idx}
              productId={`accessory-${idx}`}
              image={Keyboard}
              title={"Razer Barracuda X Chrome Wireless Gaming Headset"}
              description={"2.4GHz Wireless & Bluetooth"}
              oldPrice={129.00}
              newPrice={78.00}
              reviews={4}
              rating={4}
            />
          ))}
        </div>
      </div>
      {/* Monitor Section Example */}
      <div className="flex flex-col mt-8">
        <h3 className="font-bold text-lg mb-2">ROG Monitor</h3>
        <div className="flex flex-row gap-9">
          {[1,2,3].map(idx => (
            <ProductCard
              key={idx}
              productId={`monitor-${idx}`}
              image={Monitor}
              title={"EX DISPLAY - ASUS ROG Swift"}
              description={"Gaming Monitors"}
              oldPrice={699.00}
              newPrice={499.00}
              reviews={2}
              rating={5}
            />
          ))}
        </div>
      </div>
        <div className="mt-10">
            <ServiceProvide />
        </div>
    </>
  );
}