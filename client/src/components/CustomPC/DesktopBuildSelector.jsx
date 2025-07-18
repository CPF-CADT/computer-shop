import React from "react";

export default function DesktopBuildSelector({
  categoryKey,
  label,
  products,
  selected,
  onSelect,
}) {
  return (
    <div className="mb-6">
      <h2 className="font-semibold text-lg mb-2">{label}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.length === 0 && (
          <div className="col-span-2 text-gray-400 text-sm">No products found.</div>
        )}
        {products.map((product) => (
          <button
            key={product.product_code || product.id}
            className={`border rounded-lg p-2 flex flex-col items-center hover:border-orange-400 transition ${
              selected && (selected.product_code === product.product_code || selected.id === product.id)
                ? "border-orange-500 ring-2 ring-orange-300"
                : "border-gray-200"
            }`}
            onClick={() => onSelect(categoryKey, product)}
            type="button"
          >
            <img
              src={product.image_path || product.image}
              alt={product.name}
              className="w-20 h-20 object-contain mb-2"
            />
            <div className="font-medium text-sm text-center">{product.name}</div>
            <div className="text-xs text-gray-500">${parseFloat(product.price?.amount || product.price).toFixed(2)}</div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-2 text-green-600 text-xs">
          Selected: {selected.name}
        </div>
      )}
    </div>
  );
}
