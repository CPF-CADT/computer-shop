import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiService } from '../service/api';
import ProductCard from "./Product/ProductCard";
import Pagination from './Pagination';
import { useCategory } from './context/CategoryContext';

export default function CategoryProductPage() {
  const { categoryName: sluggedCategoryName } = useParams();
  const { categories } = useCategory();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const originalCategoryName = categories.find(
    (cat) => cat.title.toLowerCase().replace(/\s+/g, '-') === sluggedCategoryName
  )?.title;

  useEffect(() => {
    if (!originalCategoryName) {
      return;
    }

    const fetchProductsByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedData = await apiService.getProducts({
          category: originalCategoryName,
          limit: 20,
          page: currentPage,
          sort: 'asc',
        });
        
        setProducts(fetchedData.data || []);
        setTotalPages(fetchedData.meta?.totalPages || 0); 

      } catch (err) {
        setError(`Failed to load products for ${originalCategoryName}. Please try again later.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [originalCategoryName, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sluggedCategoryName]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && products.length === 0) return <div className="text-center py-20 text-xl font-semibold">Loading {originalCategoryName || sluggedCategoryName}s...</div>;
  if (error) return <div className="text-center py-20 text-xl font-semibold text-red-500">{error}</div>;
  if (!loading && products.length === 0) return <div className="text-center py-20 text-xl font-semibold">No {originalCategoryName || sluggedCategoryName}s found.</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold"
        >
          &larr; Back to Home
        </Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{originalCategoryName || sluggedCategoryName}</h1>
      
      {loading && <div className="text-center py-10 text-gray-500">Updating...</div>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard
            key={product.product_code}
            product={product}
          />
        ))}
      </div>

\      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}