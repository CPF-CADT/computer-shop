// src/components/checkout/OrderSummaryCheckout.js
import { useCart } from '../cart/CartContext';

const OrderSummaryCheckout = ({ shippingCost = 0, currency = "USD" }) => { // Added currency prop
  const { cartItems, cartTotal } = useCart();

  const taxRate = 0.07; // Updated to 7% as per CheckoutPage calculation
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal;

  // Helper to format currency
  const formatCurrency = (amount) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-lg shadow-md sticky top-8"> {/* Adjusted bg-light-bg to bg-white */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2.5">Order Summary</h3> {/* Adjusted h2 to h3, and styling */}
      <div className="max-h-60 overflow-y-auto mb-3 pr-1 space-y-2.5"> {/* Adjusted styling */}
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center text-xs"> {/* Adjusted styling */}
            <div className="flex items-center">
              <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded mr-2.5 border"/> {/* Adjusted styling */}
              <div>
                <p className="font-medium text-gray-700 leading-tight">{item.name} (x{item.qty})</p>
                <p className="text-gray-500">{formatCurrency(item.price)} each</p> {/* Use formatCurrency */}
              </div>
            </div>
            <p className="text-gray-600 font-medium">{formatCurrency(item.price * item.qty)}</p> {/* Use formatCurrency */}
          </div>
        ))}
      </div>
      <div className="space-y-1.5 text-sm text-gray-700 mt-4 pt-3 border-t"> {/* Adjusted styling */}
        <div className="flex justify-between"><span>Subtotal:</span><span className="font-medium">{formatCurrency(cartTotal)}</span></div> {/* Use formatCurrency */}
        <div className="flex justify-between"><span>Shipping:</span><span className="font-medium">{formatCurrency(shippingCost)}</span></div> {/* Use formatCurrency */}
        <div className="flex justify-between"><span>Tax (Est.):</span><span className="font-medium">{formatCurrency(taxAmount)}</span></div> {/* Use formatCurrency */}
        <div className="flex justify-between font-bold text-gray-800 text-base pt-2.5 border-t mt-2.5"> {/* Adjusted styling */}
          <span>Total:</span><span>{formatCurrency(orderTotal)}</span> {/* Use formatCurrency */}
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCheckout;