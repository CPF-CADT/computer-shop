import { Link, useLocation } from "react-router-dom";

export default function LaptopBreadcrumb() {
  const location = useLocation();
  const isCustomPC = location.pathname === "/custom-pc";
  return (
    <div className="text-sm text-gray-500 mb-2">
      <Link to="/" className="hover:underline text-gray-500">
        Home
      </Link>{" "}
      &gt; <span className="text-black font-semibold">
        {isCustomPC ? "Custom PC / Desktop Building" : "Laptops"}
      </span>
    </div>
  );
}