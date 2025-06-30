import { MdDashboard, MdShoppingCart, MdPeople, MdMessage, MdInventory, MdExtension, MdInsights, MdReceipt, MdLocalOffer } from 'react-icons/md';

const navItems = [
  { icon: <MdDashboard />, label: 'Dashboard' },
  { icon: <MdShoppingCart />, label: 'Orders' },
  { icon: <MdPeople />, label: 'Customers' },
  { icon: <MdMessage />, label: 'Messages' },
  { icon: <MdInventory />, label: 'Products', active: true },
  { icon: <MdExtension />, label: 'Integrations' },
  { icon: <MdInsights />, label: 'Analytics' },
  { icon: <MdReceipt />, label: 'Invoice' },
  { icon: <MdLocalOffer />, label: 'Discount' },
  { icon: <MdDashboard />, label: 'Management' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#FFA726] text-white h-screen fixed flex flex-col">
      <div className="flex items-center gap-2 text-2xl font-bold p-6">
        <img src="https://i.pinimg.com/736x/d0/7d/fd/d07dfd02a7fac11e78349ba96dc557a5.jpg" alt="Logo" className="w-8 h-8 rounded" />
        <span>Shodai</span>
      </div>
      <nav className="flex-1 mt-4 space-y-1">
        {navItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center px-6 py-3 cursor-pointer rounded-lg transition
              ${item.active ? "bg-orange-500 text-white" : "hover:bg-orange-400"}
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