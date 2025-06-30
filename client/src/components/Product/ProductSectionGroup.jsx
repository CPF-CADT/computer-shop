import ProductCard from './ProductCard';

function ProductSectionGroup({ leftImage, leftTitle, leftSubtitle, leftLink, products }) {
  return (
    <div className="flex gap-6 mb-10">
      {/* ...left card... */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={product.product_code || idx}
            productId={product.product_code}
            image={product.image_path}
            title={product.name}
            description={product.description}
            oldPrice={parseFloat(product.price.amount)}
            newPrice={
              product.discount && product.discount.type === "Percentage"
                ? (parseFloat(product.price.amount) * (1 - parseFloat(product.discount.value) / 100)).toFixed(2)
                : parseFloat(product.price.amount)
            }
            reviews={product.feedback.totalReview}
            rating={parseFloat(product.feedback.rating)}
            imgClassName="w-56 h-46 object-contain mx-auto"
          />
        ))}
      </div>
    </div>
  );
}

export default ProductSectionGroup;