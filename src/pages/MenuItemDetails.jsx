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
      <div className="flex justify-center items-center h-64">
        <div className="text-amber-600 font-semibold text-lg">
          Loading item details...
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">
          Menu item not found
        </h2>
        <Link
          to="/"
          className="text-amber-600 font-medium hover:underline mt-4 inline-block"
        >
          &larr; Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link
        to="/"
        className="text-amber-600 font-medium hover:underline text-sm inline-block mb-6"
      >
        &larr; Back to Full Menu
      </Link>

      {error && (
        <div className="bg-amber-50 text-amber-700 border border-amber-200 p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="h-72 md:h-full w-full">
          <img
            src={item.Image}
            alt={item.Name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                {item.Category}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  item.IsAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.IsAvailable ? "Available" : "Currently Unavailable"}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mt-3">
              {item.Name}
            </h1>
            <p className="text-2xl font-bold text-amber-600 mt-2">
              ${item.Price?.toFixed(2)}
            </p>

            <p className="text-gray-600 mt-4 leading-relaxed">
              {item.Description}
            </p>
          </div>

          {/* Conditionally render the order section only if the user is NOT an admin */}
          {!isAdmin ? (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                disabled={!item.IsAvailable}
                className="w-full py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {item.IsAvailable ? "Order Now" : "Item Unavailable"}
              </button>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center italic">
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
