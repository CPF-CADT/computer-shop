import { Link } from "react-router-dom";

export default function LaptopBreadcrumb() {
  return (
    <div className="text-sm text-gray-500 mb-2">
      <Link to="/" className="hover:underline text-gray-500">
        Home
      </Link>{" "}
      &gt; <span className="text-black font-semibold">Laptops</span>
    </div>
  );
}