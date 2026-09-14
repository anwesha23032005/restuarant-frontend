import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AddMenuItem = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Category: "Main Course",
    Price: "",
    IsAvailable: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("Name", formData.Name);
      data.append("Description", formData.Description);
      data.append("Category", formData.Category);
      data.append("Price", parseFloat(formData.Price));
      data.append("IsAvailable", formData.IsAvailable);

      if (imageFile) {
        data.append("Image", imageFile); // Matches backend multer middleware field name
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post(`${API_BASE_URL}/api/menu-items`, data, config);

      navigate("/admin/menu-items");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create menu item. Please check backend logs.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade-in-up">
      <div className="mb-6">
        <Link
          to="/admin/menu-items"
          className="text-amber-400 hover:text-amber-300 font-medium text-sm transition-colors"
        >
          &larr; Back to Menu Items
        </Link>
        <h1 className="text-2xl font-bold text-slate-100 mt-2">
          Add New Menu Item
        </h1>
      </div>

      {error && (
        <div className="bg-amber-500/10 text-amber-300 border border-amber-500/20 p-3 rounded-lg mb-6 text-sm backdrop-blur-md">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="glass-panel p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Item Name
          </label>
          <input
            type="text"
            name="Name"
            required
            value={formData.Name}
            onChange={handleChange}
            className="glass-input w-full px-4 py-2.5"
            placeholder="e.g. Garlic Butter Pasta"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            name="Description"
            rows="3"
            required
            value={formData.Description}
            onChange={handleChange}
            className="glass-input w-full px-4 py-2.5 resize-none"
            placeholder="Item ingredients and details..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <select
              name="Category"
              value={formData.Category}
              onChange={handleChange}
              className="glass-input-select w-full px-4 py-2.5"
            >
              <option value="Main Course" className="bg-slate-800">Main Course</option>
              <option value="Starter" className="bg-slate-800">Starter</option>
              <option value="Dessert" className="bg-slate-800">Dessert</option>
              <option value="Beverages" className="bg-slate-800">Beverages</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="Price"
              required
              value={formData.Price}
              onChange={handleChange}
              className="glass-input w-full px-4 py-2.5"
              placeholder="12.99"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Upload Image from Desktop
          </label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30 file:cursor-pointer file:transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="IsAvailable"
            name="IsAvailable"
            checked={formData.IsAvailable}
            onChange={handleChange}
            className="h-4 w-4 rounded border-white/20 bg-slate-800/50 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
          />
          <label
            htmlFor="IsAvailable"
            className="text-sm font-medium text-slate-300"
          >
            Available for ordering
          </label>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Link
            to="/admin/menu-items"
            className="btn-secondary px-5 py-2.5 text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMenuItem;
