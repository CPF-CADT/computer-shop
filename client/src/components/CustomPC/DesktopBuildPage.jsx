import React, { useState } from "react";
import { mockPC, mockLaptop } from "../../data/mockData";
import DesktopBuildSelector from "./DesktopBuildSelector";
import DesktopBuildSummary from "./DesktopBuildSummary";

const COMPONENT_CATEGORIES = [
  { key: "motherboard", label: "Motherboard" },
  { key: "cpu", label: "CPU" },
  { key: "gpu", label: "Graphic Card" },
  { key: "ram", label: "Ram" },
  { key: "psu", label: "Power Supply" },
  { key: "fan", label: "Fan" },
  { key: "cooler", label: "Cooler" },
  { key: "case", label: "Case" },
];

export default function DesktopBuildPage() {
  const [selectedComponents, setSelectedComponents] = useState({});

  const handleSelect = (categoryKey, product) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [categoryKey]: product,
    }));
  };

  const handleRemove = (categoryKey) => {
    setSelectedComponents((prev) => {
      const copy = { ...prev };
      delete copy[categoryKey];
      return copy;
    });
  };

  const allProducts = [...mockPC, ...mockLaptop];

  const productsByCategory = {
    motherboard: allProducts.filter((p) => p.name.toLowerCase().includes("motherboard")),
    cpu: allProducts.filter((p) => p.name.toLowerCase().includes("cpu") || p.description.toLowerCase().includes("intel") || p.description.toLowerCase().includes("amd")),
    gpu: allProducts.filter((p) => p.name.toLowerCase().includes("rtx") || p.name.toLowerCase().includes("graphic")),
    ram: allProducts.filter((p) => p.name.toLowerCase().includes("ram")),
    psu: allProducts.filter((p) => p.name.toLowerCase().includes("psu") || p.name.toLowerCase().includes("power")),
    fan: allProducts.filter((p) => p.name.toLowerCase().includes("fan")),
    cooler: allProducts.filter((p) => p.name.toLowerCase().includes("cooler")),
    case: allProducts.filter((p) => p.name.toLowerCase().includes("case")),
  };

  const totalPrice = Object.values(selectedComponents).reduce(
    (sum, item) => sum + (parseFloat(item.price?.amount || item.price) || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-4">
        <nav aria-label="breadcrumb" className="mb-2">
          <ol className="breadcrumb flex text-sm text-gray-500 space-x-2">
            <li>
              <a href="/" className="hover:text-orange-500">Home</a>
              <span className="mx-1">/</span>
            </li>
            <li className="text-orange-600 font-semibold">Custom PC</li>
          </ol>
        </nav>
        <button onClick={() => window.history.back()} className="text-sm text-gray-600 hover:text-orange-500">&larr; Back</button>
      </div>
      <h1 className="text-2xl font-bold mb-2">Custom Your PC</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {COMPONENT_CATEGORIES.map((cat) => (
            <DesktopBuildSelector
              key={cat.key}
              categoryKey={cat.key}
              label={cat.label}
              products={productsByCategory[cat.key] || []}
              selected={selectedComponents[cat.key]}
              onSelect={handleSelect}
            />
          ))}
        </div>
        <div className="w-full md:w-80">
          <DesktopBuildSummary
            selectedComponents={selectedComponents}
            totalPrice={totalPrice}
            onRemove={handleRemove}
          />
        </div>
      </div>
    </div>
  );
}
