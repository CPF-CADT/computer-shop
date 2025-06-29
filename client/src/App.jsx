// src/App.js
import React from 'react';
import { Routes, Route } from "react-router-dom";

import Head from "./components/Head";
import Nav from "./components/Nav";
import Home from "./components/Home";
import LoginForm from "./components/Login";
import RegisterForm from "./components/Register";
import Laptop from "./components/Laptop";
import Desktop from "./components/Desktop";
import ProductDetails from './components/ProductDetails/ProductDetails';

import CartLayout from './components/cart/CartLayout'; 
import ShoppingCartPage from './components/cart/ShoppingCartPage';
import CheckoutPage from "./components/checkout/CheckoutPage";
import { CartProvider } from './components/cart/CartContext'; // <-- use client CartProvider

function App() {
  return (
    <CartProvider>
      <Head /> 
      <Nav />  
      <div className="pt-4 pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/laptop" element={<Laptop />} />
          <Route path="/desktop" element={<Desktop />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route element={<CartLayout />}> 
            <Route path="/cart" element={<ShoppingCartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;