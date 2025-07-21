// src/components/checkout/OrderSummaryCheckout.js
import { useCart } from '../cart/CartContext';

const OrderSummaryCheckout = ({ shippingCost = 0, currency = "USD" }) => { // Added currency prop
  const { cartItems, totalPrice: cartTotal } = useCart(); // Use totalPrice from useCart for consistency
  const taxRate = 0; // This is already set to 0, effectively removing tax calculation.
  const taxAmount = cartTotal * taxRate;
  // cartTotal already represents the sum of item.qty * item.price_at_purchase
  // so orderTotal is simply cartTotal before shipping and tax
  const orderSubtotal = cartTotal; // Renamed for clarity, matches CheckoutPage's orderSubtotal

  // Helper to format currency
  const formatCurrency = (amount) => {
    // Ensure amount is a number before calling toFixed
    return `${Number(amount || 0).toFixed(2)} ${currency}`;
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-lg shadow-md sticky top-8"> {/* Adjusted bg-light-bg to bg-white */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2.5">Order Summary</h3> {/* Adjusted h2 to h3, and styling */}
      <div className="max-h-60 overflow-y-auto mb-3 pr-1 space-y-2.5"> {/* Adjusted styling */}
        {cartItems.map(item => (
          // Use item.product_code as key for uniqueness
          <div key={item.product_code} className="flex justify-between items-center text-xs"> {/* Adjusted styling */}
            <div className="flex items-center">
              {/* Use item.image_path as stored in CartContext */}
              <img src={item.product.image_path || 'https://placehold.co/40x40/cccccc/333333?text=No+Image'} alt={item.name} className="w-10 h-10 object-contain rounded mr-2.5 border"/> {/* Adjusted styling */}
              <div>
                <p className="font-medium text-gray-700 leading-tight">{item.product.name} (x{item.qty})</p>
                {/* Correctly use item.price_at_purchase */}
                <p className="text-gray-500">{formatCurrency(item.price_at_purchase)} each</p> {/* Use formatCurrency */}
              </div>
            </div>
            {/* Correctly use item.price_at_purchase for total calculation */}
            <p className="text-gray-600 font-medium">{formatCurrency(item.price_at_purchase * item.qty)}</p> {/* Use formatCurrency */}
          </div>
        ))}
      </div>
      <div className="space-y-1.5 text-sm text-gray-700 mt-4 pt-3 border-t"> {/* Adjusted styling */}
        <div className="flex justify-between"><span>Subtotal:</span><span className="font-medium">{formatCurrency(orderSubtotal)}</span></div> {/* Use formatCurrency */}
        <div className="flex justify-between"><span>Shipping:</span><span className="font-medium">{formatCurrency(shippingCost)}</span></div> {/* Use formatCurrency */}
        <div className="flex justify-between"><span>Tax (Est.):</span><span className="font-medium">{formatCurrency(taxAmount)}</span></div> {/* Use formatCurrency */}
        <div className="flex justify-between font-bold text-gray-800 text-base pt-2.5 border-t mt-2.5"> {/* Adjusted styling */}
          <span>Total:</span><span>{formatCurrency(orderSubtotal + shippingCost + taxAmount)}</span> {/* Calculate total here */}
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCheckout;