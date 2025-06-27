import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useCart } from './CartContext'; // <-- fix import

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-center py-4 border-b border-gray-200">
      <img src={item.image} alt={item.name} className="w-24 h-24 object-contain rounded mr-0 mb-3 sm:mr-4 sm:mb-0" />
      <div className="flex-grow text-center sm:text-left">
        <h3 className="font-semibold text-gray-800 text-sm md:text-base">{item.name}</h3>
        <p className="text-xs text-gray-500 truncate-2-lines">{item.description}</p>
         <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-xs mt-1">
          <FaTrash className="inline mr-1" /> Remove
        </button>
      </div>
      <div className="font-semibold text-gray-700 w-20 text-center text-sm md:text-base my-2 sm:my-0">
        ${parseFloat(item.price?.amount ?? item.price).toFixed(2)}
      </div>
      <div className="flex items-center justify-center mx-4 my-2 sm:my-0">
        <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="p-1.5 border rounded hover:bg-gray-100">
          <FaMinus size={12} />
        </button>
        <span className="px-3 py-1 w-10 text-center">{item.qty}</span>
        <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="p-1.5 border rounded hover:bg-gray-100">
          <FaPlus size={12} />
        </button>
      </div>
      <div className="font-bold text-brand-orange w-24 text-center sm:text-right text-sm md:text-base">
        ${(parseFloat(item.price?.amount ?? item.price) * item.qty).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;