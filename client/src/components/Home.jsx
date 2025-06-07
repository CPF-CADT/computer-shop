import Categories from "./Categories"
import Navigate from "./Navigate"
import {OverlayHome,OverlayBrands} from "./Overlay"
import HotProduct from "./Product/HotProduct"
import ServiceProvide from "./Advertise/ServiceProvide"
import BannerGPU from "./Advertise/BannerGPU"
import ProductCard from "./Product/ProductCard"
import PC1 from '../assets/CUSTOM_PC.png'
import PC2 from '../assets/OMEN_PC.png'
import G713PI from '../assets/G713PI.jpg'


export default function Home(){
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
                    <HotProduct brand_model={'NVIDIA GeForce'} type_product={'Graphic Card'} slogan={'Huury Up, Limited time offer only!!'} box_width={620} />
                    <HotProduct brand_model={'NVIDIA GeForce'} type_product={'Graphic Card'} slogan={'Huury Up, Limited time offer only!!'} box_width={300} />
                    <HotProduct brand_model={'NVIDIA GeForce'} type_product={'Graphic Card'} slogan={'Huury Up, Limited time offer only!!'} box_width={200} />
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold my-6">New In</h2>
                <div className="flex flex-row gap-9">
                <ProductCard
                    image={G713PI}
                    title={'ASUS ROG Strix G17 G713PI'}
                    assetName={'AMD R9-7945HX, 64GB DDR5 RAM, 1TB SSD, Windows 11 Home, Free Gaming Headset, Bagpack, and Mouse 3 Years Warranty'}
                    oldPrice={1399.00}
                    newPrice={1299.00}
                    reviews={10}
                    rating={4}
                />
                    <ProductCard
                        image={PC1}
                        title={'Custom Gaming PC'}
                        assetName={'Intel Core i9-13900K, NVIDIA RTX 4090, 64GB DDR5 RAM, 2TB NVMe SSD, 850W PSU, Windows 11 Pro, RGB Case, Liquid Cooling'}
                        oldPrice={2499.00}
                        newPrice={2199.00}
                        reviews={18}
                        rating={5}
                    />      
                    <ProductCard
                        image={PC1}
                        title={'Custom Gaming PC'}
                        assetName={'Intel Core i9-13900K, NVIDIA RTX 4090, 64GB DDR5 RAM, 2TB NVMe SSD, 850W PSU, Windows 11 Pro, RGB Case, Liquid Cooling'}
                        oldPrice={2499.00}
                        newPrice={2199.00}
                        reviews={18}
                        rating={5}
                    />
                    <ProductCard
                        image={PC1}
                        title={'Custom Gaming PC'}
                        assetName={'Intel Core i9-13900K, NVIDIA RTX 4090, 64GB DDR5 RAM, 2TB NVMe SSD, 850W PSU, Windows 11 Pro, RGB Case, Liquid Cooling'}
                        oldPrice={2499.00}
                        newPrice={2199.00}
                        reviews={18}
                        rating={5}
                    />  
                    <ProductCard
                        image={PC2}
                        title={'OMEN 45L Gaming Desktop'}
                        assetName={'Intel Core i7-13700K, NVIDIA RTX 4070 Ti, 32GB DDR5 RAM, 1TB NVMe SSD, 800W PSU, Windows 11 Home, OMEN Cryo Chamber Cooling'}
                        oldPrice={2199.00}
                        newPrice={1899.00}
                        reviews={14}
                        rating={4}
                    />         
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
            <div className="mt-10">
                <ServiceProvide />
            </div>
            </>
    )
}