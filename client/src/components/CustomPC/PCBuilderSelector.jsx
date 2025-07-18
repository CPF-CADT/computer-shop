import React from "react";

export default function PCBuilderSelector({
  items,
  title,
  selectedId,
  onSelect,
}) {
  return (
    <div>
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.length === 0 && (
          <div className="col-span-2 text-gray-400 text-sm">No products found.</div>
        )}
        {items.map((item) => (
          <button
            key={item.id}
            className={`border rounded-lg p-2 flex flex-col items-center hover:border-orange-400 transition ${
              selectedId === item.id
                ? "border-orange-500 ring-2 ring-orange-300"
                : "border-gray-200"
            }`}
            onClick={() => onSelect(item.id)}
            type="button"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-contain mb-2"
            />
            <div className="font-medium text-sm text-center">{item.name}</div>
            <div className="text-xs text-gray-500">${Number(item.price).toFixed(2)}</div>
          </button>
        ))}
      </div>
      {selectedId && (
        <div className="mt-2 text-green-600 text-xs">
          Selected: {items.find((i) => i.id === selectedId)?.name}
        </div>
      )}
    </div>
  );
}
