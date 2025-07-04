import React, { useState } from "react";
import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";

// You can fetch this data from an API in a real application
const sampleProducts = [
  {
    id: 1,
    name: "Gabriela Cashmere Blazer",
    sku: "SKU-12345",
    price: 120,
    quantity: 24,
    views: 320,
    status: "Active",
    image: "https://placehold.co/40x40/f0f0f0/333?text=IMG"
  },
   {
    id: 2,
    name: "Classic Denim Jeans",
    sku: "SKU-67890",
    price: 75,
    quantity: 50,
    views: 850,
    status: "Active",
    image: "https://placehold.co/40x40/e0e0e0/555?text=IMG"
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState(sampleProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Updated function to handle the new, richer product data
  const handleAddProduct = (newProductData) => {
    console.log(newProductData)
    const newProduct = {
      id: products.length + 1,
      ...newProductData,
      views: 0,
      status: "Active",
    };
    setProducts([newProduct, ...products]);
      };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div>
      <ProductToolbar onAddProductClick={() => setIsModalOpen(true)} />
      <div className="mt-4">
        <ProductTable products={products} onDelete={handleDeleteProduct} />
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}





