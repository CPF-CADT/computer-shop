import { Outlet } from 'react-router-dom';

const CartLayout = () => {
  console.log("CartLayout rendering, CartProvider will wrap Outlet");
  return (
      <Outlet /> 
  );
};

export default CartLayout;