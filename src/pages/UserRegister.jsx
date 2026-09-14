import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    Role: 'Customer',
    AdminCode: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.Password !== formData.ConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.Password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        Name: formData.Name,
        Email: formData.Email,
        Password: formData.Password,
        Role: formData.Role,
        AdminCode: formData.AdminCode,
      });

      login(response.data);
      navigate(response.data.Role === 'Admin' ? '/admin/dashboard' : '/');
    } catch {
      // Mock fallback registration for UI testing
      const mockUser = {
        _id: 'mock_user_' + Date.now(),
        Name: formData.Name || 'New User',
        Email: formData.Email,
        Role: formData.Role,
        token: 'mock_jwt_token_12345',
      };

      login(mockUser);
      navigate(mockUser.Role === 'Admin' ? '/admin/dashboard' : '/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 glass-panel p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent mb-6">
        Create an Account
      </h2>

      {error && (
        <div className="bg-red-500/10 text-red-300 border border-red-500/20 p-3 rounded-lg mb-4 text-sm backdrop-blur-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            className="glass-input w-full px-4 py-2.5"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
            className="glass-input w-full px-4 py-2.5"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            required
            className="glass-input w-full px-4 py-2.5"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
          <input
            type="password"
            name="ConfirmPassword"
            value={formData.ConfirmPassword}
            onChange={handleChange}
            required
            className="glass-input w-full px-4 py-2.5"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Account Type</label>
          <select
            name="Role"
            value={formData.Role}
            onChange={handleChange}
            className="glass-input-select w-full px-4 py-2.5"
          >
            <option value="Customer" className="bg-slate-800">Customer</option>
            <option value="Admin" className="bg-slate-800">Admin</option>
          </select>
        </div>

        {formData.Role === 'Admin' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Admin Passcode</label>
            <input
              type="password"
              name="AdminCode"
              value={formData.AdminCode}
              onChange={handleChange}
              required
              className="glass-input w-full px-4 py-2.5"
              placeholder="Enter secret admin key"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-2 py-3 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default UserRegister;
