import { AiOutlineDownSquare } from "react-icons/ai";
import { FaTelegramPlane, FaFacebook } from "react-icons/fa";

export default function Head() {
  return (
    <header className="w-full bg-[#FFA726] py-2 px-4">
      <div className="flex flex-row flex-wrap justify-between items-center max-w-[1200px] mx-auto h-full font-bold text-white text-xs md:text-sm md:flex-nowrap">
        
        <span className="flex flex-row items-center gap-x-2">
          <span>Mon-Thu: 9:00AM - 5:30PM</span>
          <AiOutlineDownSquare />
        </span>
        
        <span className="hidden md:flex items-center mx-4">
          Visit our showroom in 271 Street Adress Kampucheakrom, 2004
        </span>

        <span className="flex flex-row items-center gap-x-3">
          <span>Call Us: (+855) 0123 456 778</span>
          <span className="flex flex-row gap-x-3">
            <a href="#" aria-label="Telegram" className="hover:text-gray-200"><FaTelegramPlane size={18} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-gray-200"><FaFacebook size={18} /></a>
          </span>
        </span>
      </div>
    </header>
  );
}