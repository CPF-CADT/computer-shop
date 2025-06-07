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

import CartLayout from './components/cart/CartLayout'; 
import ShoppingCartPage from './components/cart/ShoppingCartPage';
import CheckoutPage from "./components/checkout/CheckoutPage";
// import OrderConfirmation from './components/checkout/OrderConfirmationPage'; // Assuming you create this

function App() {
  return (
    <>
      <Head /> 
      <Nav />  
      <div className="pt-4 pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/laptop" element={<Laptop />} />
        <Route path="/desktop" element={<Desktop />} />
        <Route element={<CartLayout />}> 
          <Route path="/cart" element={<ShoppingCartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
      </div>
    </>
  );
}

export default App;