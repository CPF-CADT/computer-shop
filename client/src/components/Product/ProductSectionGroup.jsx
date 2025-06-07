import ProductCard from './ProductCard';

export default function ProductSectionGroup({ leftImage, leftTitle, leftSubtitle, leftLink, products }) {
  return (
    <div className="flex gap-6 mb-10">
      {/* Left: Tall image card */}
      <div className="w-56 min-w-56 h-[340px] rounded-lg overflow-hidden relative flex flex-col justify-between bg-gradient-to-b from-black/80 to-black/40">
        <img
          src={leftImage}
          alt={leftTitle}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-10 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-white text-lg font-bold mb-2">{leftTitle}</h3>
            {leftSubtitle && <div className="text-white text-base font-semibold">{leftSubtitle}</div>}
          </div>
          {leftLink && (
            <a href={leftLink} className="text-white underline text-xs mt-4">
              See All Products
            </a>
          )}
        </div>
      </div>
      {/* Right: Product cards */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
            <ProductCard
            key={idx}
            {...product}
            imgClassName="w-56 h-46 object-contain mx-auto"
          />
        ))}
      </div>
    </div>
  );
}