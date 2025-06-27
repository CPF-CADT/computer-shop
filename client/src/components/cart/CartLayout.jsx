import { Outlet } from 'react-router-dom';

const CartLayout = () => {
  console.log("CartLayout rendering");
  return (
    <>
      {/* You could add specific headers/footers for cart/checkout flow here if needed */}
      <Outlet /> {/* This is where <ShoppingCartPage /> or <CheckoutPage /> will render */}
    </>
  );
};

export default CartLayout;