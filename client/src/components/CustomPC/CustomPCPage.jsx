import React, { useState } from "react";
import {
  builderCPUs,
  builderGPUs,
  builderMotherboards,
  builderRAMs,
  builderPSUs,
  builderCoolers,
  builderCases,
  builderFans,
} from "../../data/mockData";
import SelectComponent from "./SelectComponent";
import { useCart } from "../cart/CartContext"; // <-- Add this import

const COMPONENTS = [
  { key: "cpu", label: "CPU", items: builderCPUs },
  { key: "gpu", label: "GPU", items: builderGPUs },
  { key: "motherboard", label: "Motherboard", items: builderMotherboards },
  { key: "ram", label: "RAM", items: builderRAMs },
  { key: "psu", label: "Power Supply", items: builderPSUs },
  { key: "cooler", label: "Cooler", items: builderCoolers },
  { key: "case", label: "Case", items: builderCases },
  { key: "fan", label: "Fan", items: builderFans },
];

export default function CustomPCPage() {
  const [selected, setSelected] = useState({});
  const { addToCart } = useCart(); // <-- Use cart context

  const handleSelect = (key, id) => {
    const comp = COMPONENTS.find((c) => c.key === key);
    const item = comp.items.find((i) => i.id === id);
    setSelected((prev) => ({ ...prev, [key]: item }));
  };

  const handleRemove = (key) => {
    setSelected((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const selectedList = Object.entries(selected);
  const totalPrice = selectedList.reduce(
    (sum, [, item]) => sum + Number(item.price),
    0
  );

  // --- Add to Cart Handler ---
  const handleAddCustomPCToCart = () => {
    if (selectedList.length === 0) return;
    // Generate a unique id for the custom build (timestamp + random)
    const customBuildId = `custompc-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    // Compose a name and description
    const buildName =
      "Custom PC: " +
      selectedList.map(([cat, item]) => item.name).join(", ");
    const buildDescription =
      "Custom build with: " +
      selectedList.map(([cat, item]) => `${cat.toUpperCase()}: ${item.name}`).join(", ");
    // Compose an image (use first selected component's image)
    const buildImage = selectedList[0]?.[1]?.image || selectedList[0]?.[1]?.image_path || "";
    // Add to cart
    addToCart({
      id: customBuildId,
      name: buildName,
      description: buildDescription,
      price: totalPrice,
      qty: 1,
      image: buildImage,
      isCustomPC: true,
      components: selected, // Save the selected components for reference
    });
    alert("Custom PC added to cart!");
  };

  // --- Summary Box Component ---
  const SummaryBox = () => (
    <div className="bg-white rounded-lg shadow p-4 sticky top-8 min-w-[260px]">
      <h3 className="font-bold text-lg mb-3">Your Build</h3>
      <div className="mb-4">
        {selectedList.length === 0 && (
          <div className="text-gray-400 text-sm">No components selected yet.</div>
        )}
        <ul>
          {selectedList.map(([cat, item]) => (
            <li key={cat} className="flex items-center justify-between mb-2">
              <span className="text-sm">{item.name}</span>
              <span className="text-xs text-gray-500">${Number(item.price).toFixed(2)}</span>
              <button
                className="ml-2 text-red-500 text-xs hover:underline"
                onClick={() => handleRemove(cat)}
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
        onClick={handleAddCustomPCToCart}
      >
        Add to Cart
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Breadcrumb and Back Button */}
      <div className="w-full mb-4">
        <nav aria-label="breadcrumb" className="mb-2">
          <ol className="breadcrumb flex text-sm text-gray-500 space-x-2">
            <li>
              <a href="/" className="hover:text-orange-500">Home</a>
              <span className="mx-1">/</span>
            </li>
            <li className="text-orange-600 font-semibold">Custom PC</li>
          </ol>
        </nav>
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-600 hover:text-orange-500"
        >
          &larr; Back
        </button>
      </div>
      {/* Left: Selectors */}
      <div className="flex-1">
        {COMPONENTS.map((comp) => (
          <div key={comp.key} className="mb-8">
            <SelectComponent
              items={comp.items}
              title={comp.label}
              onSelect={(id) => handleSelect(comp.key, id)}
              selectedId={selected[comp.key]?.id}
            />
          </div>
        ))}
      </div>
      {/* Right: Summary Box */}
      <div className="w-full md:w-80">
        <SummaryBox />
      </div>
    </div>
  );
}
