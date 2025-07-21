// src/components/checkout/OrderSummaryCheckout.js
import { useCart } from '../cart/CartContext';

const OrderSummaryCheckout = ({ shippingCost = 0, currency = "USD" }) => {
  const { cartItems, totalPrice: cartTotal } = useCart();

  const taxRate = 0.07;
  const taxAmount = cartTotal * taxRate;
  const orderSubtotal = cartTotal;

  const formatCurrency = (amount) => {
    return `${Number(amount || 0).toFixed(2)} ${currency}`;
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-lg shadow-md sticky top-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2.5">Order Summary</h3>
      <div className="max-h-60 overflow-y-auto mb-3 pr-1 space-y-2.5">
        {cartItems.map(item => (
          <div key={item.product_code} className="flex justify-between items-center text-xs">
            <div className="flex items-center">
              <img src={item.product.image_path || 'https://placehold.co/40x40/cccccc/333333?text=No+Image'} alt={item.name} className="w-10 h-10 object-contain rounded mr-2.5 border"/>
              <div>
                <p className="font-medium text-gray-700 leading-tight">{item.product.name} (x{item.qty})</p>
                <p className="text-gray-500">{formatCurrency(item.price_at_purchase)} each</p>
              </div>
            </div>
            <p className="text-gray-600 font-medium">{formatCurrency(item.price_at_purchase * item.qty)}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1.5 text-sm text-gray-700 mt-4 pt-3 border-t">
        <div className="flex justify-between"><span>Subtotal:</span><span className="font-medium">{formatCurrency(orderSubtotal)}</span></div>
        <div className="flex justify-between"><span>Shipping:</span><span className="font-medium">{formatCurrency(shippingCost)}</span></div>
        <div className="flex justify-between"><span>Tax (Est.):</span><span className="font-medium">{formatCurrency(taxAmount)}</span></div>
        <div className="flex justify-between font-bold text-gray-800 text-base pt-2.5 border-t mt-2.5">
          <span>Total:</span><span>{formatCurrency(orderSubtotal + shippingCost + taxAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCheckout;
