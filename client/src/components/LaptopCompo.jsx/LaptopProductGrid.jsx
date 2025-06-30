import ProductCard from "../Product/ProductCard";

export default function LaptopProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.product_code}
          productId={product.product_code}
          image={product.image_path}
          title={product.name}
          description={product.description}
          oldPrice={parseFloat(product.price.amount)}
          newPrice={
            product.discount && product.discount.type === "Percentage"
              ? (parseFloat(product.price.amount) *
                  (1 - parseFloat(product.discount.value) / 100)
                ).toFixed(2)
              : parseFloat(product.price.amount)
          }
          reviews={product.feedback.totalReview}
          rating={parseFloat(product.feedback.rating)}
        />
      ))}
    </div>
  );
}