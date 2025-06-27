import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../cart/CartContext';
import ProductQuantity from './ProductQuantity';
import ProductReviews from './ProductReviews';
import AddToCart from './AddToCart';
import ProductBreadcrumb from './ProductBreadcrumb';

export default function ProductDetails() {
  const { productId } = useParams();
  const { products, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Find product from context (with stock)
  const product = products.find(p => p.product_code === productId);

  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto p-4">
        <ProductBreadcrumb product={{ name: "Product Not Found" }} />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">This product is currently unavailable.</p>
        </div>
      </div>
    );
  }

  // If product exists but is out of stock
  if (typeof product.stock === "number" && product.stock <= 0) {
    return (
      <div className="max-w-[1200px] mx-auto p-4">
        <ProductBreadcrumb product={product} />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600">This product is currently out of stock.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stock >= quantity && quantity > 0) {
      addToCart(product, quantity);
      // Optionally, show feedback or navigate to cart
      // navigate('/cart'); // Uncomment to redirect after adding
    }
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

          <div className="mb-2 text-sm text-gray-500">
            In Stock: {product.stock || 0}
          </div>

          <ProductQuantity onQuantityChange={setQuantity} />
          <AddToCart onAddToCart={handleAddToCart} disabled={product.stock < quantity || quantity < 1} />

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