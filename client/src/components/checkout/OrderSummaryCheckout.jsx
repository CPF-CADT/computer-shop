import { useCart } from '../cart/CartContext';

export default function OrderSummaryCheckout({ currency = "USD" }) {
  const { cartItems, totalPrice } = useCart();

  const formatCurrency = (amount) => `${Number(amount || 0).toFixed(2)}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Order Summary</h3>
      
      <div className="max-h-60 overflow-y-auto mb-4 pr-2 space-y-3">
        {cartItems.map(item => (
          <div key={item.product_code} className="flex justify-between items-start text-sm">
            <div className="flex items-start gap-3">
              <img src={item.product.image_path || 'https://placehold.co/40x40'} alt={item.product.name} className="w-12 h-12 object-contain rounded border p-1" />
              <div>
                <p className="font-medium text-gray-800 leading-tight">{item.product.name}</p>
                <p className="text-gray-500">Qty: {item.qty}</p>
              </div>
            </div>
            <p className="text-gray-700 font-medium">${formatCurrency(item.price_at_purchase * item.qty)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm text-gray-700 pt-4 border-t">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">${formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-medium">Free</span>
        </div>
        <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t mt-3">
          <span>Total</span>
          <span>${formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
