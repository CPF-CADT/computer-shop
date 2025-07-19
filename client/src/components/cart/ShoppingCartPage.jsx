// src/components/cart/ShoppingCartPage.jsx

import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityUpdate = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item.product_code);
    } else {
      updateCartItem(item.product_code, newQuantity);
    }
  };

  return (
    <div className="grid grid-cols-6 gap-4 items-center py-4">
      <div className="col-span-3 flex items-center gap-4">
        {/* FIX: Access image_path and name directly from item */}
        <img src={item.product.image_path || 'https://placehold.co/80x80/cccccc/333333?text=No+Image'} alt={item.product.name} className="w-20 h-20 object-contain rounded-md bg-gray-50" />
        <div>
          <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
        </div>
      </div>

      {/* Price - Use item.price_at_purchase as stored in CartContext */}
      <div className="col-span-1 text-center font-medium text-gray-700">
        ${Number(item.price_at_purchase || 0).toFixed(2)}
      </div>

      {/* Quantity */}
      <div className="col-span-1 flex items-center justify-center">
        <button onClick={() => handleQuantityUpdate(item.qty - 1)} className="p-2 border rounded-l-md hover:bg-gray-100 transition">
          <FaMinus size={12} />
        </button>
        <span className="px-4 py-1.5 w-12 text-center border-t border-b font-medium">{item.qty}</span>
        <button onClick={() => handleQuantityUpdate(item.qty + 1)} className="p-2 border rounded-r-md hover:bg-gray-100 transition">
          <FaPlus size={12} />
        </button>
      </div>

      {/* Total & Remove - Use item.price_at_purchase for calculation */}
      <div className="col-span-1 flex items-center justify-end gap-6">
           <span className="font-bold text-gray-800 text-lg">
             ${(Number(item.price_at_purchase || 0) * item.qty).toFixed(2)}
           </span>
           {/* Use item.product_code for removeFromCart as per CartContext */}
           <button onClick={() => removeFromCart(item.product_code)} className="text-gray-400 hover:text-red-500 transition">
             <FaTrash size={16} />
           </button>
      </div>
    </div>
  );
};


// This is the main page component
const ShoppingCartPage = () => {
  // Destructure totalPrice and totalItems from useCart for consistency
  const { cartItems, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  // Example values, you can make these dynamic
  const shippingCost = cartItems.length > 0 ? 5.00 : 0.00;
  const taxAmount = totalPrice * 0; // Assuming 0% tax for now

  return (
    <div className="bg-gray-50 p-4 sm:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Main Title and Actions */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaShoppingCart className="mr-3 text-orange-500" /> Shopping Cart
            </h1>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 font-medium transition">
                <FaArrowLeft />
                Continue Shopping
            </button>
        </div>

        {/* Check if cartItems is not null/undefined before checking length */}
        {cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items List - Takes 2/3 of the width on large screens */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                {/* Headers */}
                <div className="grid grid-cols-6 gap-4 pb-3 border-b text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <h4 className="col-span-3">Product</h4>
                    <h4 className="col-span-1 text-center">Price</h4>
                    <h4 className="col-span-1 text-center">Quantity</h4>
                    <h4 className="col-span-1 text-right">Total</h4>
                </div>
                {/* Items */}
                <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                        // Use item.product_code as the key for uniqueness
                        <CartItem key={item.product_code} item={item} />
                    ))}
                </div>
            </div>

            {/* Order Summary - Takes 1/3 of the width */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4">Order Summary</h2>

                {/* Price Details */}
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">${shippingCost.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium">{taxAmount > 0 ? `$${taxAmount.toFixed(2)}` : 'Calculated at checkout'}</span>
                  </div>
                </div>

                <div className="border-t my-4"></div>

                {/* Total */}
                <div className="flex justify-between items-center font-bold text-xl mb-5">
                    <span>Order Total</span>
                    <span>${(totalPrice + shippingCost + taxAmount).toFixed(2)}</span>
                </div>

                {/* Call to Action */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-lg font-semibold text-lg hover:bg-orange-600 transition shadow-lg hover:shadow-orange-500/40"
                >
                  Proceed to Checkout
                </button>

                {/* Discount Code */}
                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-600">Have a discount code?</label>
                    <div className="flex mt-1">
                        <input type="text" placeholder="Enter code" className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:ring-orange-500 focus:border-orange-500 text-sm" />
                        <button className="bg-gray-800 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 text-sm font-semibold">Apply</button>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 mb-2">Secure payments with</p>
                    <div className="flex justify-center items-center gap-3">
                        {/* Replace with your actual payment icon components/images */}
                        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-xs">ABA</div>
                        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-xs">VISA</div>
                        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-xs">MC</div>
                    </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          // Empty Cart View
          <div className="text-center py-16 bg-white p-8 rounded-lg shadow-md">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-6">Your shopping cart is empty.</p>
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
};

export default ShoppingCartPage;
