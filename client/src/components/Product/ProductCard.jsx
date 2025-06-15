import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProductCard({
  image,
  title,
  assetName,
  oldPrice,
  newPrice,
  reviews,
  rating,
  imgClassName,
  to, // new prop for link
}) {
  const CardContent = (
    <div className="rounded-md p-5 w-56 bg-white hover:shadow-lg transition">
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
        {title} <span className="text-600 text-xs font-bold">| {assetName}</span>
      </div>
      <div className="text-gray-400 line-through text-sm">${oldPrice}</div>
      <div className="text-2xl font-bold text-black">${newPrice}</div>
    </div>
  );

  return to ? (
    <Link to={to} className="block">{CardContent}</Link>
  ) : (
    CardContent
  );
}