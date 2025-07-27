import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useCart } from './CartContext';

export default function CartItem({ item }) {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityUpdate = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item.product_code);
    } else {
      updateCartItem(item.product_code, newQuantity);
    }
  };

  const product = item.product || item;
  const price = item.price_at_purchase || product.price?.amount || 0;
  const image = product.image_path || 'https://placehold.co/100x100/f9f9f9/333333?text=No+Image';

  return (
    <div className="p-4 border-b last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <img
          src={image}
          alt={product.name}
          className="w-24 h-24 object-contain rounded-md bg-gray-50 self-center shrink-0"
        />
        <div className="flex-grow mt-4 sm:mt-0 text-center sm:text-left">
          <h3 className="font-semibold text-gray-800">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1">${Number(price).toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between sm:justify-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleQuantityUpdate(item.qty - 1)}
              className="p-2 border rounded-l-md hover:bg-gray-100 transition"
            >
              <FaMinus size={12} />
            </button>
            <span className="px-4 py-1.5 w-12 text-center border-t border-b font-medium">{item.qty}</span>
            <button
              onClick={() => handleQuantityUpdate(item.qty + 1)}
              className="p-2 border rounded-r-md hover:bg-gray-100 transition"
            >
              <FaPlus size={12} />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-800 w-20 text-right">
              ${(Number(price) * item.qty).toFixed(2)}
            </span>
            <button
              onClick={() => removeFromCart(item.product_code)}
              className="text-gray-400 hover:text-red-500 transition p-2"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
