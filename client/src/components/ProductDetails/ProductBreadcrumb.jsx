import { Link } from 'react-router-dom';

export default function ProductBreadcrumb({ product }) {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-gray-500 hover:text-orange-500">
            Home
          </Link>
        </li>
        <li className="text-gray-400 px-2">›</li>
        <li>
          <Link to="/laptop" className="text-gray-500 hover:text-orange-500">
            Laptops
          </Link>
        </li>
        <li className="text-gray-400 px-2">›</li>
        <li className="text-gray-700">
          {product.name}
        </li>
      </ol>
    </nav>
  );
}