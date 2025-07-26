import { Link } from 'react-router-dom';

export default function ProductBreadcrumb({ product }) {

  let categoryLink = '/laptop';
  let categoryLabel = 'Laptops';
  if (product?.category?.title) {
    if (
      product.category.title.toLowerCase().includes('desktop') ||
      product.category.title.toLowerCase().includes('custom')
    ) {
      categoryLink = '/custom-pc';
      categoryLabel = 'Custom PC / Desktop Building';
    } else if (product.category.title.toLowerCase().includes('laptop')) {
      categoryLink = '/laptop';
      categoryLabel = 'Laptops';
    } else {
      categoryLink = '/';
      categoryLabel = product.category.title;
    }
  }

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
          <Link
            to={categoryLink}
            className="text-gray-500 hover:text-orange-500"
          >
            {categoryLabel}
          </Link>
        </li>
        <li className="text-gray-400 px-2">›</li>
        <li className="text-gray-700">{product.name}</li>
      </ol>
    </nav>
  );
}