import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { mockLaptop, mockPC } from '../../data/mockData';
import ProductQuantity from './ProductQuantity';
import ProductReviews from './ProductReviews';
import AddToCart from './AddToCart';
import ProductBreadcrumb from './ProductBreadcrumb';
import { useCart } from '../cart/CartContext'; // <-- Add this import

export default function ProductDetails() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart(); // <-- Use cart context

  // Find product from all possible sources
  const product = [...mockLaptop, ...mockPC].find(p => p.product_code === productId);

  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto p-4">
        <ProductBreadcrumb product={{ name: "Product Not Found" }} />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">This product is currently out of stock or unavailable.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: product.product_code,
      qty: quantity,
      price: typeof product.price === "object" ? Number(product.price.amount) : Number(product.price),
      image: product.image_path,
      name: product.name,
      description: product.description,
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <ProductBreadcrumb product={product} />
      
      <div className="grid grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-lg">
          <img src={product.image_path} alt={product.name} className="w-full object-contain" />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold">
              ${parseFloat(product.price.amount).toFixed(2)}
            </span>
            {product.discount && (
              <span className="text-gray-500 line-through ml-2">
                ${(parseFloat(product.price.amount) * (1 + 0.2)).toFixed(2)}
              </span>
            )}
          </div>

          <ProductQuantity onQuantityChange={setQuantity} />
          <AddToCart onAddToCart={handleAddToCart} />

          {/* Specifications */}
          <div className="border-t pt-6">
            <h2 className="font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>Brand: {product.brand}</div>
              <div>Category: {product.category.title}</div>
              <div>Type: {product.type.title}</div>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews 
        productRating={product.feedback.rating} 
        totalReviews={product.feedback.totalReview} 
      />
    </div>
  );
}