import React from 'react';

const logoFiles = [
  "adata.png", "asus.png", "gigabyte.png", "hp.png", "msi.png", "razer.png", "rog.png"
];


function getLogoFile(brandName) {
  const lowerName = brandName.toLowerCase();
  return logoFiles.find(file => lowerName.includes(file.replace('.png', '').toLowerCase()));
}

const brandList = [
  { name: "ADATA" },
  { name: "ROCCAT" },
  { name: "GIGABYTE" },
  { name: "HP" },
  { name: "Thermaltake" },
  { name: "Razer" },
  { name: "MSI" },
  { name: "ASUS" },
  { name: "ROG" },
];

export default function BrandList() {
  return (
    <div>
      <h2 className="font-bold text-lg mb-2">All Brands</h2>
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded shadow">
        {brandList.map((brand) => {
          const logoFile = getLogoFile(brand.name);
          if (!logoFile) return null;
          return (
            <div key={brand.name} className="bg-[#FFA726] px-6 py-3 rounded flex items-center justify-center">
              <img
                src={require(`../../assets/BrandLogo/${logoFile}`)}
                alt={brand.name}
                className="h-16 w-auto object-contain mx-auto"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}