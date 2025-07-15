import  { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

import DashboardPage from './DashboardPage';
import OrdersPage from './OrdersPage';
import ProductsPage from './ProductsPage';
import UserManagement from './UserManagement';
import DatabaseRestore from './DatabaseRestore';
import CustomersPage from './CustomersPage';
import AnalyticsPage from './AnalyticsPage';
import PaymentsPage from './PaymentsPage';
import PromotionsPage from './PromotionsPage';
import CategoryManagement from './CategoryManagement';
import InventoryPage from './InventoryPage';

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
      case 'Customers':
        return <CustomersPage />;
      case 'Analytics':
        return <AnalyticsPage />;
      case 'Payments':
        return <PaymentsPage />;
      case 'Promotions':
        return <PromotionsPage />;
      case 'Categories':
        return <CategoryManagement />;
      case 'Inventory':
        return <InventoryPage />;
      case 'User Management':
        return <UserManagement />;
      case 'Database Restore': 
        return <DatabaseRestore />;
      default:
        return <DashboardPage />; 
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="p-4 lg:p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}