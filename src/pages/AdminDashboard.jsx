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
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <div className="text-amber-400 font-semibold text-sm">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-100">
          Admin Dashboard
        </h1>
        <p className="text-slate-400 mt-1">
          Welcome back, <span className="text-amber-300">{user?.Name}</span>! Here is a summary of your system.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex items-center justify-between hover:border-amber-500/20 transition-all duration-300">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Total Menu Items
            </p>
            <h3 className="text-3xl font-bold text-slate-100 mt-1">
              {stats.totalItems}
            </h3>
          </div>
          <div className="w-12 h-12 bg-amber-500/15 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-amber-500/10">
            🍔
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between hover:border-emerald-500/20 transition-all duration-300">
          <div>
            <p className="text-sm font-medium text-slate-400">Items Available</p>
            <h3 className="text-3xl font-bold text-slate-100 mt-1">
              {stats.availableItems}
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/15 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/10">
            ✅
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between hover:border-sky-500/20 transition-all duration-300">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Registered Users
            </p>
            <h3 className="text-3xl font-bold text-slate-100 mt-1">
              {stats.totalUsers}
            </h3>
          </div>
          <div className="w-12 h-12 bg-sky-500/15 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-sky-500/10">
            👥
          </div>
        </div>
      </div>

      {/* Action Shortcuts */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/menu-items/add"
            className="btn-primary px-5 py-2.5 text-sm"
          >
            + Add New Menu Item
          </Link>
          <Link
            to="/admin/menu-items"
            className="btn-secondary px-5 py-2.5 text-sm"
          >
            Manage Menu Items
          </Link>
          <Link
            to="/admin/users"
            className="btn-secondary px-5 py-2.5 text-sm"
          >
            View Registered Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
