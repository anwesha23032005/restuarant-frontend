import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MOCK_ITEMS = [
  {
    _id: "1",
    Name: "Margherita Pizza",
    Description: "Classic delight with 100% real mozzarella cheese.",
    Price: 12.99,
    Category: "Pizza",
    Image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500",
  },
  {
    _id: "2",
    Name: "Gourmet Cheese Burger",
    Description:
      "Juicy beef patty topped with cheddar cheese and fresh lettuce.",
    Price: 9.99,
    Category: "Burgers",
    Image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
  },
  {
    _id: "3",
    Name: "Creamy Pasta Alfredo",
    Description: "Penne pasta tossed in rich parmesan cream sauce.",
    Price: 11.49,
    Category: "Pasta",
    Image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281288?w=500",
  },
];

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        const response = await axios.get(`${API_BASE_URL}/api/menu-items`);
        setMenuItems(response.data);
      } catch {
        // Fallback to mock items so the UI renders during frontend design
        console.warn("Backend server not reachable. Displaying mock data.");
        setMenuItems(MOCK_ITEMS);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Filter items based on name, description, or category matching the search input
  const filteredItems = menuItems.filter(
    (item) =>
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="text-center py-10 font-medium text-amber-600">
        Loading delicious items...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div
        className="relative rounded-2xl overflow-hidden bg-cover bg-center bg-no-repeat min-h-[340px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="relative p-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
            Welcome to TastyBites
          </h1>
          <p className="text-white/90 text-lg drop-shadow">
            Order fresh, delicious meals directly from our kitchen.
          </p>

          {/* Search Input Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for pizzas, burgers, pasta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm bg-white/90 text-gray-800 shadow-lg placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 text-sm">
            No menu items found matching "{searchTerm}".
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl shadow-md border border-orange-200 overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={item.Image}
                  alt={item.Name}
                  className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex flex-col justify-between h-52">
                <div>
                  <span className="text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-700 rounded-md">
                    {item.Category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-2">
                    {item.Name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {item.Description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-amber-600">
                    ${item.Price.toFixed(2)}
                  </span>
                  <Link
                    to={`/menu/${item._id}`}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
