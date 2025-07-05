import { MdDashboard, MdShoppingCart, MdPeople, MdMessage, MdInventory, MdExtension, MdInsights, MdReceipt, MdLocalOffer } from 'react-icons/md';
import mainLogo from "../../assets/gear-tech.png";

const navItems = [
  { icon: <MdDashboard />, label: 'Dashboard' },
  { icon: <MdShoppingCart />, label: 'Orders' },
  { icon: <MdPeople />, label: 'Customers' },
  { icon: <MdMessage />, label: 'Messages' },
  { icon: <MdInventory />, label: 'Products' }, // No longer hardcoded as active
  { icon: <MdExtension />, label: 'Integrations' },
  { icon: <MdInsights />, label: 'Analytics' },
  { icon: <MdReceipt />, label: 'Invoice' },
  { icon: <MdLocalOffer />, label: 'Discount' },
  { icon: <MdDashboard />, label: 'User Management' },
];

// Receive activePage and setActivePage as props
export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 bg-[#FFA726] text-white h-screen sticky top-0 flex flex-col">
      <div className="flex items-center gap-2 text-2xl font-bold p-6 bg-white">
        <img src={mainLogo} alt="Logo" className="w-45 rounded" />
      </div>
      <nav className="flex-1 mt-4 space-y-1">
        {navItems.map((item, idx) => (
          <div
            key={idx}
            // Add onClick handler to update the state in the parent component
            onClick={() => setActivePage(item.label)}
            className={`flex items-center px-6 py-3 cursor-pointer rounded-lg transition
              {/* Compare item label with the activePage state to set the active class */}
              ${item.label === activePage ? "bg-orange-500 text-white" : "hover:bg-orange-400"}
            `}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}