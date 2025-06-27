// src/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';
import { mockProducts } from '../../data/mockData';
import { mockProducts } from '../../data/mockData';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  console.log("CartProvider IS RENDERING (Using mockProducts)");

  // Track products with stock
  const [products, setProducts] = useState(() =>
    mockProducts.map(p => ({ ...p }))
  );
  // Cart is empty initially
  const [cartItems, setCartItems] = useState([]);

  // Add to cart and decrement stock
  const addToCart = (product, qty = 1) => {
    // Prevent adding unavailable product
    const found = products.find(p => p.product_code === product.product_code);
    if (!found || (typeof found.stock === "number" && found.stock < qty) || qty < 1) return;

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.product_code === product.product_code
          ? { ...p, stock: Math.max(0, (p.stock || 0) - qty) }
          : p
      )
    );
    setCartItems(prevItems => {
      const existing = prevItems.find(i => i.product_code === product.product_code);
      if (existing) {
        // Prevent exceeding available stock
        const maxQty = (found.stock || 0) + (existing.qty || 0);
        const newQty = Math.min((existing.qty || 0) + qty, maxQty);
        if (newQty < 1) return prevItems.filter(i => i.product_code !== product.product_code);
        return prevItems.map(i =>
          i.product_code === product.product_code
            ? { ...i, qty: newQty }
            : i
        );
      }
      // Only add if qty > 0
      if (qty < 1) return prevItems;
      return [
        ...prevItems,
        {
          ...product,
          id: product.product_code,
          product_code: product.product_code,
          qty: Math.min(qty, found.stock || 0),
          price: parseFloat(product.price?.amount ?? product.price),
        },
      ];
    });
  };

  const removeFromCart = (product_code) => {
    const item = cartItems.find(i => i.product_code === product_code);
    if (item) {
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.product_code === product_code
            ? { ...p, stock: (typeof p.stock === "number" ? p.stock : 0) + (item.qty || 0) }
            : p
        )
      );
    }
    setCartItems(prevItems =>
      prevItems.filter(i => i.product_code !== product_code)
    );
  };

  const updateQuantity = (product_code, newQty) => {
    const item = cartItems.find(i => i.product_code === product_code);
    const found = products.find(p => p.product_code === product_code);
    if (!item || !found) return;

    // Clamp newQty between 1 and available stock + current cart qty
    const maxQty = (found.stock || 0) + (item.qty || 0);
    const clampedQty = Math.max(1, Math.min(newQty, maxQty));

    // Calculate the difference to update stock
    const diff = clampedQty - (item.qty || 0);

    setCartItems(prevItems =>
      clampedQty < 1
        ? prevItems.filter(i => i.product_code !== product_code)
        : prevItems.map(i =>
            i.product_code === product_code
              ? { ...i, qty: clampedQty }
              : i
          )
    );
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.product_code === product_code
          ? { ...p, stock: (p.stock || 0) - diff }
          : p
      )
    );
    // If quantity is set to 0, remove from cart
    if (newQty < 1) {
      removeFromCart(product_code);
    }
  };

  // Add itemCount and cartTotal for use in Nav, CartSummary, etc.
  const itemCount = cartItems.reduce((sum, item) => sum + (item.qty || 0), 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.price?.amount ?? item.price) * (item.qty || 0)),
    0
  );

  return (
    <CartContext.Provider value={{
      products,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      itemCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};