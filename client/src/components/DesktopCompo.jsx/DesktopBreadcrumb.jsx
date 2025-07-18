import { Link } from "react-router-dom";

export default function DesktopBreadcrumb() {
  return (
    <div className="text-sm text-gray-500 mb-2">
      <Link to="/" className="hover:underline text-gray-500">
        Home
      </Link>{" "}
      &gt;{" "}
      <span className="text-black font-semibold">
        Custom PC / Desktop Building
      </span>
    </div>
  );
}
