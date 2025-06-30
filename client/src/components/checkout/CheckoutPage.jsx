
// src/components/ui/CheckoutPage.js
import React, { useState } from 'react';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { useCart } from '../cart/CartContext';
import { mockShippingMethods } from '../../data/mockData';
import { Link } from 'react-router-dom';

// Import existing components
import ShippingAddressForm from './ShippingAddressForm';
import ShippingMethod from './ShippingMethod';
import PaymentMethod from './PaymentMethod';
import OrderSummaryCheckout from './OrderSummaryCheckout';

const CheckoutPage = ({ onBackToCart, onOrderPlaced }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);

  const [shippingAddress, setShippingAddress] = useState({
     address: '', city: '', country: 'United States',stateProvince:''
  });
  const [shippingMethod, setShippingMethod] = useState(mockShippingMethods[0]);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Step navigation
  const goToStep = (step) => setCurrentStep(step);

  // Handle order placement
  const handlePlaceOrder = (paymentData) => {
    setPaymentCompleted(true);
    if (onOrderPlaced) onOrderPlaced({ shippingAddress, shippingMethod, paymentData, cart: cartItems });
    clearCart();
    alert("Order placed successfully! (Simulated)");
  };

  // If cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="p-8 text-center">
        Your cart is empty.{' '}
        <button onClick={onBackToCart} className="text-orange-500 hover:underline">
          Return to cart
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <Link to="/" className="hover:underline text-gray-500">Home</Link>
          <span>&gt;</span>
          <Link to="/laptop" className="hover:underline text-gray-500">Laptops</Link>
          <span>&gt;</span>
          <Link to="/cart" className="hover:underline text-gray-500">My Cart</Link>
          <span>&gt;</span>
          <span className="text-black font-semibold">Checkout</span>
        </div>

        {onBackToCart && (
          <button onClick={onBackToCart} className="inline-flex items-center text-sm text-gray-600 hover:text-orange-500 mb-5 font-medium">
            <FaArrowLeft className="mr-2" /> Back to Cart
          </button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left Side: Steps */}
          <div className="lg:w-[60%]">
            {/* Step 1: Shipping Address */}
            <ShippingAddressForm
              onNext={(data) => { setShippingAddress(data); goToStep(2); }}
              initialData={shippingAddress}
            />

            {/* Step 2: Shipping Method */}
            {currentStep >= 2 && (
              <ShippingMethod
                onNext={() => goToStep(3)}
                onBack={() => goToStep(1)}
                currentSelection={shippingMethod?.id}
                onSelectionChange={setShippingMethod}
                isCompleted={currentStep > 2}
              />
            )}

            {/* Step 3: Payment */}
            {currentStep >= 3 && (
              <PaymentMethod
                onPlaceOrder={handlePlaceOrder}
                onBack={() => goToStep(2)}
                isCompleted={paymentCompleted}
              />
            )}
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-[40%]">
            <OrderSummaryCheckout shippingCost={shippingMethod?.price || 0} />
            <div className="mt-5 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-xs flex items-center">
              <FaLock className="mr-2 flex-shrink-0" /> Your information is safe. Secure SSL encrypted checkout.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;