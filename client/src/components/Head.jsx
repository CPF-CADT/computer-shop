import { AiOutlineDownSquare } from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import mainLogo from "../assets/gear-tech.png"
export default function Head(){
    return (
        <header className="h-8 w-full bg-[#FFA726] ">
            <div className="flex flex-row justify-between max-w-[1200px] mx-auto my-auto h-full font-bold text-[#ffff] ">
                <span className="flex flex-row items-center">
                    Mon-Thu: 9:00AM - 5:30PM 
                    <AiOutlineDownSquare /> 
                </span>
                <span className="flex items-center"> Visit our showroom in 271 Street Adress Kampucheakrom, 2004 </span>
                <span className="flex flex-row items-center">
                    <span>
                        Call Us: (+855) 0123 456 778 
                    </span>
                    <span className="flex flex-row gap-x-3 ml-3" >
                        <FaTelegramPlane />
                        <FaFacebook />
                    </span>
                </span>
            </div>
        </header>
    )
}