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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <div className="text-amber-400 font-medium text-sm">
          Loading delicious items...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="bg-cover bg-center bg-no-repeat p-8 sm:p-12 text-center animate-fade-in-up relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl" style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEl65RyyooVZCX-MvF5Ota04UixHCdgRvmkX9mppdasQ4gr__Ga5BUZoU3&s=10')" }}>
        <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent mb-3">
            Welcome to TastyBites
          </h1>
          <p className="text-slate-300 text-lg font-light">
            Order fresh, delicious meals directly from our kitchen.
          </p>

          {/* Search Input Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for pizzas, burgers, pasta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full px-4 py-3 text-sm shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 text-sm glass-card">
            No menu items found matching "{searchTerm}".
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="glass-card overflow-hidden hover:border-amber-500/30 transition-all duration-300 group hover:shadow-amber-500/10 hover:shadow-2xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.Image}
                  alt={item.Name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </div>
              <div className="p-5 flex flex-col justify-between h-48">
                <div>
                  <span className="badge-amber">
                    {item.Category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 mt-2">
                    {item.Name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                    {item.Description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-amber-400 text-glow-amber">
                    ${item.Price.toFixed(2)}
                  </span>
                  <Link
                    to={`/menu/${item._id}`}
                    className="btn-primary px-4 py-2 text-sm"
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
