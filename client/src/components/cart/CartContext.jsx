// src/context/CartContext.jsx

import { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { apiService } from '../../service/api'; 
import { useAuth } from '../context/AuthContext';

const normalizeCartItem = (apiItem) => {
  if (!apiItem) return null;

  // Ensure price_at_purchase is treated as a number
  const price = Number(apiItem.price_at_purchase);
  const quantity = Number(apiItem.qty);

  return {
    id: apiItem.product_code,
    product_code: apiItem.product_code,
    qty: isNaN(quantity) ? 1 : quantity, 
    price: isNaN(price) ? 0 : price, 
  };
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated, user } = useAuth(); // Get authentication status and user from AuthContext
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [cartError, setCartError] = useState(null);

  // --- DEBUG LOG #1 ---
  console.log('%cCartProvider is Rendering. Current cartItems:', 'color: blue; font-weight: bold;', cartItems);

  // Effect to fetch cart when user authenticates or user changes
  useEffect(() => {
    const fetchUserCart = async () => {
      if (isAuthenticated && user?.id) { // Only fetch if authenticated and user ID is available
        setIsLoadingCart(true);
        setCartError(null);
        console.log(`%cFecthing cart for customer ID: ${user.id}`, 'color: purple; font-weight: bold;');
        try {
          const response = await apiService.getCustoemrCart(user.id);
          console.log('%cAPI Response for cart:', 'color: purple;', response);
          if (Array.isArray(response)) {
            // Normalize API response items to match your cart item structure
            const normalizedItems = response.map(normalizeCartItem).filter(item => item !== null);
            setCartItems(normalizedItems);
            console.log('%cCart fetched and set:', 'color: purple; font-weight: bold;', normalizedItems);
          } else {
            console.warn('API did not return an array for cart items:', response);
            setCartItems([]);
          }
        } catch (error) {
          console.error('Error fetching customer cart:', error);
          setCartError(error.message || 'Failed to load cart items.');
          setCartItems([]); // Clear cart on error
        } finally {
          setIsLoadingCart(false);
        }
      } else {
        // If not authenticated, clear the cart to reflect no user cart
        console.log('%cUser not authenticated or user ID missing, clearing cart.', 'color: red;');
        setCartItems([]);
      }
    };

    fetchUserCart();
  }, [isAuthenticated, user?.id]); // Depend on isAuthenticated and user.id

  const addToCart = useCallback((product) => {
    // --- DEBUG LOG #2 ---
    console.log('%caddToCart called with product:', 'color: green;', product);

    const itemToAdd = normalizeCartItem(product);
    if (!itemToAdd || itemToAdd.price <= 0) {
      console.error("Attempted to add an invalid product to cart:", product);
      return;
    }
    const quantityToAdd = itemToAdd.qty || 1;
    setCartItems((prevItems) => {
      // --- DEBUG LOG #3 ---
      console.log('%cUpdating state. Previous items:', 'color: orange;', prevItems);
      const existingItem = prevItems.find((item) => item.id === itemToAdd.id);
      if (existingItem) {
        const newItems = prevItems.map((item) =>
          item.id === itemToAdd.id
            ? { ...item, qty: item.qty + quantityToAdd }
            : item
        );
        // --- DEBUG LOG #4 ---
        console.log('%cState updated. New items:', 'color: green; font-weight: bold;', newItems);
        return newItems;
      }
      const newItems = [...prevItems, { ...itemToAdd, qty: quantityToAdd }];
      // --- DEBUG LOG #4 ---
      console.log('%cState updated. New items:', 'color: green; font-weight: bold;', newItems);
      return newItems;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQty) => {
    const quantity = Number(newQty);
    if (isNaN(quantity) || quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, qty: quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  }, [cartItems]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.qty, 0);
  }, [cartItems]);

  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    isLoadingCart, // Expose loading state
    cartError,     // Expose error state
  }), [cartItems, cartTotal, itemCount, addToCart, removeFromCart, updateQuantity, clearCart, isLoadingCart, cartError]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};