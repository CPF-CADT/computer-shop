import ProductCard from "../Product/ProductCard";

export default function LaptopProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, idx) => (
        <ProductCard key={idx} {...product} />
      ))}
    </div>
  );
}