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
    <nav className="bg-amber-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand Name */}
          <Link to="/" className="text-2xl font-bold tracking-wide flex items-center gap-2">
            <span>TastyBites</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-amber-200 transition duration-150 font-medium">
              Home
            </Link>

            {user ? (
              <>
                {user.Role === 'Admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1.5 rounded-md text-sm font-medium transition duration-150"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <span className="text-amber-100 text-sm font-medium">
                  Hello, {user.Name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-amber-200 transition duration-150 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-md text-sm font-semibold transition duration-150"
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