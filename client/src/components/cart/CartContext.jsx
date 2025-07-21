import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { apiService } from '../../service/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(null);

  const customerId = user?.id;

  const fetchCartItems = useCallback(async () => {
    if (!isAuthenticated || !customerId) {
      setCartItems([]);
      setLoadingCart(false);
      return;
    }

    setLoadingCart(true);
    setCartError(null);
    try {
      const data = await apiService.getCartItems(customerId);
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartError(error.message);
      setCartItems([]);
      toast.error("Failed to load cart items.");
    } finally {
      setLoadingCart(false);
    }
  }, [isAuthenticated, customerId]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const addToCart = async (productToAdd) => {
    if (!isAuthenticated || !customerId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    try {
      const existingItem = cartItems.find(item => item.product_code === productToAdd.product_code);

      if (existingItem) {
        const newQty = existingItem.qty + productToAdd.qty;
        await apiService.updateCartItemQuantity(customerId, productToAdd.product_code, newQty);

        setCartItems(prevItems =>
          prevItems.map(item =>
            item.product_code === productToAdd.product_code
              ? { ...item, qty: newQty }
              : item
          )
        );
        toast.success(`Updated quantity for ${productToAdd.name} in cart.`);
      } else {
        await apiService.addToCartItem(
          customerId,
          productToAdd.product_code,
          productToAdd.qty,
          productToAdd.price.amount
        );

        setCartItems(prevItems => [...prevItems, {
          product_code: productToAdd.product_code,
          qty: productToAdd.qty,
          price_at_purchase: productToAdd.price.amount,
          product: {
            name: productToAdd.name,
            image_path: productToAdd.image_path,
          }
        }]);
        toast.success(`${productToAdd.qty} x ${productToAdd.name} added to cart!`);
      }
    } catch (error) {
      console.error("Error adding/updating cart item:", error);
      toast.error(error.message || "Failed to add item to cart.");
      fetchCartItems();
    }
  };

  const updateCartItem = async (productCode, newQty) => {
    if (!isAuthenticated || !customerId) {
      toast.error("Please log in to modify your cart.");
      return;
    }
    if (newQty <= 0) {
      await removeFromCart(productCode);
      return;
    }

    try {
      await apiService.updateCartItemQuantity(customerId, productCode, newQty);
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product_code === productCode
            ? { ...item, qty: newQty }
            : item
        )
      );
      toast.success("Cart item quantity updated.");
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      toast.error(error.message || "Failed to update cart item quantity.");
      fetchCartItems();
    }
  };

  const removeFromCart = async (productCode) => {
    if (!isAuthenticated || !customerId) {
      toast.error("Please log in to modify your cart.");
      return;
    }

    try {
      await apiService.removeCartItem(customerId, productCode);
      setCartItems(prevItems => prevItems.filter(item => item.product_code !== productCode));
      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error(error.message || "Failed to remove item from cart.");
      fetchCartItems();
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.qty * item.price_at_purchase), 0);

  const value = {
    cartItems,
    loadingCart,
    cartError,
    totalItems,
    totalPrice,
    addToCart,
    updateCartItem,
    removeFromCart,
    fetchCartItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  return useContext(CartContext);
};
