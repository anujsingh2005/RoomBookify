import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProviderDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data
  const providerData = {
    name: 'Rajesh Kumar',
    properties: 3,
    activeBookings: 12,
    revenue: 156500,
    occupancyRate: 82,
    udyamStatus: 'not_registered'
  };

  const bookings = [
    {
      id: 1,
      propertyName: 'Ocean View Luxury Hotel',
      guestName: 'Amit Sharma',
      checkIn: '2026-04-10',
      checkOut: '2026-04-15',
      status: 'confirmed',
      revenue: 17500
    },
    {
      id: 2,
      propertyName: 'The Grand PG Residences',
      guestName: 'Priya Singh',
      checkIn: '2026-04-12',
      checkOut: '2026-04-20',
      status: 'confirmed',
      revenue: 12000
    },
    {
      id: 3,
      propertyName: 'Ocean View Luxury Hotel',
      guestName: 'Vikram Patel',
      checkIn: '2026-04-05',
      checkOut: '2026-04-08',
      status: 'checked_out',
      revenue: 10500
    }
  ];

  const properties = [
    { id: 1, name: 'Ocean View Luxury Hotel', type: 'hotel', rooms: 15, occupancy: 80, rating: 4.8 },
    { id: 2, name: 'The Grand PG Residences', type: 'pg', rooms: 8, occupancy: 100, rating: 4.5 },
    { id: 3, name: 'Backpacker Hub Hostel', type: 'hostel', rooms: 20, occupancy: 65, rating: 4.3 }
  ];

  const stats = [
    { label: 'Total Properties', value: providerData.properties, icon: 'box' },
    { label: 'Active Bookings', value: providerData.activeBookings, icon: 'calendar', color: 'blue' },
    { label: 'Occupancy Rate', value: `${providerData.occupancyRate}%`, icon: 'chart', color: 'green' },
    { label: 'Monthly Revenue', value: `₹${(providerData.revenue / 100000).toFixed(1)}L`, icon: 'currency', color: 'amber' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">Welcome back, <span className="font-semibold">{providerData.name}</span></p>
        </div>

        {/* MSME/Udyam Banner */}
        {providerData.udyamStatus === 'not_registered' && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-6 mb-8 text-white shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Complete Your MSME/Udyam Registration</h2>
                  <p className="text-sm text-amber-50">
                    Unlock exclusive benefits: tax incentives, government subsidies, priority support, and increased credibility with guests.
                  </p>
                </div>
              </div>
              <button className="bg-white text-amber-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap flex-shrink-0">
                Register Now
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 card-shadow border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
                  <p className={`text-3xl font-bold ${
                    stat.color === 'blue' ? 'text-royal-blue' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'amber' ? 'text-amber-600' :
                    'text-gray-900'
                  }`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'amber' ? 'bg-amber-100' :
                  'bg-gray-100'
                }`}>
                  <svg className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-royal-blue' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'amber' ? 'text-amber-600' :
                    'text-gray-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {stat.icon === 'box' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4" />}
                    {stat.icon === 'calendar' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                    {stat.icon === 'chart' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                    {stat.icon === 'currency' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
              { id: 'properties', label: 'My Properties', icon: 'home' },
              { id: 'bookings', label: 'Bookings', icon: 'calendar' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'text-royal-blue border-royal-blue'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {bookings.slice(0, 3).map(booking => (
                        <div key={booking.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                          <div className="w-10 h-10 rounded-full bg-royal-blue bg-opacity-10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">New booking from <strong>{booking.guestName}</strong></p>
                            <p className="text-xs text-gray-600 mt-1">₹{booking.revenue} • {booking.propertyName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate('/add-property')}
                        className="btn-primary w-full text-left pl-4 pr-6 py-3 flex items-center justify-between">
                        <span>Add New Property</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigate('/analytics')}
                        className="btn-outline w-full text-left pl-4 pr-6 py-3 flex items-center justify-between">
                        <span>View Analytics</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Properties Tab */}
            {activeTab === 'properties' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
                  <button
                    onClick={() => navigate('/add-property')}
                    className="btn-primary">
                    Add Property
                  </button>
                </div>

                <div className="space-y-4">
                  {properties.map(property => (
                    <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-bold text-gray-900">{property.name}</h3>
                            <span className="badge badge-primary text-xs">
                              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-6 text-sm mb-4">
                            <div>
                              <p className="text-gray-600">Rooms</p>
                              <p className="font-semibold text-gray-900">{property.rooms} rooms</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Occupancy</p>
                              <p className="font-semibold text-green-600">{property.occupancy}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Rating</p>
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-900">{property.rating}</span>
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => navigate(`/edit-property/${property.id}`)}
                            className="btn-secondary text-sm whitespace-nowrap">
                            Edit
                          </button>
                          <button className="btn-outline text-sm whitespace-nowrap">Analytics</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 text-sm">Property</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 text-sm">Guest Name</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 text-sm">Check-in</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 text-sm">Check-out</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 text-sm">Status</th>
                        <th className="text-right py-4 px-4 font-semibold text-gray-900 text-sm">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{booking.propertyName}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{booking.guestName}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{booking.checkIn}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{booking.checkOut}</td>
                          <td className="py-4 px-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              booking.status === 'confirmed'
                                ? 'badge badge-success'
                                : 'badge badge-warning'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-sm font-bold text-royal-blue">₹{booking.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;

