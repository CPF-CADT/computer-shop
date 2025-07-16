import React, { useState, useEffect, useCallback } from "react";
import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import Pagination from "./Pagination";
import { apiService } from "../../service/api"; 

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalProducts, setTotalProducts] = useState(0);
    const [filters, setFilters] = useState({ page: 1, limit: 10, name: "", sort: "asc", category: "", type_product: "", brand: "", price: "" });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProductCode, setEditingProductCode] = useState(null);

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [typeProducts, setTypeProducts] = useState([]);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiService.getProducts(filters);
            setProducts(res.data || []);
            setTotalProducts(res.meta?.totalItems || 0);
        } catch (err) {
            setError(err.message || "Failed to fetch products.");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    const fetchDropdownData = async () => {
        try {
            const [catData, brandData, typeData] = await Promise.all([
                apiService.getAllCategories(),
                apiService.getAllBrands(),
                apiService.getAllTypeProducts()
            ]);
            setCategories(catData || []);
            setBrands(brandData || []);
            setTypeProducts(typeData || []);
        } catch (error) {
            console.error("Failed to load dropdown data:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const handleOpenEditModal = (productCode) => {
        setEditingProductCode(productCode);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingProductCode(null);
    };

    const handleUpdateProduct = async (productCode, data) => {
        try {
            await apiService.updateProduct(productCode, data);
            handleCloseEditModal();
            fetchProducts();
            alert("Product updated successfully!");
        } catch (error) {
            alert("Failed to update product.");
            console.error(error);
        }
    };

    const handleFilterChange = (newFilters) => setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    const handlePageChange = (newPage) => setFilters(prev => ({ ...prev, page: newPage }));
    const handleDeleteProduct = (productId) => console.log(`Delete product ${productId}`);
    const handleAddProduct = (data) => console.log('Add product', data);

    const totalPages = Math.ceil(totalProducts / filters.limit);

    return (
        <div>
            <ProductToolbar
                filters={filters}
                onFilterChange={handleFilterChange}
                onAddProductClick={() => setIsAddModalOpen(true)}
                categories={categories}
                brands={brands}
                typeProducts={typeProducts}
            />
            <div className="mt-4">
                {isLoading && <p className="text-center p-4">Loading products...</p>}
                {error && <p className="text-center p-4 text-red-500">{error}</p>}
                {!isLoading && !error && (
                    <ProductTable
                        products={products}
                        onDelete={handleDeleteProduct}
                        onEdit={handleOpenEditModal}
                    />
                )}
            </div>
            
            {!isLoading && !error && totalPages > 1 && (
                <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddProduct={handleAddProduct}
            />

            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleUpdateProduct}
                productCode={editingProductCode}
                categories={categories}
                brands={brands}
                types={typeProducts}
            />
        </div>
    );
}