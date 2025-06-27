import mainLogo from "../assets/gear-tech.png";
import { FaSearch } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./cart/CartContext"; // <-- import useCart

export default function Nav() {
  const navigate = useNavigate();
  const { itemCount } = useCart(); // <-- get itemCount from cart

  return (
    <nav className="h-14 max-w-[1200px] flex flex-row mx-auto items-center justify-between mt-5">
      <img src={mainLogo} alt="gear-tech" className="h-[50px]" />
      <form className="flex items-center h-full w-full max-w-md mx-auto bg-white rounded-full shadow-md overflow-hidden border-1 border-gray-400">
        <input
          type="text"
          placeholder="What are you looking for"
          className="w-full px-4 py-2 text-gray-700 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#FFA726] px-6 py-2 rounded-2xl hover:cursor-pointer mx-5"
        >
          <FaSearch />
        </button>
      </form>
      <button
        className="relative border-1 border-gray-400 rounded-full w-[150px] h-full text-lg flex flex-row items-center justify-between px-6"
        onClick={() => navigate('/cart')}
      >
        <BsCart2 size={26} />
        <span>My Cart</span>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
            {itemCount}
          </span>
        )}
      </button>
      <div className="border-1 flex felx-row justify-between items-center px-3  border-gray-400 rounded-full w-[180px] h-full text-lg ml-7 text-center">
        <Link to={'/register'} className="hover:font-bold"> 
          Register
        </Link>
         | 
        <Link to={'login'} className="hover:font-bold" >
          Login
        </Link>
      </div>
    </nav>
  );
}
import mainLogo from "../assets/gear-tech.png";
import { FaSearch } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./cart/CartContext"; // <-- import useCart

export default function Nav() {
  const navigate = useNavigate();
  const { itemCount } = useCart(); // <-- get itemCount from cart

  return (
    <nav className="h-14 max-w-[1200px] flex flex-row mx-auto items-center justify-between mt-5">
      <img src={mainLogo} alt="gear-tech" className="h-[50px]" />
      <form className="flex items-center h-full w-full max-w-md mx-auto bg-white rounded-full shadow-md overflow-hidden border-1 border-gray-400">
        <input
          type="text"
          placeholder="What are you looking for"
          className="w-full px-4 py-2 text-gray-700 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#FFA726] px-6 py-2 rounded-2xl hover:cursor-pointer mx-5"
        >
          <FaSearch />
        </button>
      </form>
      <button
        className="relative border-1 border-gray-400 rounded-full w-[150px] h-full text-lg flex flex-row items-center justify-between px-6"
        onClick={() => navigate('/cart')}
      >
        <BsCart2 size={26} />
        <span>My Cart</span>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
            {itemCount}
          </span>
        )}
      </button>
      <div className="border-1 flex felx-row justify-between items-center px-3  border-gray-400 rounded-full w-[180px] h-full text-lg ml-7 text-center">
        <Link to={'/register'} className="hover:font-bold"> 
          Register
        </Link>
         | 
        <Link to={'login'} className="hover:font-bold" >
          Login
        </Link>
      </div>
    </nav>
  );
}
