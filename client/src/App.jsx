// src/App.js
import React from 'react';
import { Routes, Route,useLocation  } from "react-router-dom";

import Head from "./components/Head";
import Nav from "./components/Nav";
import Home from "./components/Home";
import LoginForm from "./components/Login";
import RegisterForm from "./components/Register";
import Laptop from "./components/Laptop";
import Desktop from "./components/Desktop";
import ProductDetails from './components/ProductDetails/ProductDetails';
import PCBuilderPage from "./components/CustomPC/PCBuilderPage";
import Categories from "./components/Categories";
import CartLayout from './components/cart/CartLayout'; 
import ShoppingCartPage from './components/cart/ShoppingCartPage';
import CheckoutPage from "./components/checkout/CheckoutPage";
import AdminDash from './components/admin/AdminDash';
import UserManagement from './components/admin/UserManagement';
import Khqr from './components/checkout/khqr';
import Success from './components/checkout/Success';
import Service from "./pages/Service";
import Promotion from "./pages/Promotion";
import AboutUs from "./pages/AboutUs";
import Peripherals from "./pages/Peripherals";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdminRoute && <Head />}
      {!isAdminRoute && <Nav />}
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
            <Route path="/build-pc" element={<PCBuilderPage />} />
            <Route path="/custom-pc" element={<CustomPCPageWrapper />} />
            <Route path="/service" element={<Service />} />
            <Route path="/promotion" element={<Promotion />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/peripherals" element={<Peripherals />} />
        </Routes>
      </div>
    </>
  );
}

function CustomPCPageWrapper() {
  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="mb-2">
          <button
            onClick={() => window.history.back()}
            className="inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-semibold"
          >
            &larr; Back
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-4">Custom PC / Desktop Building</h1>
        <PCBuilderPage />
      </div>
    </div>
  );
}

export default App;