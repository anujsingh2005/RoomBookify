import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyTypeOptions } from '../lib/propertySearch';

function Home() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('hotel');
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('view', 'map');
    params.set('type', selectedType);

    if (location) {
      params.set('location', location);
    }

    if (destination) {
      params.set('destination', destination);
    }

    navigate(`/results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <section className="bg-gradient-to-br from-royal-blue via-blue-500 to-blue-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Connecting You to Your Next Home
            </h1>
            <p className="text-2xl text-blue-100 mb-2 font-semibold">
              Seamless Stays, Endless Options
            </p>
            <p className="text-lg text-blue-100 mb-8">
              Discover, compare, and book the best rooms, hotels, hostels, PGs and flats across the city, now ranked by commute fit and real liveability.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 -mb-8 md:-mb-12 relative z-10">
            <div className="mb-6">
              <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2">
                {propertyTypeOptions.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setSelectedType(type.key)}
                    className={`px-4 py-2.5 rounded font-semibold whitespace-nowrap transition-all ${
                      selectedType === type.key
                        ? 'bg-royal-blue text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City or Area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Daily destination
                </label>
                <input
                  type="text"
                  placeholder="Office, college, metro"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="btn-primary w-full text-lg font-semibold py-3"
                >
                  Search on Map
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Search by city and where you need to go every day, then use the live map to narrow down the exact area.
            </div>
          </div>
        </div>
      </section>

      <div className="h-8 md:h-12"></div>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
            <p className="text-gray-600">Explore accommodations tailored to your travel style</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: 'Luxury Hotels', count: '2,450+', url: '?type=hotel' },
              { name: 'Budget Hostels', count: '1,200+', url: '?type=hostel' },
              { name: 'PG Accommodations', count: '3,100+', url: '?type=pg' },
              { name: 'Guest Houses', count: '940+', url: '?type=room' },
              { name: 'City Flats', count: '1,480+', url: '?type=flat' }
            ].map((category, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/results?view=list&${category.url.replace('?', '')}`)}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-royal-blue cursor-pointer transition-all group text-left"
              >
                <div className="w-12 h-12 bg-royal-blue bg-opacity-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-all">
                  <svg className="w-6 h-6 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-royal-blue transition">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} properties</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Why Choose RoomBookify?</h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We bring fragmented accommodation markets into one unified platform, making it easier than ever to find exactly what you need.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Commute-Fit Search',
                description: 'Search by office, college, metro, or landmark and compare how long it actually takes to get there.',
                icon: 'star'
              },
              {
                title: 'Liveability Score',
                description: 'Structured post-stay feedback highlights Wi-Fi, food, cleanliness, safety, and rule flexibility.',
                icon: 'credit'
              },
              {
                title: 'Move-In Assurance',
                description: 'Stay protected with hosts who promise help if the property does not match the listing on arrival.',
                icon: 'lightning'
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock customer support to help you with any questions.',
                icon: 'headset'
              },
              {
                title: 'Secure Payments',
                description: 'Multiple payment options with SSL encryption and fraud protection.',
                icon: 'lock'
              },
              {
                title: 'Free Cancellation',
                description: 'Most rooms offer free cancellation up to 24 hours before check-in.',
                icon: 'check'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon === 'star' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />}
                    {feature.icon === 'credit' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h4m4 0h4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                    {feature.icon === 'lightning' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                    {feature.icon === 'headset' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />}
                    {feature.icon === 'lock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                    {feature.icon === 'check' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Unlock Your Next Room</h2>
          <p className="text-lg text-gray-600 mb-8">Join the Open Network for Every Stay. Discover, compare, and book the best rooms, hotels, hostels, PGs and flats across the city.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/results?view=list')}
              className="btn-primary text-lg px-8 py-4"
            >
              Find Your Space
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-outline text-lg px-8 py-4"
            >
              Join the Network
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
