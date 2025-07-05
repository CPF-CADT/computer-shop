import  { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

import DashboardPage from './DashboardPage';
import OrdersPage from './OrdersPage';
import ProductsPage from './ProductsPage';
import UserManagement from './UserManagement';

export default function AdminDash() {
    const [activePage, setActivePage] = useState('Dashboard');
    const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Orders':
        return <OrdersPage />;
      case 'Products':
        return <ProductsPage />;
      case 'User Management':
        return <UserManagement />;
      default:
        return <DashboardPage />; 
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}