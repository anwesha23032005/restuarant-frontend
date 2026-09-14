import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const MenuItemDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if the current logged-in user is an Admin
  const isAdmin = user?.Role === "Admin";

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        const response = await axios.get(`${API_BASE_URL}/api/menu-items/${id}`);
        setItem(response.data);
      } catch (err) {
        // Mock fallback data for testing UI before backend server is connected
        setItem({
          _id: id,
          Name: "Margherita Pizza",
          Description:
            "Classic fresh tomato sauce, creamy mozzarella cheese, and aromatic fresh basil leaves baked to perfection in a stone oven.",
          Category: "Main Course",
          Price: 12.99,
          IsAvailable: true,
          Image:
            "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800",
        });
        setError(
          err.response?.data?.message ||
            "Loaded mock item preview (Backend offline)",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <div className="text-amber-400 font-medium text-sm">
          Loading item details...
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-100">
          Menu item not found
        </h2>
        <Link
          to="/"
          className="text-amber-400 font-medium hover:text-amber-300 mt-4 inline-block transition-colors"
        >
          &larr; Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in-up">
      <Link
        to="/"
        className="text-amber-400 font-medium hover:text-amber-300 text-sm inline-block mb-6 transition-colors"
      >
        &larr; Back to Full Menu
      </Link>

      {error && (
        <div className="bg-amber-500/10 text-amber-300 border border-amber-500/20 p-3 rounded-lg mb-6 text-sm backdrop-blur-md">
          {error}
        </div>
      )}

      <div className="glass-panel overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="h-72 md:h-full w-full relative overflow-hidden">
          <img
            src={item.Image}
            alt={item.Name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="badge-amber">
                {item.Category}
              </span>
              <span
                className={
                  item.IsAvailable ? "badge-green" : "badge-red"
                }
              >
                {item.IsAvailable ? "Available" : "Currently Unavailable"}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-100 mt-3">
              {item.Name}
            </h1>
            <p className="text-2xl font-bold text-amber-400 mt-2 text-glow-amber">
              ${item.Price?.toFixed(2)}
            </p>

            <p className="text-slate-400 mt-4 leading-relaxed text-sm">
              {item.Description}
            </p>
          </div>

          {/* Conditionally render the order section only if the user is NOT an admin */}
          {!isAdmin ? (
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                disabled={!item.IsAvailable}
                className="btn-primary w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
              >
                {item.IsAvailable ? "Order Now" : "Item Unavailable"}
              </button>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-slate-500 text-center italic">
                Admin view mode: Ordering is disabled for administrator
                accounts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetails;
