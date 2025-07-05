import React, { useState, useEffect, useCallback } from "react";
import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import { apiService } from "../../service/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for filters, sorting, and pagination
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    name: "",
    sort: "",
    order_column: "",
    category: "",
    type_product: "",
    brand: "",
  });

  // Function to fetch products from the API
  const fetchProducts = useCallback( async () => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await apiService.getProducts(filters);
      
      if (Array.isArray(responseData)) {
        setProducts(responseData); 
      } else {
        console.error("API response was not an array:", responseData);
        setProducts([]); 
      }
    } catch (err) {
      setError(err.message || "Failed to fetch products.");
      setProducts([])
    } finally {
      setIsLoading(false);
    }
  }, [filters]); // Recreate the function if filters change

  // Fetch products on initial render and when filters are applied
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleApplyFilters = () => {
    // Reset to page 1 when applying new filters
    setFilters(prevFilters => ({ ...prevFilters, page: 1 }));
    // The useEffect will then trigger a refetch
  };

  const handleAddProduct = async (newProductData) => {
    try {
      const messageRespon = await apiService.addNewProduct({ productData: newProductData });
      alert(messageRespon.message);
      setIsModalOpen(false);
      // Refresh the product list to show the new product
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      alert(err.message || "Failed to add product");
    }
  };

  const handleDeleteProduct = (productId) => {
    // Here you would typically call an API to delete the product
    // For now, we just filter it out from the UI
    console.log(`Deleting product with ID: ${productId}`);
    setProducts(products.filter((p) => p.id !== productId));
    // Example API call:
    // apiService.deleteProduct(productId).then(() => fetchProducts());
  };

  return (
    <div>
      <ProductToolbar
        filters={filters}
        onFilterChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onAddProductClick={() => setIsModalOpen(true)}
      />
      <div className="mt-4">
        {isLoading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && (
          <ProductTable products={products} onDelete={handleDeleteProduct} />
        )}
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}