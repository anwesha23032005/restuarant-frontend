import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-amber-600 text-white font-semibold'
      : 'text-gray-700 hover:bg-amber-100 hover:text-amber-800';
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 shrink-0">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
          Admin Control
        </h2>
        <nav className="space-y-2">
          <Link
            to="/admin/dashboard"
            className={`block px-4 py-2.5 rounded-lg text-sm transition duration-150 ${isActive(
              '/admin/dashboard'
            )}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/menu-items"
            className={`block px-4 py-2.5 rounded-lg text-sm transition duration-150 ${isActive(
              '/admin/menu-items'
            )}`}
          >
            Menu Items
          </Link>
          <Link
            to="/admin/menu-items/add"
            className={`block px-4 py-2.5 rounded-lg text-sm transition duration-150 ${isActive(
              '/admin/menu-items/add'
            )}`}
          >
            Add Menu Item
          </Link>
          <Link
            to="/admin/users"
            className={`block px-4 py-2.5 rounded-lg text-sm transition duration-150 ${isActive(
              '/admin/users'
            )}`}
          >
            Manage Users
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;