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
import PCBuilderSelector from "./PCBuilderSelector";
import PCBuilderSummary from "./PCBuilderSummary";

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

export default function PCBuilderPage() {
  const [selected, setSelected] = useState({});

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

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Left: Selectors */}
      <div className="flex-1">
        {COMPONENTS.map((comp) => (
          <div key={comp.key} className="mb-8">
            <PCBuilderSelector
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
        <PCBuilderSummary
          selectedList={selectedList}
          totalPrice={totalPrice}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}
