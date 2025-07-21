import React, { useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

const Khqr = ({ name = "Rathanak", amount = 0, qrValue = "" }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-400">
      <div className="bg-red-600 p-8 text-white font-bold text-2xl rounded-t-2xl flex justify-between items-center">
        <span>KHQR</span>
        <div className="w-0 h-0 border-t-[60px] border-t-transparent border-l-[60px] border-l-white -mt-8 -mr-8"></div>
      </div>
      <div className="bg-white px-10 py-8 text-center border-b border-dashed">
        <h2 className="text-3xl text-black font-semibold">{name}</h2>
        <p className="text-5xl text-black font-bold mt-4">R{amount.toFixed(2)}</p>
      </div>
      <div className="bg-white p-10 flex flex-col items-center justify-center">
        <div className="relative">
          {qrValue ? (
            <QRCode value={qrValue} size={300} />
          ) : (
            <div className="text-gray-500 text-center">Loading QR code...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Khqr;