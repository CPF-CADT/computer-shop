import React from "react";

export default function DesktopBuildSummary({ selectedComponents, totalPrice, onRemove }) {
  const selectedList = Object.entries(selectedComponents);

  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-8">
      <h3 className="font-bold text-lg mb-3">Added Components</h3>
      <div className="mb-4">
        {selectedList.length === 0 && (
          <div className="text-gray-400 text-sm">No components selected yet.</div>
        )}
        <ul>
          {selectedList.map(([cat, item]) => (
            <li key={cat} className="flex items-center justify-between mb-2">
              <span className="text-sm">{item.name}</span>
              <span className="text-xs text-gray-500">${parseFloat(item.price?.amount || item.price).toFixed(2)}</span>
              <button
                className="ml-2 text-red-500 text-xs hover:underline"
                onClick={() => onRemove(cat)}
                type="button"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t pt-3 mb-3 flex justify-between font-semibold">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      <button
        className="w-full bg-orange-500 text-white py-2 rounded-md font-bold hover:bg-orange-600 transition"
        disabled={selectedList.length === 0}
        onClick={() => alert("Added to cart (implement logic)")}
      >
        Add to Cart
      </button>
    </div>
  );
}
