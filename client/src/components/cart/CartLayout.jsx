import { Outlet } from 'react-router-dom';
import { CartProvider } from './CartContext'; // Adjust path as needed

const CartLayout = () => {
  console.log("CartLayout rendering, CartProvider will wrap Outlet");
  return (
    <CartProvider>
      {/* You could add specific headers/footers for cart/checkout flow here if needed */}
      <Outlet /> {/* This is where <ShoppingCartPage /> or <CheckoutPage /> will render */}
    </CartProvider>
  );
};

export default CartLayout;