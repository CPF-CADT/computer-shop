// src/components/SearchPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom"; // Use useLocation to get query params
import { apiService } from '../service/api';
import ProductCard from "./Product/ProductCard"; // Assuming ProductCard is in this path
import { useCategory } from './context/CategoryContext'; // Assuming useCategory is in this path

export default function SearchPage() {
  const location = useLocation(); // Hook to access URL's location object
  const { brands, typeProducts, loadingCategories, categoryError } = useCategory(); // Use for intelligent matching
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({ name: '', brand: '', type_product: '' });
  const [displayTitle, setDisplayTitle] = useState("Search Results");

  // Function to parse URL query parameters
  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return {
      name: params.get('name') || '',
      brand: params.get('brand') || '',
      type_product: params.get('type_product') || '',
    };
  }, [location.search]);

  // Effect to update searchParams when URL changes
  useEffect(() => {
    const newParams = getQueryParams();
    setSearchParams(newParams);
  }, [getQueryParams]);

  // Effect to fetch products based on searchParams
  useEffect(() => {
    const fetchSearchResults = async () => {
      // Wait for categories/types/brands to load for smart matching if needed
      if (loadingCategories) return;

      setLoading(true);
      setError(null);
      setProducts([]); // Clear previous results

      const { name, brand, type_product } = searchParams;
      const queryParams = {};
      let titleParts = [];

      // Smartly add parameters to API call
      // The canonical lookup already happens in Nav, so 'brand' and 'type_product' here
      // should already be in the correct casing if they were matched by Nav.
      // If not, they are passed as raw values.
      
      if (name) {
        queryParams.name = name;
        titleParts.push(`"${name}"`);
      }

      if (brand) {
        queryParams.brand = brand; // Use the brand string directly from URL (which Nav prepared)
        titleParts.push(brand);
      }

      if (type_product) {
        queryParams.type_product = type_product; // Use the type_product string directly from URL (which Nav prepared)
        titleParts.push(type_product);
      }

      // If no search parameters, display a message
      if (!name && !brand && !type_product) {
        setError("Please enter a search term.");
        setLoading(false);
        setDisplayTitle("No Search Term Entered");
        return;
      }

      setDisplayTitle(titleParts.length > 0 ? `Search Results for ${titleParts.join(' ')}` : "Search Results");

      try {
        const response = await apiService.getProducts({
          ...queryParams,
          limit: 50, // Fetch a reasonable limit for search results
          sort: 'asc',
          order_column: 'name',
        });
        setProducts(response.data || []);
      } catch (err) {
        setError("Failed to load search results. Please try again.");
        console.error("Search API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (searchParams.name || searchParams.brand || searchParams.type_product) {
      fetchSearchResults();
    } else {
      setLoading(false);
      setDisplayTitle("Search Results"); // Reset title if no params
    }

  }, [searchParams, loadingCategories]); // Removed brands, typeProducts from dependencies here as Nav now handles canonicalization

  if (loadingCategories) return <div className="text-center py-20 text-xl font-semibold">Loading categories for smart search...</div>;
  if (categoryError) return <div className="text-center py-20 text-xl font-semibold text-red-500">Error loading categories: {categoryError}</div>;
  if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading search results...</div>;
  if (error) return <div className="text-center py-20 text-xl font-semibold text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-2">
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold"
        >
          &larr; Back to Home
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">{displayTitle}</h1>

      {products.length === 0 ? (
        <div className="text-center py-10 text-xl text-gray-600">No products found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => {
            const originalPrice = parseFloat(product.price?.amount || 0);
            let discountedPrice = originalPrice;
            if (product.discount && product.discount.type === 'Percentage') {
              discountedPrice = originalPrice * (1 - parseFloat(product.discount.value) / 100);
            }
            return (
              <ProductCard
                key={product.product_code}
                productId={product.product_code}
                image={product.image_path}
                title={product.name}
                description={product.description}
                oldPrice={originalPrice.toFixed(2)}
                newPrice={discountedPrice.toFixed(2)}
                reviews={product.feedback?.totalReview || 0}
                rating={parseFloat(product.feedback?.rating || 0)}
                imgClassName="w-full h-48 object-contain"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}