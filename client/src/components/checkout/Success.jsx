import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { fetchCartItems } = useCart();

  const handleBackHome = () => {
    navigate('/');
  };

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border bg-white">
        <div className="bg-orange-500 p-6 text-white font-bold text-xl rounded-t-xl">
          <span>Payment Confirmation</span>
        </div>

        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <svg className="h-24 w-24 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order is being processed.
          </p>

          <button
            onClick={handleBackHome}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-md transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;