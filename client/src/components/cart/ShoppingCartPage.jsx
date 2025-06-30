// src/components/ui/ShoppingCartPage.js
import React from 'react';
import { FaPlus, FaMinus, FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCart } from './CartContext'; // Assuming CartContext is in the right place

const ShoppingCartItem = ({ item, onUpdateQuantity, onRemoveItem }) => (
  <div className="flex flex-col sm:flex-row items-center py-4 sm:py-6 border-b last:border-b-0">
    <img src={item.image} alt={item.name} className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded mr-0 mb-3 sm:mr-5 sm:mb-0 shadow" />
    <div className="flex-grow text-center sm:text-left mb-3 sm:mb-0">
      <h3 className="font-semibold text-gray-800 text-base md:text-lg">{item.name}</h3>
      <p className="text-xs text-gray-500 hidden sm:block">{item.description.substring(0,70)}...</p>
      <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 text-xs mt-1 sm:mt-2 font-medium">
        <FaTrash className="inline mr-1" /> Remove
      </button>
    </div>
    <div className="font-semibold text-gray-700 w-24 text-center text-sm md:text-base my-2 sm:my-0">${item.price.toFixed(2)}</div>
    <div className="flex items-center justify-center mx-2 sm:mx-5 my-2 sm:my-0">
      <button onClick={() => onUpdateQuantity(item.id, item.qty - 1)} className="p-2 border rounded-l-md hover:bg-gray-100 text-gray-600">
        <FaMinus size={12} />
      </button>
      <span className="px-4 py-1.5 w-12 text-center border-t border-b text-sm font-medium">{item.qty}</span>
      <button onClick={() => onUpdateQuantity(item.id, item.qty + 1)} className="p-2 border rounded-r-md hover:bg-gray-100 text-gray-600">
        <FaPlus size={12} />
      </button>
    </div>
    <div className="font-bold text-orange-500 w-28 text-center sm:text-right text-sm md:text-base">
      ${(item.price * item.qty).toFixed(2)}
    </div>
  </div>
);

const ShoppingCartPage = ({ onProceedToCheckout, onContinueShopping }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, itemCount } = useCart();

  if (!cartItems) { // Should be handled by useCart's fallback, but good for clarity
    return <div className="p-8 text-center">Loading cart...</div>;
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* You can add breadcrumbs or back navigation here */}
        {onContinueShopping && (
            <button onClick={onContinueShopping} className="inline-flex items-center text-sm text-gray-600 hover:text-orange-500 mb-4 font-medium">
                <FaArrowLeft className="mr-2" /> Continue Shopping
            </button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FaShoppingCart className="mr-3 text-orange-500"/> Shopping Cart
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
              <div className="hidden sm:flex justify-between items-center font-semibold text-xs text-gray-500 uppercase pb-3 border-b mb-1">
                <span className="w-2/5 pl-32">Product</span> {/* Adjusted for image */}
                <span className="w-1/6 text-center">Price</span>
                <span className="w-1/6 text-center">Quantity</span>
                <span className="w-1/6 text-right pr-4">Total</span>
              </div>
              {cartItems.map((item) => (
                <ShoppingCartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                />
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
                {onProceedToCheckout && (
                    <button
                        onClick={onProceedToCheckout}
                        disabled={itemCount === 0}
                        className="mt-8 w-full bg-orange-500 text-white py-3.5 rounded-md font-semibold hover:bg-orange-600 transition text-base disabled:opacity-60"
                    >
                        Proceed to Checkout
                    </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;