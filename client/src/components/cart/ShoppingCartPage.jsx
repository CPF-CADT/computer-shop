import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import CartItem from './CartItem';

export default function ShoppingCartPage() {
  const { cartItems, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const shippingCost = 0.00;
  const taxAmount = 0;

  return (
    <div className="bg-gray-50 p-4 sm:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <FaShoppingCart className="mr-3 text-orange-500" /> Shopping Cart
          </h1>
          <button
            onClick={() => navigate('/')}
            className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 font-medium transition"
          >
            <FaArrowLeft />
            Continue Shopping
          </button>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-2 sm:p-6 rounded-xl shadow-md">
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <CartItem key={item.product_code} item={item} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4">Order Summary</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium">{taxAmount > 0 ? `$${taxAmount.toFixed(2)}` : 'Calculated at checkout'}</span>
                  </div>
                </div>
                <div className="border-t my-4"></div>
                <div className="flex justify-between items-center font-bold text-xl mb-5">
                  <span>Order Total</span>
                  <span>${(totalPrice + shippingCost + taxAmount).toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white p-8 rounded-lg shadow-md">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600 transition"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
