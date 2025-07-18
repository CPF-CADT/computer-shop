import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

const Khqr = ({ name = "Rathanak", amount = 0 }) => {
  const [paid, setPaid] = useState(false);
  const qrValue = JSON.stringify({ name, amount });
  const navigate = useNavigate();

  // Simulate payment success for demo (replace with backend logic)
  // useEffect(() => { setTimeout(() => setPaid(true), 5000); }, []);

  // Redirect to success page when paid
  useEffect(() => {
    if (paid) {
      navigate('/success');
    }
  }, [paid, navigate]);

  // Call setPaid(true) from backend logic when payment is confirmed

  return (
    <div className="max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-400">
      {/* Red Header */}
      <div className="bg-red-600 p-8 text-white font-bold text-2xl rounded-t-2xl flex justify-between items-center">
        <span>KHQR</span>
        <div className="w-0 h-0 border-t-[60px] border-t-transparent border-l-[60px] border-l-white -mt-8 -mr-8"></div>
      </div>

      {/* Name and Amount */}
      <div className="bg-white px-10 py-8 text-center border-b border-dashed">
        <h2 className="text-3xl font-semibold">{name}</h2>
        <p className="text-5xl font-bold mt-4">${amount}</p>
      </div>

      {/* QR Code */}
      <div className="bg-white p-10 flex flex-col items-center justify-center">
        <div className="relative">
          <QRCode value={qrValue} size={300} />
        </div>
      </div>
    </div>
  );
};

export default Khqr;