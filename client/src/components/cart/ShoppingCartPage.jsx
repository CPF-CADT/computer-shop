// src/components/ui/ShoppingCartPage.js
import React from 'react';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCart } from './CartContext';
import { Link, useNavigate } from 'react-router-dom';

// Import existing components
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const ShoppingCartPage = ({ onProceedToCheckout, onContinueShopping }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, itemCount } = useCart();
  const navigate = useNavigate();

  if (!cartItems) { // Should be handled by useCart's fallback, but good for clarity // Should be handled by useCart's fallback, but good for clarity
    return <div className="p-8 text-center">Loading cart...</div>;
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <Link to="/" className="hover:underline text-gray-500">Home</Link>
          <span>&gt;</span>
          <Link to="/laptop" className="hover:underline text-gray-500">Laptops</Link>
          <span>&gt;</span>
          <span className="text-black font-semibold">My Cart</span>
        </div>
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <Link to="/" className="hover:underline text-gray-500">Home</Link>
          <span>&gt;</span>
          <Link to="/laptop" className="hover:underline text-gray-500">Laptops</Link>
          <span>&gt;</span>
          <span className="text-black font-semibold">My Cart</span>
        </div>
        {onContinueShopping && (
          <button onClick={onContinueShopping} className="inline-flex items-center text-sm text-gray-600 hover:text-orange-500 mb-4 font-medium">
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FaShoppingCart className="mr-3 text-orange-500" /> Shopping Cart
        </h1>

        {itemCount === 0 ? (
          <div className="text-center py-12 bg-white p-8 rounded-lg shadow-md">
            <FaShoppingCart className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-6">Your shopping cart is empty.</p>
            {onContinueShopping && (
              <button
                onClick={onContinueShopping}
                className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600 transition text-base"
              >
                Discover Products
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Cart Items Section */}
            <div className="lg:w-[65%] bg-white p-5 md:p-7 rounded-lg shadow-md">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t">
                {onContinueShopping && (
                  <button
                    onClick={onContinueShopping}
                    className="text-sm border border-gray-300 text-gray-700 px-6 py-2.5 rounded-md hover:bg-gray-100 font-medium transition mb-3 sm:mb-0 w-full sm:w-auto"
                  >
                    Continue Shopping
                  </button>
                )}
                <button
                  onClick={clearCart}
                  className="text-sm bg-gray-200 text-gray-700 px-6 py-2.5 rounded-md hover:bg-gray-300 font-medium transition w-full sm:w-auto"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Summary Section */}
            <div className="lg:w-[35%]">
              <div className="bg-white p-5 md:p-7 rounded-lg shadow-md sticky top-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-3">Order Summary</h2>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-medium">${(5.00).toFixed(2)}</span> {/* Placeholder */}
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="font-medium">${(cartTotal * 0.07).toFixed(2)}</span> {/* Placeholder 7% tax */}
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 text-lg pt-3 border-t mt-3">
                    <span>Order Total</span>
                    <span>${(cartTotal + 5.00 + (cartTotal * 0.07)).toFixed(2)}</span>
                  </div>
                </div>
                {/* Always show checkout button in cart summary */}
                <button
                  onClick={onProceedToCheckout || (() => navigate('/checkout'))}
                  disabled={itemCount === 0}
                  className="mt-8 w-full bg-orange-500 text-white py-3.5 rounded-md font-semibold hover:bg-orange-600 transition text-base disabled:opacity-60"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;