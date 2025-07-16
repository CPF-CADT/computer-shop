// src/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';
import { mockProducts } from '../../data/mockData'; // Using the exported mockProducts

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  console.log("CartProvider IS RENDERING (Using mockProducts)");

  const [cartItems, setCartItems] = useState(() => {
    // Initialize cartItems with a *copy* of some items from mockProducts or an empty array
    // This prevents modifying the original mockProducts array if it's used elsewhere for a product listing.
    if (mockProducts && mockProducts.length >= 2) {
      // Create new objects for the cart, ensuring 'qty' is present if not in original mockProduct for listing
      const initialCart = [
        {
          ...mockProducts[0],
          qty: mockProducts[0].qty || 1,
          id: mockProducts[0].product_code, // Ensure unique id
          price: typeof mockProducts[0].price === "object" ? Number(mockProducts[0].price.amount) : Number(mockProducts[0].price),
        },
        {
          ...mockProducts[1],
          qty: mockProducts[1].qty || 1,
          id: mockProducts[1].product_code,
          price: typeof mockProducts[1].price === "object" ? Number(mockProducts[1].price.amount) : Number(mockProducts[1].price),
        },
      ];
      return initialCart;
    } else if (mockProducts && mockProducts.length === 1) {
      return [{
        ...mockProducts[0],
        qty: mockProducts[0].qty || 1,
        id: mockProducts[0].product_code,
        price: typeof mockProducts[0].price === "object" ? Number(mockProducts[0].price.amount) : Number(mockProducts[0].price),
      }];
    }
    return []; // Default to an empty cart
  });

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      if (!Array.isArray(prevItems)) prevItems = [];
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, qty: (item.qty || 0) + 1 } : item
        );
      }
      // When adding a new product, ensure it has a qty property
      return [...prevItems, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      if (!Array.isArray(prevItems)) return [];
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId, newQty) => {
    const quantity = Number(newQty);
    if (isNaN(quantity) || quantity < 0) return;

    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) => {
      if (!Array.isArray(prevItems)) return [];
      return prevItems.map((item) =>
        item.id === productId ? { ...item, qty: quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = Array.isArray(cartItems) ? cartItems.reduce((total, item) => {
    const price = Number(item?.price) || 0;
    const qty = Number(item?.qty) || 0; // Ensure qty is treated as a number
    return total + price * qty;
  }, 0) : 0;

  const itemCount = Array.isArray(cartItems) ? cartItems.reduce((count, item) => {
    const qty = Number(item?.qty) || 0; // Ensure qty is treated as a number
    return count + qty;
  }, 0) : 0;

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined || context === null) {
    console.error('useCart must be used within a CartProvider. Context is currently:', context);
    // Fallback to a default structure to prevent immediate crashes in UI components during development
    // if the provider is accidentally missed.
    return {
        cartItems: [],
        addToCart: () => console.warn("addToCart called without CartProvider"),
        removeFromCart: () => console.warn("removeFromCart called without CartProvider"),
        updateQuantity: () => console.warn("updateQuantity called without CartProvider"),
        clearCart: () => console.warn("clearCart called without CartProvider"),
        cartTotal: 0,
        itemCount: 0
    };
  }
  return context;
};