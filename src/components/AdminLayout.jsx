import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? 'nav-link-active'
      : 'nav-link-inactive';
  };

  return (
    <div className="min-h-screen flex bg-slate-950 -mt-6">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900/60 backdrop-blur-xl border-r border-white/10 p-4 shrink-0 flex flex-col">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6 border-b border-white/10 pb-4">
          Admin Control
        </h2>
        <nav className="space-y-2 flex-grow">
          <Link
            to="/admin/dashboard"
            className={`block px-4 py-2.5 rounded-lg text-sm transition duration-200 ${isActive('/admin/dashboard')}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/menu-items"
            className={`block px-4 py-2.5 rounded-lg text-sm transition duration-200 ${isActive('/admin/menu-items')}`}
          >
            Menu Items
          </Link>
          <Link
            to="/admin/menu-items/add"
            className={`block px-4 py-2.5 rounded-lg text-sm transition duration-200 ${isActive('/admin/menu-items/add')}`}
          >
            Add Menu Item
          </Link>
          <Link
            to="/admin/users"
            className={`block px-4 py-2.5 rounded-lg text-sm transition duration-200 ${isActive('/admin/users')}`}
          >
            Manage Users
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10">
          <Link
            to="/"
            className="block px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-amber-300 hover:bg-white/5 transition duration-200"
          >
            &larr; Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
