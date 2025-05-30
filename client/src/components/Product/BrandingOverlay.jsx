import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";

const brands = [
  "ADATA",
  "ROCCAT",
  "GIGABYTE",
  "HP",
  "Thermaltake",
  "Razer",
  "MSI",
];

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

  const loopBrands = [...brands, ...brands]; // duplicate to ensure seamless loop

  return (
    <div className="overflow-hidden bg-white py-4 shadow-md">
      <div
        className="flex gap-10 whitespace-nowrap will-change-transform"
        ref={containerRef}
        style={{ width: "max-content" }}
      >
        {loopBrands.map((brand, index) => (
          <div
            key={index}
            className="inline-block bg-amber-400 px-6 py-2 text-black font-semibold rounded"
          >
            {brand}
          </div>
        ))}
      </div>
    </div>
  );
}
