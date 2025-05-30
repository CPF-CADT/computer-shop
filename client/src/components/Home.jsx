import Categories from "./Categories"
import Navigate from "./Navigate"
import {OverlayHome,OverlayBrands} from "./Overlay"
import HotProduct from "./Product/HotProduct"
import ServiceProvide from "./Advertise/ServiceProvide"
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
                    <span className="mt-5 mx-auto">
                        we provide all best computer with high quality original from company, cheap cheap, buy 1 free 1 for every PC
                    </span>
                </div>
                <div className="flex flex-row gap-10 justify-between">
                    <HotProduct brand_model={'NVIDIA GeForce'} type_product={'Graphic Card'} slogan={'Huury Up, Limited time offer only!!'} box_width={620} />
                    <HotProduct brand_model={'NVIDIA GeForce'} type_product={'Graphic Card'} slogan={'Huury Up, Limited time offer only!!'} box_width={300} />
                    <HotProduct brand_model={'NVIDIA GeForce'} type_product={'Graphic Card'} slogan={'Huury Up, Limited time offer only!!'} box_width={200} />
                </div>
            </div>
            <div className="mt-10">
                <ServiceProvide />
            </div>
            </>
    )
}