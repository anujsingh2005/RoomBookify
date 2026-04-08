import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  formatCurrency,
  getLiveabilitySummary,
  preferredForLabels,
  propertyTypeLabels
} from '../lib/propertySearch';

const amenitiesLabels = {
  WiFi: 'Wi-Fi',
  meals_included: 'Free Breakfast',
  room_service: 'Room Service',
  gym: 'Fitness Center',
  swimming_pool: 'Swimming Pool',
  spa: 'Spa',
  laundry: 'Laundry',
  AC: 'Air Conditioning',
  common_kitchen: 'Common Kitchen',
  attached_bathroom: 'Attached Bathroom'
};

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:5000/api/properties/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load property');
      }

      setProperty(data);
    } catch (err) {
      setError(err.message || 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const normalizedRooms = (property?.rooms || []).map((room) => ({
    id: room.id,
    type: room.room_type,
    beds: room.total_beds,
    available: room.available_beds,
    price: Number(room.price_per_night),
    size: room.total_beds > 1 ? `${room.total_beds} bed layout` : 'Private stay'
  }));

  const reviews = Array.isArray(property?.reviews) ? property.reviews : [];
  const reviewCount = reviews.length;
  const liveability = getLiveabilitySummary(reviews);
  const liveabilityMetrics = Object.values(liveability.breakdown);
  const overallRating = reviewCount > 0
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount
    : Number(property?.rating || 4.5);
  const selectedRoomData = normalizedRooms.find((room) => room.id === selectedRoom) || null;
  const displayPrice = selectedRoomData?.price || Number(property?.base_price || 0);

  const handleBooking = async () => {
    if (!token) {
      alert('Please log in to complete your booking.');
      navigate('/login');
      return;
    }

    if (!selectedRoomData) {
      alert('Please select a room type');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          room_id: selectedRoomData.id,
          beds_booked: guests,
          check_in: checkIn,
          check_out: checkOut
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      alert('Booking confirmed successfully. You can now see it in My Bookings.');
      navigate('/my-bookings');
    } catch (err) {
      alert(err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-600">
          Loading property details...
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Unable to load property</h1>
            <p className="text-gray-600 mb-6">{error || 'Property not found'}</p>
            <Link to="/results" className="btn-primary inline-flex">
              Back to Results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-gray-600">
          <Link to="/" className="text-royal-blue hover:underline">Home</Link> /
          <Link to="/results" className="text-royal-blue hover:underline ml-1">Results</Link> /
          <span className="ml-1">{property.name}</span>
        </div>

        <div className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {propertyTypeLabels[property.type] || 'Stay'}
                </span>
                {property.preferred_for && (
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Best for {preferredForLabels[property.preferred_for] || property.preferred_for}
                  </span>
                )}
                {property.move_in_assurance && (
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Move-in assurance
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.name}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {property.address}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-right shadow-sm">
              <div className="flex items-center gap-2 justify-end mb-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${index < Math.floor(overallRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-bold text-gray-900">{overallRating.toFixed(1)}</span>
                <span className="text-gray-600 text-sm">({reviewCount} reviews)</span>
              </div>
              {liveability.score && (
                <p className="text-sm font-semibold text-amber-700">
                  Liveability score: {liveability.score.toFixed(1)}/5
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-300 rounded-lg h-96 mb-8 flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Commute Fit
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {property.commute_minutes ? `${property.commute_minutes} mins` : 'Flexible'}
                </h2>
                <p className="mt-2 text-sm text-gray-700">
                  {property.commute_landmark || 'No landmark shared yet'}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Liveability
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {liveability.score ? `${liveability.score.toFixed(1)}/5` : 'Coming soon'}
                </h2>
                <p className="mt-2 text-sm text-gray-700">
                  Based on tenant feedback for Wi-Fi, food, cleanliness, safety, and rule flexibility.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Move-In Assurance
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {property.move_in_assurance ? 'Protected' : 'Standard'}
                </h2>
                <p className="mt-2 text-sm text-gray-700">
                  {property.assurance_notes || 'This host has not published a move-in assurance promise yet.'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description || 'Comfortable stay with essential amenities and convenient access to nearby city hotspots.'}
              </p>
            </div>

            {liveabilityMetrics.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tenant Liveability Breakdown</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {liveabilityMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">{metric.label}</p>
                        <p className="text-sm font-bold text-amber-700">{metric.score.toFixed(1)}/5</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-amber-400"
                          style={{ width: `${(metric.score / 5) * 100}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Based on {metric.count || reviewCount} verified review{(metric.count || reviewCount) === 1 ? '' : 's'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(property.amenities || []).map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{amenitiesLabels[amenity] || amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Room Types</h2>
              <div className="space-y-4">
                {normalizedRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRoom === room.id
                        ? 'border-royal-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{room.type}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                          <span>{room.beds} bed(s)</span>
                          <span>{room.size}</span>
                          <span className={room.available > 0 ? 'text-green-600 font-medium' : 'text-red-600'}>
                            {room.available > 0 ? `${room.available} available` : 'Full'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(room.price)}</p>
                        <p className="text-sm text-gray-600">/night</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Tenant Reviews</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Verified post-stay feedback focused on real day-to-day living quality.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {reviewCount} review{reviewCount === 1 ? '' : 's'}
                </span>
              </div>

              {reviewCount > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-gray-200 p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
                          <p className="text-sm text-gray-500">
                            {review.guest?.name || 'Verified guest'} • {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                          {Number(review.rating).toFixed(1)}/5 overall
                        </span>
                      </div>
                      <p className="mt-3 text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
                  No tenant liveability reviews yet. The first completed stay review will appear here.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-20 card-shadow border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Property</h2>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{formatCurrency(displayPrice)}</span>
                  <span className="text-gray-600">/night</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Including taxes and fees</p>
              </div>

              <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Daily Fit Summary
                </p>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Commute:</span>{' '}
                    {property.commute_minutes
                      ? `${property.commute_minutes} mins to ${property.commute_landmark || 'your destination'}`
                      : 'Host has not added commute timing yet'}
                  </p>
                  <p>
                    <span className="font-semibold">Liveability:</span>{' '}
                    {liveability.score ? `${liveability.score.toFixed(1)}/5 from verified stays` : 'No liveability score yet'}
                  </p>
                  <p>
                    <span className="font-semibold">Assurance:</span>{' '}
                    {property.move_in_assurance ? 'Protected move-in experience' : 'Standard listing support'}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Number of Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                  className="input-field"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                </select>
              </div>

              <button
                onClick={handleBooking}
                className="btn-primary w-full mb-3 py-3 font-semibold disabled:opacity-60"
                disabled={!selectedRoomData || bookingLoading}
              >
                {bookingLoading
                  ? 'Booking...'
                  : selectedRoomData
                    ? 'Reserve Now'
                    : 'Select a Room Type'}
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-2 text-sm">
                  <svg className="w-5 h-5 text-royal-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-700">
                    <span className="font-semibold">Tip:</span> after booking, your reservation will appear in My Bookings automatically, and you can add a liveability review after checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
