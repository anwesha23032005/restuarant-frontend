import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MOCK_WISHLIST = [
  {
    _id: '1',
    Name: 'Margherita Pizza',
    Description: 'Classic delight with 100% real mozzarella cheese.',
    Price: 12.99,
    Category: 'Pizza',
    Image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500',
  },
  {
    _id: '2',
    Name: 'Gourmet Cheese Burger',
    Description: 'Juicy beef patty topped with cheddar cheese and fresh lettuce.',
    Price: 9.99,
    Category: 'Burgers',
    Image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
  },
  {
    _id: '3',
    Name: 'Creamy Pasta Alfredo',
    Description: 'Penne pasta tossed in rich parmesan cream sauce.',
    Price: 11.49,
    Category: 'Pasta',
    Image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281288?w=500',
  },
];

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist from localStorage or fall back to mock data
    try {
      const saved = localStorage.getItem('tastybites_wishlist');
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      } else {
        setWishlistItems(MOCK_WISHLIST);
      }
    } catch {
      setWishlistItems(MOCK_WISHLIST);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistWishlist = (items) => {
    setWishlistItems(items);
    localStorage.setItem('tastybites_wishlist', JSON.stringify(items));
  };

  const handleRemove = (id) => {
    persistWishlist(wishlistItems.filter((item) => item._id !== id));
  };

  const handleMoveToCart = (item) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('tastybites_cart') || '[]');
      const cartItem = { ...item, quantity: 1 };
      const existingIndex = existingCart.findIndex((ci) => ci._id === item._id);
      if (existingIndex >= 0) {
        existingCart[existingIndex].quantity += 1;
      } else {
        existingCart.push(cartItem);
      }
      localStorage.setItem('tastybites_cart', JSON.stringify(existingCart));
    } catch {
      // ignore storage errors
    }
    persistWishlist(wishlistItems.filter((i) => i._id !== item._id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <div className="text-amber-400 font-medium text-sm">Loading your wishlist...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">My Wishlist</h1>
          <p className="text-slate-400 text-sm mt-1">
            {wishlistItems.length > 0
              ? `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved`
              : 'Your saved dishes will appear here'}
          </p>
        </div>
        <Link to="/" className="btn-secondary px-4 py-2 text-sm">
          Browse Menu
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center text-3xl">
            🤍
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-2">Your wishlist is empty</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Start exploring our menu and save your favorite dishes to find them quickly later.
          </p>
          <Link to="/" className="btn-primary px-6 py-2.5 text-sm inline-block">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="glass-card overflow-hidden hover:border-amber-500/30 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.Image}
                  alt={item.Name}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <span className="badge-amber">{item.Category}</span>
                  <h3 className="text-lg font-bold text-slate-100 mt-2">{item.Name}</h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{item.Description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-amber-400 text-glow-amber">
                    ${item.Price.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="btn-primary flex-1 px-3 py-2 text-xs"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="btn-secondary px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:border-red-500/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
