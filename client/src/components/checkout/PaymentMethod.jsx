// src/components/checkout/PaymentMethod.js
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PaymentMethod = ({ onPlaceOrder, onBack, isCompleted }) => {
  const [selectedPayment, setSelectedPayment] = useState('payway'); // 'payway' or 'card'
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isCompleted);

  const paymentLogos = [
    { name: 'PayWay', style: 'bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold' },
    { name: 'VISA', style: 'bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold' },
    { name: 'MasterCard', style: 'bg-red-500 text-white px-2 py-1 rounded text-xs font-bold' },
    { name: 'JCB', style: 'bg-green-500 text-white px-2 py-1 rounded text-xs font-bold' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreedToTerms) {
      onPlaceOrder({ paymentMethod: selectedPayment });
      // setIsCollapsed(true); // Usually after placing order, you'd navigate away
    } else {
      alert("Please agree to the terms of service.");
    }
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <h2 className="text-lg font-semibold text-gray-700">Payment Method</h2>
        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
      </button>

      {!isCollapsed && (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* PayWay Option (example) */}
            <label className="flex items-center p-3 border rounded-md hover:border-brand-orange cursor-pointer has-[:checked]:border-brand-orange has-[:checked]:ring-1 has-[:checked]:ring-brand-orange">
              <input
                type="radio"
                name="paymentOption"
                value="payway"
                checked={selectedPayment === 'payway'}
                onChange={() => setSelectedPayment('payway')}
                className="form-radio h-4 w-4 text-brand-orange focus:ring-brand-orange"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">PayWay</span>
              <div className="ml-auto flex space-x-1">
                {paymentLogos.map(logo => (
                    <span key={logo.name} className={logo.style}>{logo.name}</span>
                ))}
              </div>
            </label>

            {/* Add Credit Card Option here if needed */}
            {/* <label className="flex items-center p-3 border rounded-md hover:border-brand-orange ..."> ... </label> */}
            {/* If selectedPayment === 'card', show card input fields */}

          </div>

          <div className="mt-6">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="form-checkbox h-4 w-4 text-brand-orange focus:ring-brand-orange rounded"
              />
              <span className="ml-2">
                I agree to the <a href="/terms" target="_blank" className="text-brand-orange hover:underline">terms of service</a> and will adhere to them unconditionally.
              </span>
            </label>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
                type="button"
                onClick={onBack}
                className="text-sm text-gray-600 hover:text-brand-orange"
            >
                ← Back to Shipping Method
            </button>
            <button
              type="submit"
              disabled={!agreedToTerms}
              className="bg-brand-orange text-white px-8 py-2.5 rounded-md font-semibold hover:bg-brand-orange-dark disabled:opacity-50"
            >
              Place Order
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentMethod;