import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { apiService } from '../service/api';
import ProductCard from "./Product/ProductCard";
import { useCategory } from './context/CategoryContext'; // Import useCategory hook

export default function CategoryProductPage() {
  const { categoryName: sluggedCategoryName } = useParams(); // Get the slug from the URL
  const { categories } = useCategory(); // Get all categories from context

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  // Derive the original category name from the slug
  const originalCategoryName = categories.find(
    (cat) => cat.title.toLowerCase().replace(/\s+/g, '-') === sluggedCategoryName
  )?.title;

  // Function to fetch products based on originalCategoryName
  const fetchProductsByCategory = useCallback(async () => {
    // Only fetch if originalCategoryName is found
    if (!originalCategoryName) {
      setError("Category not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedData = await apiService.getProducts({
        category: originalCategoryName, // Use the original category name here
        limit: 50,
        sort: 'asc',
      });
      setProducts(fetchedData.data || []);
      setFilteredProducts(fetchedData.data || []);
    } catch (err) {
      setError(`Failed to load products for ${originalCategoryName}. Please try again later.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [originalCategoryName]); // Re-fetch when originalCategoryName changes

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

  useEffect(() => {
    let currentFiltered = products;

    if (selectedBrands.length > 0) {
      currentFiltered = currentFiltered.filter(product =>
        selectedBrands.includes(product.brand?.name)
      );
    }

    if (selectedPrices.length > 0) {
      currentFiltered = currentFiltered.filter(product => {
        const price = parseFloat(product.price?.amount);
        return selectedPrices.some(range => price >= range.min && price <= range.max);
      });
    }

    setFilteredProducts(currentFiltered);
  }, [products, selectedBrands, selectedPrices]);

  const handleFilterChange = useCallback(({ brands, prices }) => {
    setSelectedBrands(brands);
    setSelectedPrices(prices);
  }, []);

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading {originalCategoryName || sluggedCategoryName}s...</div>;
  if (error) return <div className="text-center py-20 text-xl font-semibold text-red-500">{error}</div>;
  if (!products || products.length === 0) return <div className="text-center py-20 text-xl font-semibold">No {originalCategoryName || sluggedCategoryName}s found.</div>;

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="mb-2">
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold"
          >
            &larr; Back to Home
          </Link>
        </div>
        {/* Use originalCategoryName for display */}
        <h1 className="text-2xl font-bold mb-4">{originalCategoryName || sluggedCategoryName}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
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
      </div>
    </div>
  );
}