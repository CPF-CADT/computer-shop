import {
  MdDashboard,
  MdShoppingCart,
  MdPeople,
  MdInventory,
  MdInsights,
  MdPayment,
  MdLocalOffer,
  MdCategory,
  MdWarehouse,
  MdSettings,
  MdMenu,
  MdClose,
  MdBackup,
  MdSupervisorAccount,
  MdLogout,
} from 'react-icons/md';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mainLogo from "../../assets/gear-tech.png";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ activePage, setActivePage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Add logout function
  const navigate = useNavigate();

  const handleNavClick = (itemLabel) => {
    setActivePage(itemLabel);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();            // Clear user session
    navigate("/login");  // Redirect to login or home
  };

  const isAdmin = user?.role === 'admin';

  const navItems = [
    { icon: <MdDashboard />, label: 'Dashboard' },
    { icon: <MdShoppingCart />, label: 'Orders' },
    { icon: <MdInventory />, label: 'Products' },
    { icon: <MdCategory />, label: 'Categories' },
    { icon: <MdWarehouse />, label: 'Inventory' },
    { icon: <MdPeople />, label: 'Customers' },
    { icon: <MdPayment />, label: 'Payments' },
    { icon: <MdLocalOffer />, label: 'Promotions' },
    { icon: <MdInsights />, label: 'Analytics' },
    { icon: <MdSupervisorAccount />, label: 'Staff Management' },
    ...(isAdmin ? [
      { icon: <MdSettings />, label: 'User Management' },
      { icon: <MdBackup />, label: 'Database Restore' },
    ] : []),
  ];

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#FFA726] text-white min-h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        max-w-full
      `}>
        <Link to={'/'}>
          <div className="flex items-center gap-2 text-2xl font-bold p-6 bg-white flex-shrink-0">
            <img src={mainLogo} alt="Logo" className="w-full rounded" />
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 mt-4 space-y-1 overflow-y-auto scrollbar-hide min-h-0">
          {navItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleNavClick(item.label)}
              className={`flex items-center px-6 py-3 cursor-pointer rounded-lg transition mx-2
                ${item.label === activePage 
                  ? "bg-white-500 text-white shadow-lg" 
                  : "hover:bg-white hover:text-orange-600 hover:shadow-md"
                }
              `}
            >
              <span className="text-lg mr-3 flex-shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-6 py-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            <MdLogout size={20} />
            Logout
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 text-xs text-orange-100 text-center">
          Computer Shop Admin v1.0
        </div>
      </aside>
    </>
  );
}
