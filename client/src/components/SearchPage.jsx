import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { apiService } from '../service/api';
import ProductCard from "./Product/ProductCard"; 
import Pagination from './Pagination'; 
export default function SearchPage() {
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayTitle, setDisplayTitle] = useState("Search Results");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const params = new URLSearchParams(location.search);
      const searchTerms = {
        name: params.get('name') || '',
        brand: params.get('brand') || '',
        type_product: params.get('type_product') || '',
      };
      
      if (!searchTerms.name && !searchTerms.brand && !searchTerms.type_product) {
        setProducts([]);
        setDisplayTitle("Enter a search term");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);

      const titleParts = Object.values(searchTerms).filter(Boolean);
      setDisplayTitle(`Search Results for: ${titleParts.join(' ')}`);

      try {
        const response = await apiService.getProducts({
          ...searchTerms,
          limit: 20, 
          page: currentPage,
        });
        
        setProducts(response.data || []);
        setTotalPages(response.meta?.totalPages || 0);

      } catch (err) {
        setError("Failed to load search results. Please try again.");
        console.error("Search API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.search, currentPage]); 

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [location.search]);

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <div className="mb-4">
        <Link to="/" className="inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold">
          &larr; Back to Home
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">{displayTitle}</h1>

      {loading ? (
        <div className="text-center py-20 text-xl font-semibold">Loading...</div>
      ) : error ? (
        <div className="text-center py-20 text-xl font-semibold text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-xl text-gray-600">No products found matching your search.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard product={product} key={product.product_code} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}