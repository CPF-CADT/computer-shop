export default function AddToCart({ onAddToCart }) {
  return (
    <button 
      onClick={onAddToCart}
      className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 mb-6 transition-colors"
    >
      Add to Cart
    </button>
  );
}