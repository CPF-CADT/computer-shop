import mainLogo from "../assets/gear-tech.png";
import { FaSearch } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";
import { Link } from "react-router-dom";
export default function Nav() {
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
      <button className="border-1 border-gray-400 rounded-full w-[150px] h-full text-lg flex flex-row items-center justify-between px-6 ">
        <BsCart2 size={26} />
        <span>My Cart</span>
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
