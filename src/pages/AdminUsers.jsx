import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user?.token}` },
        };
        const response = await axios.get('http://localhost:5000/api/users', config);
        setUsers(response.data || []);
      } catch (err) {
        // Fallback mock data for testing frontend before backend integration
        setUsers([
          {
            _id: 'u1',
            Name: 'Anwesha Admin',
            Email: 'admin@tastybites.com',
            Role: 'Admin',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'u2',
            Name: 'John Doe',
            Email: 'john@example.com',
            Role: 'User',
            createdAt: new Date().toISOString(),
          },
        ]);
        setError(err.response?.data?.message || 'Using mock user records (Backend offline)');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.token]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
      setMessage('User removed successfully.');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      // Mock UI fallback
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setMessage('User removed (Mock mode).');
      setError(err.response?.data?.message || 'Executed mock user removal');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Filter users based on name or email matching the search input
  const filteredUsers = users.filter((u) =>
    u.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-amber-600 font-semibold text-lg">Loading Users...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Registered Users</h1>
        <p className="text-sm text-gray-500">Overview of all system accounts and permissions.</p>
      </div>

      {/* Search Input Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by user name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
        />
      </div>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">
          {message}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 text-sm">
                  No registered users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{u.Name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.Email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.Role === 'Admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.Role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {u._id !== user?._id && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-600 hover:text-red-900 font-semibold"
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
  );
};

export default AdminUsers;