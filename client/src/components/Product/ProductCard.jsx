import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProductCard({
  productId,
  image,
  title,
  description,
  oldPrice,
  newPrice,
  reviews,
  rating,
  imgClassName,
}) {
  const CardContent = (
    <div className="rounded-md p-5 w-56 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="flex justify-center items-center mb-2">
        <img src={image} alt={title} className={imgClassName ? imgClassName : "w-50 h-48 object-contain"} />
      </div>
      <div className="flex items-center mb-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < rating ? "text-yellow-400" : "text-gray-300"}
            size={16}
          />
        ))}
        <span className="ml-2 text-gray-500 text-sm">Reviews ({reviews})</span>
      </div>
      <div className="font-semibold text-gray-800 text-sm">
        {title} <span className="text-600 text-xs font-bold">| {description}</span>
      </div>
      <div className="text-gray-400 line-through text-sm">${oldPrice}</div>
      <div className="text-2xl font-bold text-black">${newPrice}</div>
      {productId && (
        <div className="mt-2 text-orange-500 text-sm hover:text-orange-600">View Details →</div>
      )}
    </div>
  );

  return productId ? (
    <Link to={`/product/${productId}`}>{CardContent}</Link>
  ) : (
    CardContent
  );
}