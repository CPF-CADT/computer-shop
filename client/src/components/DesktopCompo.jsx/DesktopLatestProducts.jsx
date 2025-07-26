import { latestProducts } from "../../data/mockData";
import ProductCard from "../Product/ProductCard";

export default function DesktopLatestProducts() {

  return (
    <div className="w-64">
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h3 className="font-bold mb-4">Latest Desktop Products</h3>
        <div className="flex flex-col gap-4">
          {latestProducts.map(product => (
            <ProductCard
              key={product.product_code}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
