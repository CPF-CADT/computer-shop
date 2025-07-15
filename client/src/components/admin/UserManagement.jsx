import AdminManageRole from "./AdminManageRole";
import AdminManagement from "./AdminUserManagement";
import { useState } from "react";
export default function UserManagement() {
    const [activeTab, setActiveTab] = useState('users');
    return (
        <div className="bg-gray-100 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}>User Management</button>
                        <button onClick={() => setActiveTab('roles')} className={`${activeTab === 'roles' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}>Role Management</button>
                    </nav>
                </div>
                <div>
                    {activeTab === 'users' && <AdminManagement />}
                    {activeTab === 'roles' && <AdminManageRole />}
                </div>
            </div>
        </div>
    );
}