import { MdDashboard, MdShoppingCart, MdPeople, MdInventory, MdInsights, MdPayment, MdLocalOffer, MdCategory, MdWarehouse, MdSettings, MdMenu, MdClose, MdBackup, MdSupervisorAccount } from 'react-icons/md';
import { useState } from 'react';
import mainLogo from "../../assets/gear-tech.png";

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
  { icon: <MdSettings />, label: 'User Management' },
  { icon: <MdBackup />, label: 'Database Restore' },
];

// Receive activePage and setActivePage as props
export default function Sidebar({ activePage, setActivePage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (itemLabel) => {
    setActivePage(itemLabel);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#FFA726] text-white min-h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2 text-2xl font-bold p-6 bg-white flex-shrink-0">
          <img src={mainLogo} alt="Logo" className="w-45 rounded" />
        </div>

        {/* Navigation */}
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

        {/* Footer */}
        <div className="p-4 border-t border-orange-400 flex-shrink-0 mt-auto">
          <div className="text-xs text-orange-100 text-center">
            Computer Shop Admin v1.0
          </div>
        </div>
      </aside>
    </>
  );
}