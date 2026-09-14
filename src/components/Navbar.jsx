import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand Name */}
          <Link to="/" className="text-2xl font-bold tracking-wide flex items-center gap-2 group">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent text-glow-amber group-hover:from-amber-300 group-hover:to-orange-400 transition-all duration-200">
              TastyBites
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="nav-link text-sm">
              Home
            </Link>

            {user ? (
              <>
                {user.Role === 'Admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="btn-primary px-4 py-1.5 text-sm"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <span className="text-slate-400 text-sm font-medium hidden sm:inline">
                  Hello, <span className="text-amber-300">{user.Name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-danger px-4 py-1.5 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-link text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-4 py-1.5 text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
