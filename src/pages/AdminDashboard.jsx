import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalUsers: 0,
    availableItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const config = user.token
          ? {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          : {};

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        const [itemsRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/menu-items`, config),
          axios.get(`${API_BASE_URL}/api/users`, config),
        ]);

        const items = itemsRes.data || [];
        const users = usersRes.data || [];

        setStats({
          totalItems: items.length,
          totalUsers: users.length,
          availableItems: items.filter((item) => item.IsAvailable).length,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-amber-600 font-semibold text-lg">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.Name}! Here is a summary of your system.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Menu Items
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {stats.totalItems}
            </h3>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-xl">
            🍔
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Items Available</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {stats.availableItems}
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
            ✅
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Registered Users
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {stats.totalUsers}
            </h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
            👥
          </div>
        </div>
      </div>

      {/* Action Shortcuts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/menu-items/add"
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2 rounded-lg transition duration-150"
          >
            + Add New Menu Item
          </Link>
          <Link
            to="/admin/menu-items"
            className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-lg transition duration-150"
          >
            Manage Menu Items
          </Link>
          <Link
            to="/admin/users"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg transition duration-150"
          >
            View Registered Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
