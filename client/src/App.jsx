import { Routes, Route, useLocation } from "react-router-dom";
import Head from "./components/Head";
import Nav from "./components/Nav";
import Home from "./components/Home";
import LoginForm from "./components/Login";
import RegisterForm from "./components/Register";
import VerificationCode from "./components/VerificationCode"; 
import ProductDetails from './components/ProductDetails/ProductDetails';
import PCBuilderPage from "./components/CustomPC/PCBuilderPage";
import CartLayout from './components/cart/CartLayout';
import ShoppingCartPage from './components/cart/ShoppingCartPage';
import CheckoutPage from "./components/checkout/CheckoutPage";
import AdminDash from './components/admin/AdminDash';
import UserManagement from './components/admin/UserManagement';
import Success from './components/checkout/Success';
import Service from "./pages/Service";
import Promotion from "./pages/Promotion";
import AboutUs from "./pages/AboutUs";
import Peripherals from "./pages/Peripherals";
import { CartProvider } from './components/cart/CartContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/context/AuthContext';
import { CategoryProvider } from './components/context/CategoryContext';
import UserProfilePage from './components/UserProfilePage';
import SearchPage from './components/SearchPage';
import CategoryProductPage from './components/CategoryProductPage'; 
import Footer from './components/Footer';
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
const VerifyCodePage = () => {
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber; 
  return <VerificationCode phoneNumber={phoneNumber} />;
};


export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <CategoryProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" reverseOrder={false} />
          {!isAdminRoute && <Head />}
          {!isAdminRoute && <Nav />}

          <div className="pt-4 pb-8 mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/verify-code" element={<VerifyCodePage />} />
              <Route path="/category/:categoryName" element={<CategoryProductPage />} />
              <Route path="/product/:productId/detail" element={<ProductDetails />} />
              <Route path="/service" element={<Service />} />
              <Route path="/promotion" element={<Promotion />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/peripherals" element={<Peripherals />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/search/:query?" element={<SearchPage />} />
              <Route path="/build-pc" element={<PCBuilderPage />} />

              <Route element={<CartLayout />}>
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute roles={['customer']}>
                      <ShoppingCartPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute roles={['customer']}>
                      <CheckoutPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/checkout/success"
                  element={
                    <PrivateRoute roles={['customer']}>
                      <Success />
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route
                path="/user/profile/:id"
                element={
                  <PrivateRoute roles={['customer']}>
                    <UserProfilePage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <PrivateRoute roles={['admin','staff']}>
                    <AdminDash />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          <Footer />
        </CartProvider>
      </AuthProvider>
    </CategoryProvider>
  );
}
