import { useCategory } from './context/CategoryContext';
import { useNavigate } from 'react-router-dom';

export default function Categories() {
  const { categories, loadingCategories, categoryError } = useCategory();
  const navigate = useNavigate(); 

  const handleCategoryClick = (categoryTitle) => {
    const slug = categoryTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${slug}`);
  };

  if (loadingCategories) {
    return <div className="text-center text-gray-500">Loading categories...</div>;
  }

  if (categoryError) {
    return <div className="text-center text-red-500">Error loading categories: {categoryError}</div>;
  }

  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Product Categories</h3>
      <ul className="space-y-2">
        {categories.map(category => (
          <li
            key={category.id}
            className="text-gray-700 hover:text-orange-500 cursor-pointer"
            onClick={() => handleCategoryClick(category.title)}
          >
            {category.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
