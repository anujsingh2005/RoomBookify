import { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const profileRes = await fetch('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      setUser(profileData);

      const statsRes = await fetch('http://localhost:5000/api/user/statistics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading profile...</div>;
  if (!user) return <div className="text-center py-12 text-red-600">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-royal-blue font-medium mt-1 capitalize">
                    {user.role === 'seeker' ? 'Guest Account' : 'Property Host'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Total Bookings</p>
              <p className="text-3xl font-bold text-royal-blue">{stats.bookings.total}</p>
              <p className="text-xs text-green-600 mt-1">{stats.bookings.completed} completed</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">₹{Math.round(stats.spending.total).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Loyalty Points</p>
              <p className="text-3xl font-bold text-amber-600">{stats.loyalty.points.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1 capitalize">{stats.loyalty.tier}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-2">Referral Earnings</p>
              <p className="text-3xl font-bold text-green-600">{stats.referrals.earnings}</p>
              <p className="text-xs text-gray-600 mt-1">{stats.referrals.completed} referred</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {['overview', 'bookings', 'loyalty', 'settings'].map(tab => (
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

        {/* Overview Tab */}
        {activeTab === 'overview' && user.bookings && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
            {user.bookings.length === 0 ? (
              <p className="text-gray-600">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {user.bookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{booking.room.property.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{booking.total_price.toLocaleString()}</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">All Bookings</h2>
            <p className="text-gray-600">View detailed booking history</p>
          </div>
        )}

        {/* Loyalty Tab */}
        {activeTab === 'loyalty' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Loyalty Program</h2>
            <p className="text-gray-600">Earn points on every booking</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" defaultValue={user.name} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" defaultValue={user.email} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <button className="btn-primary px-6 py-2">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
