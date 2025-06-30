export default function AddToCart({ onAddToCart, disabled }) {
  return (
    <button 
      onClick={onAddToCart}
      disabled={disabled}
      className={`w-full bg-orange-500 text-white py-3 rounded-lg mb-6 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'}`}
    >
      Add to Cart
    </button>
  );
}