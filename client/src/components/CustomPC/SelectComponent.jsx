import React, { useState } from "react";

export default function SelectComponent({ items, title, onSelect, selectedId }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`cursor-pointer border rounded-lg p-4 transition-all duration-200 ${
              selectedId === item.id
                ? "border-orange-500 ring-2 ring-orange-400 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
            onClick={() => onSelect(item.id)}
          >
            <img src={item.image} alt={item.name} className="w-28 h-28 object-contain mx-auto mb-2" />
            <div className="font-semibold text-center">{item.name}</div>
            <div className="text-sm text-gray-500 text-center">{item.description}</div>
            <div className="text-center mt-2 font-bold text-orange-600">${item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
