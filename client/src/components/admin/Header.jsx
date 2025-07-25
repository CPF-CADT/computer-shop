import { MdAccountCircle } from 'react-icons/md';

export default function Header({ user }) {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-orange-600">Admin Panel</h1>
      
      <div className="flex items-center gap-3">
        <MdAccountCircle size={30} className="text-orange-600" />
        <div className="text-sm">
          <div className="font-semibold">{user?.name || 'Staff Name'}</div>
          <div className="text-gray-500 text-xs capitalize">{user?.role || 'staff'}</div>
        </div>
      </div>
    </header>
  );
}
