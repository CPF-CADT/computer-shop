import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom"; // Import useParams to get categoryName
import { apiService } from '../service/api'; // Adjust path as needed
import ProductCard from "./Product/ProductCard";
// Removed imports for ProductFilterSidebar, ProductBreadcrumb, ProductSortBar, CategoryBanner, ProductGrid

export default function CategoryProductPage() {
  const { categoryName } = useParams(); // Get the category name from the URL
  const [products, setProducts] = useState([]); // All products for the current category
  const [filteredProducts, setFilteredProducts] = useState([]); // Products after applying filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]); // e.g., [{ min: 0, max: 500 }]

  // Function to fetch products based on categoryName
  const fetchProductsByCategory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedData = await apiService.getProducts({
        category: categoryName, 
        limit: 50,
        sort: 'asc', 
      });
      setProducts(fetchedData.data || []);
      setFilteredProducts(fetchedData.data || []); // Initialize filtered products with all fetched products
    } catch (err) {
      setError(`Failed to load products for ${categoryName}. Please try again later.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categoryName]); // Re-fetch when categoryName changes

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

  // Apply filters whenever products, selectedBrands, or selectedPrices change
  useEffect(() => {
    let currentFiltered = products;

    // Filter by brand
    if (selectedBrands.length > 0) {
      currentFiltered = currentFiltered.filter(product =>
        selectedBrands.includes(product.brand?.name) // Assuming product has a nested brand.name
      );
    }

    // Filter by price
    if (selectedPrices.length > 0) {
      currentFiltered = currentFiltered.filter(product => {
        const price = parseFloat(product.price?.amount); // Assuming product has price.amount
        return selectedPrices.some(range => price >= range.min && price <= range.max);
      });
    }

    setFilteredProducts(currentFiltered);
  }, [products, selectedBrands, selectedPrices]);

  // handleFilterChange function (now a placeholder as sidebar is removed)
  // You'll need to implement actual filtering UI if you want to keep this functionality
  const handleFilterChange = useCallback(({ brands, prices }) => {
    setSelectedBrands(brands);
    setSelectedPrices(prices);
  }, []);

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading {categoryName}s...</div>;
  if (error) return <div className="text-center py-20 text-xl font-semibold text-red-500">{error}</div>;
  if (!products || products.length === 0) return <div className="text-center py-20 text-xl font-semibold">No {categoryName}s found.</div>;


  return (
    <div className="flex gap-8">
      {/* Removed ProductFilterSidebar */}
      <div className="flex-1">
        <div className="mb-2">
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold"
          >
            &larr; Back to Home
          </Link>
        </div>
        {/* Removed ProductBreadcrumb */}
        <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
        {/* Removed ProductSortBar */}
        {/* Removed CategoryBanner */}

        {/* Display products directly in a grid */}
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
                reviews={product.feedback?.totalReview || 0} // Added optional chaining and default
                rating={parseFloat(product.feedback?.rating || 0)} // Added optional chaining and default
                imgClassName="w-full h-48 object-contain"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
