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
import AdminDash from './components/admin/AdminDash';
import UserManagement from './components/admin/UserManagement';
import Khqr from './components/checkout/khqr';
import Success from './components/checkout/Success';
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
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route element={<CartLayout />}> 
            <Route path="/cart" element={<ShoppingCartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<div><AdminDash/></div>} />
            <Route path="/admin/user-manage" element={<div><UserManagement /></div>} /></Route>
            <Route path="/khqr" element={<Khqr/>} />
            <Route path="/khqr/success" element={<Success/>} />
            
        </Routes>
      </div>
    </>
  );
}

export default App;