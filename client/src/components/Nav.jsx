import React, { useState } from 'react';
import mainLogo from "../assets/gear-tech.png";
import { FaSearch } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./cart/CartContext";
import { useAuth } from "./context/AuthContext";
import { useCategory } from "./context/CategoryContext";
import toast from 'react-hot-toast';

export default function Nav() {
  const { totalItems: itemCount } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { brands = [], typeProducts = [], loadingCategories } = useCategory();
  const [searchTerm, setSearchTerm] = useState('');

  // Your handleSearchSubmit function remains the same...
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) {
      navigate('/search');
      return;
    }
    // ... all the smart search logic is unchanged.
    const lowerCaseSearchTerm = trimmedSearchTerm.toLowerCase();
    const queryParams = new URLSearchParams();
    const brandKeywords = brands.filter(b => b && typeof b.name === 'string').map(b => b.name.toLowerCase()).sort((a,b) => b.length - a.length);
    const typeProductKeywords = typeProducts.filter(t => t && typeof t.title === 'string').map(t => t.title.toLowerCase()).sort((a,b) => b.length - a.length);
    let foundBrand = '';
    let foundTypeProduct = '';
    let remainingSearchTerm = lowerCaseSearchTerm;
    for (const keyword of brandKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerCaseSearchTerm)) {
        foundBrand = keyword;
        remainingSearchTerm = remainingSearchTerm.replace(regex, '').trim();
        break; 
      }
    }
    for (const keyword of typeProductKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerCaseSearchTerm)) {
        foundTypeProduct = keyword;
        remainingSearchTerm = remainingSearchTerm.replace(regex, '').trim();
        break;
      }
    }
    if (foundBrand) {
      const canonicalBrand = brands.find(b => b.name.toLowerCase() === foundBrand)?.name;
      queryParams.set('brand', canonicalBrand || foundBrand);
    }
    if (foundTypeProduct) {
      const canonicalTypeProduct = typeProducts.find(t => t.title.toLowerCase() === foundTypeProduct)?.title;
      queryParams.set('type_product', canonicalTypeProduct || foundTypeProduct);
    }
    const finalName = remainingSearchTerm || trimmedSearchTerm;
    if (finalName.trim()) {
      queryParams.set('name', finalName.trim());
    }
    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <nav className="max-w-[1200px] flex flex-row flex-wrap items-center justify-between mx-auto py-3 px-4 gap-y-4">
      
      <Link to="/" className="shrink-0 hidden md:block">
        <img src={mainLogo} alt="gear-tech" className="h-[40px] md:h-[50px]" />
      </Link>

     
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center h-12 w-full max-w-lg bg-white rounded-full shadow-md overflow-hidden border border-gray-300 order-last lg:order-none lg:mx-4 mt-6 md:mt-0"
      >
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full h-full px-4 text-gray-700 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loadingCategories}
        />
        <button
          type="submit"
          className="bg-[#FFA726] h-full px-5 text-white hover:bg-orange-500 disabled:opacity-50"
          disabled={loadingCategories}
        >
          <FaSearch />
        </button>
      </form>
      
      <div className="hidden md:flex items-center gap-x-2 md:gap-x-4">
        {isAuthenticated && user ? (
          <>
            <button
              className="border border-gray-200 rounded-full h-12 flex items-center justify-center p-3 relative hover:bg-gray-100"
              onClick={() => navigate('/cart')}
              aria-label="My Cart"
            >
              <BsCart2 size={24} />
              
              <span className="ml-2 hidden md:inline">My Cart</span>

              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-x-2">
              <Link to={`/user/profile/${user.id}`} className="flex items-center" aria-label="User Profile">
                <img
                  src={user.profile_img_path || 'https://res.cloudinary.com/dokut37k6/image/upload/v1752849581/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651_zppdms.svg'}
                  alt={user.name || 'User Profile'}
                  className="h-10 w-10 rounded-full object-cover border border-gray-300"
                />
                <p>
                  {user.name}
                </p>
              </Link>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="hidden">
            
            <div className="flex items-center justify-center border border-gray-400 rounded-full h-12 px-4 text-sm md:text-base gap-x-2">
              <Link to={'/register'} className="hover:font-bold whitespace-nowrap">
                Register
              </Link>
              <span className="text-gray-300">|</span>
              <Link to={'/login'} className="hover:font-bold whitespace-nowrap">
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}