// src/components/checkout/OrderSummaryCheckout.js
import React from 'react';
import { useCart } from '../cart/CartContext';

const OrderSummaryCheckout = ({ shippingCost = 0 }) => { // shippingCost can be passed as prop
  const { cartItems, cartTotal } = useCart();

  const taxRate = 0.05; // 5%
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal + shippingCost + taxAmount;

  return (
    <div className="bg-light-bg p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
      <div className="max-h-60 overflow-y-auto mb-4 pr-2"> {/* Scrollable item list */}
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-start py-2 border-b last:border-b-0">
            <div className="flex">
              <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded mr-3"/>
              <div>
                <p className="text-sm font-medium text-gray-700">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              ${(parseFloat(item.price?.amount ?? item.price) * item.qty).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600 mb-2">{cartItems.length} items in cart</p>
      
      <div className="space-y-1 text-sm text-gray-700 mt-4 pt-4 border-t">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t mt-2">
          <span>Order Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCheckout;