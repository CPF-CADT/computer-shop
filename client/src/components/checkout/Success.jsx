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
    <div className="max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-300 bg-white mt-20">
      <div className="bg-red-600 p-8 text-white font-bold text-2xl rounded-t-2xl flex justify-between items-center relative">
        <span>KHQR</span>
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-t-transparent border-l-[60px] border-l-white"></div>
      </div>

      <div className="flex flex-col items-center justify-center py-16 px-4">
        <svg className="h-32 w-32 text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
        <p className="text-lg text-green-600 mb-6 text-center">Thank you for your payment.</p>

        <button
          onClick={handleBackHome}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md transition duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
