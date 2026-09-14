import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public & User Pages
import Home from './pages/Home';
import MenuItemDetails from './pages/MenuItemDetails';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminMenuItems from './pages/AdminMenuItems';
import AddMenuItem from './pages/AddMenuItem';
import EditMenuItem from './pages/EditMenuItem';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
          {/* Ambient gradient background */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-600/8 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-slate-700/20 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-6">
              <Routes>
                {/* Public & Customer Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/menu/:id" element={<MenuItemDetails />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />

                {/* Protected Admin Routes with Layout Wrapper & Outlet */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="menu-items" element={<AdminMenuItems />} />
                  <Route path="menu-items/add" element={<AddMenuItem />} />
                  <Route path="menu-items/edit/:id" element={<EditMenuItem />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                </Route>

                {/* Global Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
