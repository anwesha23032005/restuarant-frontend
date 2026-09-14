import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user?.token}` },
        };
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        const response = await axios.get(`${API_BASE_URL}/api/users`, config);
        setUsers(response.data || []);
      } catch (err) {
        // Fallback mock data for testing frontend before backend integration
        setUsers([
          {
            _id: "u1",
            Name: "Anwesha Admin",
            Email: "admin@tastybites.com",
            Role: "Admin",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "u2",
            Name: "John Doe",
            Email: "john@example.com",
            Role: "User",
            createdAt: new Date().toISOString(),
          },
        ]);
        setError(
          err.response?.data?.message ||
            "Using mock user records (Backend offline)",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.token]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.delete(`${API_BASE_URL}/api/users/${userId}`, config);
      setMessage("User removed successfully.");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      // Mock UI fallback
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setMessage("User removed (Mock mode).");
      setError(err.response?.data?.message || "Executed mock user removal");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Filter users based on name or email matching the search input
  const filteredUsers = users.filter(
    (u) =>
      u.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.Email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <div className="text-amber-400 font-semibold text-sm">
          Loading Users...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Registered Users</h1>
        <p className="text-sm text-slate-400">
          Overview of all system accounts and permissions.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by user name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-input w-full md:w-1/3 px-3 py-2 text-sm"
        />
      </div>

      {message && (
        <div className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 p-3 rounded-lg mb-4 text-sm backdrop-blur-md">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-amber-500/10 text-amber-300 border border-amber-500/20 p-3 rounded-lg mb-4 text-sm backdrop-blur-md">
          {error}
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-slate-500 text-sm"
                  >
                    No registered users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-100">{u.Name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {u.Email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={u.Role === "Admin" ? "badge-amber" : "badge-blue"}
                      >
                        {u.Role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {u._id !== user?._id && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
