import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from 'react-router-dom';

const categories = [
  { name: "Laptop", path: "/laptop" },
  { name: "Desktop", path: "/desktop" },
  { name: "PC Components", path: "/components" },
  { name: "Peripherals", path: "/peripherals" },
  { name: "Networking", path: "/networking" },
  { name: "Monitors", path: "/monitors" },
];

export default function Categories() {
  return (
    <div className="w-64 border rounded-2xl border-[#FFA726] pb-4">
      <div className="h-14 flex items-center gap-2 bg-[#FFA726] px-6 rounded-t-2xl">
        <GiHamburgerMenu size={26} />
        <span className="font-semibold text-2xl">Categories</span>
      </div>
      <ul className="mt-2 space-y-1 px-6">
        {categories.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className='hover:font-bold'>
                {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}