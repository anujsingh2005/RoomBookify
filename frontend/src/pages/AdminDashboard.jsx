import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState(null);
  const [properties, setProperties] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsRes = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      const usersRes = await fetch('http://localhost:5000/api/admin/users?limit=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersData = await usersRes.json();
      setUsers(usersData);

      const propertiesRes = await fetch('http://localhost:5000/api/admin/properties?limit=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const propertiesData = await propertiesRes.json();
      setProperties(propertiesData);

      const bookingsRes = await fetch('http://localhost:5000/api/admin/bookings?limit=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading admin dashboard...</div>;
  if (!stats) return <div className="text-center py-12 text-red-600">Error loading dashboard</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage platform, users, and bookings</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.users.providers} providers • {stats.users.seekers} seekers
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{Math.round(stats.revenue.total).toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2">₹{Math.round(stats.revenue.monthly).toLocaleString()} this month</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm mb-2">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{stats.bookings.total}</p>
            <p className="text-xs text-red-600 mt-2">
              {stats.bookings.cancellation_rate}% cancellation rate
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-amber-500">
            <p className="text-gray-600 text-sm mb-2">Properties</p>
            <p className="text-3xl font-bold text-gray-900">{stats.properties.total}</p>
            <p className="text-xs text-gray-500 mt-2">{stats.properties.rooms} rooms total</p>
          </div>
        </div>

        {/* Booking Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm font-medium mb-3">Booking Status</p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Confirmed</span>
                <span className="font-bold text-gray-900">{stats.bookings.confirmed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{
                  width: `${stats.bookings.total > 0 ? (stats.bookings.confirmed / stats.bookings.total * 100) : 0}%`
                }}></div>
              </div>

              <div className="flex justify-between mt-4">
                <span className="text-sm">Completed</span>
                <span className="font-bold text-gray-900">{stats.bookings.completed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{
                  width: `${stats.bookings.total > 0 ? (stats.bookings.completed / stats.bookings.total * 100) : 0}%`
                }}></div>
              </div>

              <div className="flex justify-between mt-4">
                <span className="text-sm">Cancelled</span>
                <span className="font-bold text-gray-900">{stats.bookings.cancelled}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{
                  width: `${stats.bookings.total > 0 ? (stats.bookings.cancelled / stats.bookings.total * 100) : 0}%`
                }}></div>
              </div>
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm font-medium mb-3">User Distribution</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Providers</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-royal-blue h-2 rounded-full" style={{
                      width: `${stats.users.total > 0 ? (stats.users.providers / stats.users.total * 100) : 0}%`
                    }}></div>
                  </div>
                  <span className="text-sm font-bold w-8">{Math.round(stats.users.providers / stats.users.total * 100)}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Seekers</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{
                      width: `${stats.users.total > 0 ? (stats.users.seekers / stats.users.total * 100) : 0}%`
                    }}></div>
                  </div>
                  <span className="text-sm font-bold w-8">{Math.round(stats.users.seekers / stats.users.total * 100)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty Points */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm font-medium mb-3">Loyalty Program</p>
            <p className="text-3xl font-bold text-amber-600 mb-4">
              {Math.round(stats.loyalty_points.total).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Total points distributed across all users</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {['overview', 'users', 'properties', 'bookings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'text-royal-blue border-b-2 border-royal-blue'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && users && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.users.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{u.name}</td>
                      <td className="py-3 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-red-100 text-red-800' :
                          u.role === 'provider' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && properties && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Properties</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Provider</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.properties.map(p => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{p.name}</td>
                      <td className="py-3 px-4 text-gray-600">{p.provider.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && bookings && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4">Guest</th>
                    <th className="text-left py-3 px-4">Property</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.bookings.map(b => (
                    <tr key={b.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{b.user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{b.room.property.name}</td>
                      <td className="py-3 px-4 font-semibold">₹{b.total_price.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          b.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
