import { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

// Statically import all brand logos
import adataLogo from "../../assets/BrandLogo/adata.png";
import asusLogo from "../../assets/BrandLogo/asus.png";
import gigabyteLogo from "../../assets/BrandLogo/gigabyte.png";
import hpLogo from "../../assets/BrandLogo/hp.png";
import msiLogo from "../../assets/BrandLogo/msi.png";
import razerLogo from "../../assets/BrandLogo/razer.png";
import rogLogo from "../../assets/BrandLogo/rog.png";

// Map logo file names to imported images
const logoImports = {
  "adata.png": adataLogo,
  "asus.png": asusLogo,
  "gigabyte.png": gigabyteLogo,
  "hp.png": hpLogo,
  "msi.png": msiLogo,
  "razer.png": razerLogo,
  "rog.png": rogLogo,
};

const logoFiles = Object.keys(logoImports);

// Helper to match brand name to logo file (case-insensitive, ignore spelling)
function getLogoFile(brandName) {
  const lowerName = brandName.toLowerCase();
  return logoFiles.find((file) =>
    lowerName.includes(file.replace(".png", "").toLowerCase())
  );
}

const brands = [
  "ADATA",
  "ROCCAT",
  "GIGABYTE",
  "HP",
  "Thermaltake",
  "Razer",
  "MSI",
  "ASUS",
  "ROG",
];

// Only show brands with a matching logo file, and avoid duplicates
const filteredBrands = brands
  .map((brand) => {
    const logoFile = getLogoFile(brand);
    return logoFile ? { brand, logoFile } : null;
  })
  .filter(Boolean);

// Double the list for smooth looping
const loopBrands = [...filteredBrands, ...filteredBrands];

export default function BrandingOverlay() {
  const containerRef = useRef(null);
  const x = useRef(0);
  const speed = 1; // Adjust scroll speed

  // Animate manually using requestAnimationFrame for smooth flow
  useAnimationFrame((t, delta) => {
    if (containerRef.current) {
      x.current += speed;
      if (x.current >= 0) {
        x.current = -containerRef.current.scrollWidth / 2;
      }

      containerRef.current.style.transform = `translateX(${x.current}px)`;
    }
  });

  return (
    <div className="overflow-hidden bg-white py-4 shadow-md">
      <div
        className="flex gap-10 whitespace-nowrap will-change-transform"
        ref={containerRef}
        style={{ width: "max-content" }}
      >
        {loopBrands.map(({ brand, logoFile }, index) => (
          <div
            key={logoFile + "-" + index}
            className="inline-block bg-amber-200 px-6 py-2 rounded flex items-center justify-center"
          >
            <img
              src={logoImports[logoFile]}
              alt={brand}
              className="h-8 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
