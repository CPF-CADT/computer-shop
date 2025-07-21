import React, { useState } from 'react';
import mainLogo from "../assets/gear-tech.png";
import { FaSearch } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./cart/CartContext";
import { useAuth } from "./context/AuthContext";
import { useCategory } from "./context/CategoryContext"; // Import useCategory
import toast from 'react-hot-toast'; // Import toast for user feedback

export default function Nav() {
  const { totalItems: itemCount } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  // Ensure brands and typeProducts are initialized to empty arrays if context hasn't provided them yet
  const { brands = [], typeProducts = [], loadingCategories } = useCategory(); 

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) {
      navigate('/search'); // Navigate to search page without params if empty
      return;
    }

    // Add a check here for empty arrays if the context data is critical for search parsing
    if (loadingCategories || brands.length === 0 || typeProducts.length === 0) {
      toast.error("Search data is still loading. Please wait a moment.");
      return;
    }

    const lowerCaseSearchTerm = trimmedSearchTerm.toLowerCase();
    const queryParams = new URLSearchParams();

    // --- Dynamic Smart Search Logic ---
    // Derive keywords from context data, safely checking for 'name' and 'title' existence
    const brandKeywords = brands
        .filter(brand => brand && typeof brand.name === 'string') // Ensure brand and brand.name exist and are strings
        .map(brand => brand.name.toLowerCase())
        .sort((a, b) => b.length - a.length); // Sort longest to shortest for better matching

    const typeProductKeywords = typeProducts
        .filter(type => type && typeof type.title === 'string') // Ensure type and type.title exist and are strings
        .map(type => type.title.toLowerCase())
        .sort((a, b) => b.length - a.length); // Sort longest to shortest for better matching

    let foundBrand = '';
    let foundTypeProduct = '';
    let remainingSearchTerm = lowerCaseSearchTerm;

    // 1. Check for Brand
    for (const keyword of brandKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerCaseSearchTerm)) {
        foundBrand = keyword;
        remainingSearchTerm = remainingSearchTerm.replace(regex, '').trim();
        break; 
      }
    }
    
    // 2. Check for Type Product
    for (const keyword of typeProductKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerCaseSearchTerm)) {
        foundTypeProduct = keyword;
        remainingSearchTerm = remainingSearchTerm.replace(regex, '').trim();
        break;
      }
    }

    // 3. Construct Query Parameters
    if (foundBrand) {
      // Send the canonical name (original casing) from the matched brand object
      const canonicalBrand = brands.find(b => b.name.toLowerCase() === foundBrand)?.name;
      queryParams.set('brand', canonicalBrand || foundBrand); // Fallback to foundBrand if canonical not found (shouldn't happen)
    }
    if (foundTypeProduct) {
      // Send the canonical title (original casing) from the matched type product object
      const canonicalTypeProduct = typeProducts.find(t => t.title.toLowerCase() === foundTypeProduct)?.title;
      queryParams.set('type_product', canonicalTypeProduct || foundTypeProduct); // Fallback to foundTypeProduct
    }
    
    // The 'name' parameter is whatever is left, or the original term if nothing else was extracted
    const finalName = remainingSearchTerm || trimmedSearchTerm;
    if (finalName.trim()) {
        queryParams.set('name', finalName.trim());
    }

    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <nav className="h-14 max-w-[1200px] flex flex-row mx-auto items-center justify-between mt-5">
      <Link to="/">
        <img src={mainLogo} alt="gear-tech" className="h-[50px]" />
      </Link>
      <form onSubmit={handleSearchSubmit} className="flex items-center h-full w-full max-w-md mx-auto bg-white rounded-full shadow-md overflow-hidden border-1 border-gray-400">
        <input
          type="text"
          placeholder="What are you looking for"
          className="w-full px-4 py-2 text-gray-700 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // Disable input if category data is loading
          disabled={loadingCategories}
        />
        <button
          type="submit"
          className="bg-[#FFA726] px-6 py-2 rounded-2xl hover:cursor-pointer mx-5 disabled:opacity-50"
          // Disable button if category data is loading
          disabled={loadingCategories}
        >
          <FaSearch />
        </button>
      </form>

      {isAuthenticated && user ? (
        <>    
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