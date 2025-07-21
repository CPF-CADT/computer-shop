import mainLogo from "../assets/gear-tech.png";
import { FaSearch } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./cart/CartContext";
import { useAuth } from "./context/AuthContext";

export default function Nav() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth(); 

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

      {isAuthenticated && user ? (
        <>     
        {
          console.log(user)
        }
          <button
            className="border border-gray-200 rounded-full w-[150px] h-full text-lg flex flex-row items-center justify-center px-6 relative"
            onClick={() => navigate('/cart')}
          >
            <BsCart2 size={26} />
            <span className="ml-3">My Cart</span>

            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <div className="flex items-center space-x-3 ml-7">
            <Link to={`/user/profile/${user.id}`} className="flex items-center space-x-2">
              <img
                src={user.profile_img_path || 'https://res.cloudinary.com/dokut37k6/image/upload/v1752849581/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651_zppdms.svg'}
                alt={user.name || 'User Profile'}
                className="h-10 w-10 rounded-full object-cover border border-gray-300"
              />
              <span className="font-medium text-gray-700 hidden sm:block">
                {user.name || 'User'}
              </span>
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="border flex flex-row justify-between items-center px-3 border-gray-400 rounded-full w-[180px] h-full text-lg ml-7 text-center">
          <Link to={'/register'} className="hover:font-bold">
            Register
          </Link>
          |
          <Link to={'/login'} className="hover:font-bold">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}