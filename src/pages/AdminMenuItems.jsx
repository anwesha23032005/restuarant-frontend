import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminMenuItems = () => {
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // 1. Added search state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menu-items');
        setMenuItems(response.data || []);
      } catch (err) {
        // Fallback mock data for testing UI before backend server is connected
        setMenuItems([
          {
            _id: '1',
            Name: 'Margherita Pizza',
            Description: 'Classic fresh tomato sauce, mozzarella, and basil.',
            Category: 'Main Course',
            Price: 12.99,
            IsAvailable: true,
            Image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500',
          },
          {
            _id: '2',
            Name: 'Iced Latte',
            Description: 'Rich espresso poured over cold milk and ice.',
            Category: 'Beverages',
            Price: 4.50,
            IsAvailable: false,
            Image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500',
          },
        ]);
        setError(err.response?.data?.message || 'Using mock menu data (Backend offline)');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      await axios.delete(`http://localhost:5000/api/menu-items/${id}`, config);
      setDeleteSuccess('Item deleted successfully.');
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
      setTimeout(() => setDeleteSuccess(''), 3000);
    } catch (err) {
      // Mock UI fallback for testing before backend is active
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
      setDeleteSuccess('Item deleted (Mock mode).');
      setError(err.response?.data?.message || 'Executed mock item deletion');
      setTimeout(() => setDeleteSuccess(''), 3000);
    }
  };

  // 2. Filter menu items based on name or category matching the search input
  const filteredItems = menuItems.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-amber-600 font-semibold text-lg">Loading Menu Items...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Menu Items</h1>
          <p className="text-sm text-gray-500">View, update, or remove restaurant menu items.</p>
        </div>
        <Link
          to="/admin/menu-items/add"
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md font-medium text-sm transition duration-150"
        >
          + Add New Item
        </Link>
      </div>

      {/* 3. Added Search Input Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by item name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
        />
      </div>

      {deleteSuccess && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">
          {deleteSuccess}
        </div>
      )}

      {error && (
        <div className="bg-amber-50 text-amber-700 border border-amber-200 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* 4. Changed menuItems.length to filteredItems.length */}
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 text-sm">
                  No menu items found.
                </td>
              </tr>
            ) : (
              /* 5. Mapped over filteredItems instead of menuItems */
              filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img src={item.Image} alt={item.Name} className="w-10 h-10 rounded-md object-cover" />
                    <span className="font-medium text-gray-900">{item.Name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.Category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${item.Price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.IsAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.IsAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Link
                      to={`/admin/menu-items/edit/${item._id}`}
                      className="text-amber-600 hover:text-amber-900 font-semibold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
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
  );
};

export default AdminMenuItems;