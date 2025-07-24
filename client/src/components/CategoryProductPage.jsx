import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { apiService } from '../service/api';
import ProductCard from "./Product/ProductCard";
import { useCategory } from './context/CategoryContext';

export default function CategoryProductPage() {
  const { categoryName: sluggedCategoryName } = useParams();
  const { categories } = useCategory();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  const originalCategoryName = categories.find(
    (cat) => cat.title.toLowerCase().replace(/\s+/g, '-') === sluggedCategoryName
  )?.title;

  const fetchProductsByCategory = useCallback(async () => {
    if (!originalCategoryName) {
      setError("Category not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedData = await apiService.getProducts({
        category: originalCategoryName,
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
  }, [originalCategoryName]);

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

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading {originalCategoryName || sluggedCategoryName}s...</div>;
  if (error) return <div className="text-center py-20 text-xl font-semibold text-red-500">{error}</div>;
  if (!products || products.length === 0) return <div className="text-center py-20 text-xl font-semibold">No {originalCategoryName || sluggedCategoryName}s found.</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold"
        >
          &larr; Back to Home
        </Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{originalCategoryName || sluggedCategoryName}</h1>
      

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
            />
          );
        })}
      </div>
    </div>
  );
}