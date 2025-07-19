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
        <div className="space-y-6 w-full max-w-full">
      <style>{`
        .modern-table-container {
          width: 100%;
          overflow-x: auto;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
        }
        .modern-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 400px;
        }
        .modern-table th, .modern-table td {
          padding: 12px 10px;
          text-align: left;
          font-size: 15px;
          border-bottom: 1px solid #f3f4f6;
          background: white;
        }
        .modern-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        .modern-table tr:last-child td {
          border-bottom: none;
        }
        @media (max-width: 900px) {
          .modern-table, .modern-table th, .modern-table td {
            font-size: 13px;
            min-width: 120px;
          }
        }
        @media (max-width: 600px) {
          .modern-table-container {
            border-radius: 0.5rem;
            box-shadow: none;
            padding: 0;
          }
          .modern-table, .modern-table thead, .modern-table tbody, .modern-table th, .modern-table td, .modern-table tr {
            display: block;
            width: 100%;
          }
          .modern-table thead {
            display: none;
          }
          .modern-table tr {
            margin-bottom: 1.2rem;
            border-radius: 0.5rem;
            box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
            background: white;
            border: 1px solid #f3f4f6;
          }
          .modern-table td {
            padding: 10px 8px 10px 50%;
            position: relative;
            border: none;
            min-width: unset;
            max-width: unset;
            font-size: 13px;
            background: white;
          }
          .modern-table td:before {
            position: absolute;
            top: 10px;
            left: 16px;
            width: 45%;
            white-space: pre-wrap;
            font-weight: 600;
            color: #6b7280;
            content: attr(data-label);
            font-size: 12px;
          }
        }
      `}</style>
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