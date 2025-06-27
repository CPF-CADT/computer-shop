// src/components/cart/CartSummary.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext'; // <-- fix import

const CartSummary = () => {
  const { cartTotal, itemCount } = useCart();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');

  // These are illustrative values
  const shippingEstimate = itemCount > 0 ? 5.00 : 0.00;
  const taxRate = 0.05; // 5%
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal + shippingEstimate + taxAmount;

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="bg-light-bg p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Summary</h2>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} items)</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shippingEstimate.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500">
          (Standard shipping. Calculated at next step if other options available)
        </p>
        <div className="flex justify-between">
          <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t mt-2">
          <span>Order Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700 mb-1">
          Apply Discount Code
        </label>
        <div className="flex">
          <input
            type="text"
            id="discountCode"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter code"
            className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:ring-brand-orange focus:border-brand-orange sm:text-sm"
          />
          <button className="bg-gray-600 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 text-sm">
            Apply
          </button>
        </div>
      </div>

      <button
        onClick={handleProceedToCheckout}
        disabled={itemCount === 0}
        className="mt-6 w-full bg-brand-orange text-white py-3 rounded-md font-semibold hover:bg-brand-orange-dark transition duration-150 disabled:opacity-50"
      >
        Checkout
      </button>
    </div>
  );
};

export default CartSummary;