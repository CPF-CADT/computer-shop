// src/components/checkout/ShippingMethod.js
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { mockShippingMethods } from '../../data/mockData';


const ShippingMethod = ({ onNext, onBack, currentSelection, onSelectionChange, isCompleted }) => {
  const [selectedMethod, setSelectedMethod] = useState(currentSelection || mockShippingMethods[0].id);
  const [isCollapsed, setIsCollapsed] = useState(isCompleted); // Start collapsed if completed

  const handleSelection = (methodId) => {
    setSelectedMethod(methodId);
    const selected = mockShippingMethods.find(m => m.id === methodId);
    onSelectionChange(selected); // Pass the full selected method object
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMethod) {
      onNext();
      setIsCollapsed(true);
    }
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <h2 className="text-lg font-semibold text-gray-700">Shipping Method</h2>
        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
      </button>

      {!isCollapsed && (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-3">
            {mockShippingMethods.map((method) => (
              <label key={method.id} className="flex items-center p-3 border rounded-md hover:border-brand-orange cursor-pointer has-[:checked]:border-brand-orange has-[:checked]:ring-1 has-[:checked]:ring-brand-orange">
                <input
                  type="radio"
                  name="shippingMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => handleSelection(method.id)}
                  className="form-radio h-4 w-4 text-brand-orange focus:ring-brand-orange"
                />
                <div className="ml-3 flex-grow">
                  <span className="block text-sm font-medium text-gray-700">{method.name}</span>
                </div>
                <span className="text-sm text-gray-600">${method.price.toFixed(2)}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button
                type="button"
                onClick={onBack}
                className="text-sm text-gray-600 hover:text-brand-orange"
            >
                ← Back to Address
            </button>
            <button
              type="submit"
              disabled={!selectedMethod}
              className="bg-brand-orange text-white px-8 py-2.5 rounded-md font-semibold hover:bg-brand-orange-dark disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ShippingMethod;