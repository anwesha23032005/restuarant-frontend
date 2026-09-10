import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddMenuItem = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Category: 'Main Course',
    Price: '',
    IsAvailable: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('Name', formData.Name);
      data.append('Description', formData.Description);
      data.append('Category', formData.Category);
      data.append('Price', parseFloat(formData.Price));
      data.append('IsAvailable', formData.IsAvailable);
      
      if (imageFile) {
        data.append('Image', imageFile); // Matches backend multer middleware field name
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      await axios.post('http://localhost:5000/api/menu-items', data, config);

      navigate('/admin/menu-items');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create menu item. Please check backend logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <Link to="/admin/menu-items" className="text-amber-600 hover:underline font-medium text-sm">
          &larr; Back to Menu Items
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Menu Item</h1>
      </div>

      {error && (
        <div className="bg-amber-50 text-amber-700 border border-amber-200 p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
          <input
            type="text"
            name="Name"
            required
            value={formData.Name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="e.g. Garlic Butter Pasta"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="Description"
            rows="3"
            required
            value={formData.Description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Item ingredients and details..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="Category"
              value={formData.Category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Main Course">Main Course</option>
              <option value="Starter">Starter</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="Price"
              required
              value={formData.Price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="12.99"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image from Desktop</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="IsAvailable"
            name="IsAvailable"
            checked={formData.IsAvailable}
            onChange={handleChange}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label htmlFor="IsAvailable" className="text-sm font-medium text-gray-700">
            Available for ordering
          </label>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Link
            to="/admin/menu-items"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium transition duration-150 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Create Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMenuItem;