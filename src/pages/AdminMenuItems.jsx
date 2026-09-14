import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminMenuItems = () => {
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        const response = await axios.get(`${API_BASE_URL}/api/menu-items`);
        setMenuItems(response.data || []);
      } catch (err) {
        // Fallback mock data for testing UI before backend server is connected
        setMenuItems([
          {
            _id: "1",
            Name: "Margherita Pizza",
            Description: "Classic fresh tomato sauce, mozzarella, and basil.",
            Category: "Main Course",
            Price: 12.99,
            IsAvailable: true,
            Image:
              "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500",
          },
          {
            _id: "2",
            Name: "Iced Latte",
            Description: "Rich espresso poured over cold milk and ice.",
            Category: "Beverages",
            Price: 4.5,
            IsAvailable: false,
            Image:
              "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500",
          },
        ]);
        setError(
          err.response?.data?.message ||
            "Using mock menu data (Backend offline)",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?"))
      return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.delete(`${API_BASE_URL}/api/menu-items/${id}`, config);
      setDeleteSuccess("Item deleted successfully.");
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
      setTimeout(() => setDeleteSuccess(""), 3000);
    } catch (err) {
      // Mock UI fallback for testing before backend is active
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
      setDeleteSuccess("Item deleted (Mock mode).");
      setError(err.response?.data?.message || "Executed mock item deletion");
      setTimeout(() => setDeleteSuccess(""), 3000);
    }
  };

  // Filter menu items based on name or category matching the search input
  const filteredItems = menuItems.filter(
    (item) =>
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <div className="text-amber-400 font-semibold text-sm">
          Loading Menu Items...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Manage Menu Items
          </h1>
          <p className="text-sm text-slate-400">
            View, update, or remove restaurant menu items.
          </p>
        </div>
        <Link
          to="/admin/menu-items/add"
          className="btn-primary px-4 py-2 text-sm"
        >
          + Add New Item
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by item name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-input w-full md:w-1/3 px-3 py-2 text-sm"
        />
      </div>

      {deleteSuccess && (
        <div className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 p-3 rounded-lg mb-4 text-sm backdrop-blur-md">
          {deleteSuccess}
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
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-500 text-sm"
                  >
                    No menu items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                      <img
                        src={item.Image}
                        alt={item.Name}
                        className="w-10 h-10 rounded-lg object-cover border border-white/10"
                      />
                      <span className="font-medium text-slate-100">
                        {item.Name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {item.Category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-amber-400">
                      ${item.Price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={item.IsAvailable ? "badge-green" : "badge-red"}
                      >
                        {item.IsAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link
                        to={`/admin/menu-items/edit/${item._id}`}
                        className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                      >
                        Delete
                      </button>
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

export default AdminMenuItems;
