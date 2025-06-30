import { useState } from 'react';

export default function ProductQuantity({ onQuantityChange }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, newQuantity);
    setQuantity(validQuantity);
    onQuantityChange(validQuantity);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Quantity:</label>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleQuantityChange(quantity - 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-12 text-center">{quantity}</span>
        <button 
          onClick={() => handleQuantityChange(quantity + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          +
        </button>
      </div>
    </div>
  );
}