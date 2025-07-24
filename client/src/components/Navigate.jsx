import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; 

export default function Navigate() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMobileMenu = () => setIsOpen(false);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Service', path: '/service' },
    { title: 'Promotion', path: '/promotion' },
    { title: 'About Us', path: '/about-us' },
  ];

  return (
    <nav className="relative flex items-center justify-between h-14">
      <ul className="hidden md:flex flex-row items-center gap-x-10 font-bold text-lg text-gray-700">
        {navLinks.map((link) => (
          <li key={link.title} className="hover:text-[#FFA726] transition-colors duration-200">
            <Link to={link.path}>{link.title}</Link>
          </li>
        ))}
      </ul>

      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FFA726] p-2 rounded-md"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      {isOpen && (
        <ul
          className="
            md:hidden flex flex-col items-center absolute top-full left-0 w-full 
            bg-white shadow-lg rounded-b-lg py-4 z-20
          "
        >
          {navLinks.map((link) => (
            <li key={link.title} className="w-full text-center py-3">
              <Link
                to={link.path}
                onClick={closeMobileMenu} // Close menu on link click
                className="font-bold text-gray-700 hover:text-[#FFA726] transition-colors duration-200"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}