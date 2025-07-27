import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

import { MdMenu } from 'react-icons/md';
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
import StaffManagementPage from './StaffManagementPage';

export default function AdminDash() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user?.role;
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    const savedPage = localStorage.getItem('adminActivePage');
    if (savedPage) {
      setActivePage(savedPage);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('adminActivePage', activePage);
    }
  }, [activePage, isLoaded]);

  const renderPage = () => {
    if (!isAdmin && (activePage === 'User Management' || activePage === 'Database Restore')) {
      return <div className="text-red-500 font-semibold">Access Denied</div>;
    }

    switch (activePage) {
      case 'Dashboard': return <DashboardPage />;
      case 'Orders': return <OrdersPage />;
      case 'Products': return <ProductsPage />;
      case 'Customers': return <CustomersPage />;
      case 'Analytics': return <AnalyticsPage />;
      case 'Payments': return <PaymentsPage />;
      case 'Promotions': return <PromotionsPage />;
      case 'Categories': return <CategoryManagement />;
      case 'Inventory': return <InventoryPage />;
      case 'Staff Management': return <StaffManagementPage />;
      case 'User Management': return <UserManagement />;
      case 'Database Restore': return <DatabaseRestore />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} userRole={userRole} />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header user={user} />
        <main className="p-4 lg:p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
