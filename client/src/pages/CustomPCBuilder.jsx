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
} from "../data/mockData";
import SelectComponent from "../components/CustomPC/SelectComponent";

export default function CustomPCBuilder() {
  const [selected, setSelected] = useState({
    cpu: null,
    gpu: null,
    motherboard: null,
    ram: null,
    psu: null,
    cooler: null,
    case: null,
    fan: null,
  });

  const handleSelect = (type, id) => {
    setSelected((prev) => ({ ...prev, [type]: id }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Build Your Custom PC</h1>
      <div className="space-y-10">
        <SelectComponent
          items={builderCPUs}
          title="Select CPU"
          selectedId={selected.cpu}
          onSelect={(id) => handleSelect("cpu", id)}
        />
        <SelectComponent
          items={builderMotherboards}
          title="Select Motherboard"
          selectedId={selected.motherboard}
          onSelect={(id) => handleSelect("motherboard", id)}
        />
        <SelectComponent
          items={builderGPUs}
          title="Select GPU"
          selectedId={selected.gpu}
          onSelect={(id) => handleSelect("gpu", id)}
        />
        <SelectComponent
          items={builderRAMs}
          title="Select RAM"
          selectedId={selected.ram}
          onSelect={(id) => handleSelect("ram", id)}
        />
        <SelectComponent
          items={builderPSUs}
          title="Select Power Supply"
          selectedId={selected.psu}
          onSelect={(id) => handleSelect("psu", id)}
        />
        <SelectComponent
          items={builderCoolers}
          title="Select Cooler"
          selectedId={selected.cooler}
          onSelect={(id) => handleSelect("cooler", id)}
        />
        <SelectComponent
          items={builderCases}
          title="Select Case"
          selectedId={selected.case}
          onSelect={(id) => handleSelect("case", id)}
        />
        <SelectComponent
          items={builderFans}
          title="Select Fan"
          selectedId={selected.fan}
          onSelect={(id) => handleSelect("fan", id)}
        />
      </div>
      {/* You can add a summary and "Add to Cart" button here */}
    </div>
  );
}
