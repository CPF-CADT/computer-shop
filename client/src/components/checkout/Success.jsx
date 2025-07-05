import React from 'react';

const SuccessPage = () => (
  <div className="max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-400 bg-white mt-20">
    {/* Red Header */}
    <div className="bg-red-600 p-8 text-white font-bold text-2xl rounded-t-2xl flex justify-between items-center">
      <span>KHQR</span>
      <div className="w-0 h-0 border-t-[60px] border-t-transparent border-l-[60px] border-l-white -mt-8 -mr-8"></div>
    </div>

    {/* Success Content */}
    <div className="flex flex-col items-center justify-center py-16">
      <svg className="h-32 w-32 text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-xl text-green-600">Thank you for your payment.</p>
    </div>
  </div>
);

export default SuccessPage;