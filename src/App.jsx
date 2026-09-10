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
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
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
      </Router>
    </AuthProvider>
  );
}

export default App;