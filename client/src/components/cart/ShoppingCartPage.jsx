// src/components/cart/ShoppingCartPage.jsx

import React from 'react';
import { useCart } from './CartContext'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
// Assuming you might have these assets for payment icons
// import AbaPayIcon from '../assets/payment/aba-pay.svg';
// import VisaIcon from '../assets/payment/visa.svg';
// import MasterCardIcon from '../assets/payment/mastercard.svg';


// This is the component for a single item in the cart
const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityUpdate = (newQuantity) => {
    // Prevent quantity from going below 1, remove item instead.
    if (newQuantity < 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="grid grid-cols-6 gap-4 items-center py-4">
      {/* Product Details */}
      <div className="col-span-3 flex items-center gap-4">
        <img src={item.image_path || item.image} alt={item.name} className="w-20 h-20 object-contain rounded-md bg-gray-50" />
        <div>
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500">Custom Build</p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-1 text-center font-medium text-gray-700">
        ${Number(item.price).toFixed(2)}
      </div>

      {/* Quantity */}
      <div className="col-span-1 flex items-center justify-center">
        <button onClick={() => handleQuantityUpdate(item.qty - 1)} className="p-2 border rounded-l-md hover:bg-gray-100 transition">
          <FaMinus size={12} />
        </button>
        <span className="px-4 py-1.5 w-12 text-center border-t border-b font-medium">{item.qty}</span>
        <button onClick={() => handleQuantityUpdate(item.qty + 1)} className="p-2 border rounded-r-md hover:bg-gray-100 transition">
          <FaPlus size={12} />
        </button>
      </div>

      {/* Total & Remove */}
      <div className="col-span-1 flex items-center justify-end gap-6">
         <span className="font-bold text-gray-800 text-lg">
           ${(item.price * item.qty).toFixed(2)}
         </span>
         <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition">
            <FaTrash size={16} />
         </button>
      </div>
    </div>
  );
};


// This is the main page component
const ShoppingCartPage = () => {
  const { cartItems, cartTotal, itemCount } = useCart();
  const navigate = useNavigate();
  
  // Example values, you can make these dynamic
  const shippingCost = cartItems.length > 0 ? 5.00 : 0.00;
  const taxAmount = cartTotal * 0; // Assuming 0% tax for now

  return (
    <div className="bg-gray-50 p-4 sm:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Title and Actions */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaShoppingCart className="mr-3 text-orange-500" /> Shopping Cart
            </h1>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 font-medium transition">
                <FaArrowLeft />
                Continue Shopping
            </button>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Items List - Takes 2/3 of the width on large screens */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                {/* Headers */}
                <div className="grid grid-cols-6 gap-4 pb-3 border-b text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <h4 className="col-span-3">Product</h4>
                    <h4 className="col-span-1 text-center">Price</h4>
                    <h4 className="col-span-1 text-center">Quantity</h4>
                    <h4 className="col-span-1 text-right">Total</h4>
                </div>
                {/* Items */}
                <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>
            </div>

            {/* Order Summary - Takes 1/3 of the width */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4">Order Summary</h2>
                
                {/* Price Details */}
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">${shippingCost.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium">{taxAmount > 0 ? `$${taxAmount.toFixed(2)}` : 'Calculated at checkout'}</span>
                  </div>
                </div>

                <div className="border-t my-4"></div>

                {/* Total */}
                <div className="flex justify-between items-center font-bold text-xl mb-5">
                    <span>Order Total</span>
                    <span>${(cartTotal + shippingCost + taxAmount).toFixed(2)}</span>
                </div>

                {/* Call to Action */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold text-lg hover:bg-orange-600 transition shadow-lg hover:shadow-orange-500/40"
                >
                  Proceed to Checkout
                </button>

                {/* Discount Code */}
                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-600">Have a discount code?</label>
                    <div className="flex mt-1">
                        <input type="text" placeholder="Enter code" className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:ring-orange-500 focus:border-orange-500 text-sm" />
                        <button className="bg-gray-800 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 text-sm font-semibold">Apply</button>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 mb-2">Secure payments with</p>
                    <div className="flex justify-center items-center gap-3">
                        {/* Replace with your actual payment icon components/images */}
                        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-xs">ABA</div>
                        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-xs">VISA</div>
                        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-xs">MC</div>
                    </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          // Empty Cart View
          <div className="text-center py-16 bg-white p-8 rounded-lg shadow-md">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-6">Your shopping cart is empty.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600 transition"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;