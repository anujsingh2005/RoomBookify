import { useEffect, useState } from 'react';

const initialReviewForm = {
  rating: 5,
  title: '',
  comment: '',
  wifi_rating: 5,
  food_rating: 4,
  cleanliness: 5,
  safety_rating: 5,
  rule_flexibility_rating: 4
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [categorized, setCategorized] = useState({
    upcoming: [],
    current: [],
    completed: [],
    cancelled: []
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeReviewBookingId, setActiveReviewBookingId] = useState(null);
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const [reviewLoading, setReviewLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        'http://localhost:5000/api/user/bookings?limit=50',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }

      setBookings(data.bookings || []);
      setCategorized(data.categorized || {
        upcoming: [],
        current: [],
        completed: [],
        cancelled: []
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      await fetchBookings();
    } catch (error) {
      alert(error.message || 'Failed to cancel booking');
    }
  };

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const submitReview = async (bookingId) => {
    try {
      setReviewLoading(true);

      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...reviewForm,
          booking_id: bookingId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setActiveReviewBookingId(null);
      setReviewForm(initialReviewForm);
      await fetchBookings();
    } catch (error) {
      alert(error.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading bookings...</div>;
  }

  const filters = [
    { id: 'all', label: 'All Bookings', count: bookings.length },
    { id: 'upcoming', label: 'Upcoming', count: categorized.upcoming.length },
    { id: 'current', label: 'Current', count: categorized.current.length },
    { id: 'completed', label: 'Completed', count: categorized.completed.length },
    { id: 'cancelled', label: 'Cancelled', count: categorized.cancelled.length }
  ];

  const displayBookings = activeFilter === 'all' ? bookings : categorized[activeFilter] || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track, manage, and review all your reservations</p>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm text-blue-800">
          Completed stays now support structured liveability reviews, so your feedback helps future users compare Wi-Fi, food, cleanliness, safety, and rule flexibility.
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                activeFilter === filter.id
                  ? 'bg-royal-blue text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-royal-blue'
              }`}
            >
              {filter.label}
              <span className="ml-2 text-sm">({filter.count})</span>
            </button>
          ))}
        </div>

        {displayBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayBookings.map((booking) => {
              const property = booking.room?.property || {};
              const room = booking.room || {};
              const visualStatus =
                booking.status === 'cancelled'
                  ? 'cancelled'
                  : categorized.current.some((item) => item.id === booking.id)
                    ? 'current'
                    : categorized.completed.some((item) => item.id === booking.id)
                      ? 'completed'
                      : 'confirmed';
              const canReview = visualStatus === 'completed' && !booking.review;
              const isReviewOpen = activeReviewBookingId === booking.id;

              return (
                <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-royal-blue hover:shadow-md transition">
                  <div className="grid md:grid-cols-3 gap-4 items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{property.name || 'Property'}</h3>
                      <p className="text-sm text-gray-600 mt-1">{property.address || 'Address unavailable'}</p>
                      <p className="text-sm text-gray-600">{room.room_type || 'Room'}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {property.type && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                            {property.type}
                          </span>
                        )}
                        {property.commute_minutes && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {property.commute_minutes} mins to {property.commute_landmark || 'destination'}
                          </span>
                        )}
                        {property.move_in_assurance && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Move-in assured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">CHECK-IN</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(booking.check_in).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">CHECK-OUT</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(booking.check_out).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between h-full">
                      <div className="text-right">
                        <p className="text-xs text-gray-600 font-medium">TOTAL PRICE</p>
                        <p className="text-2xl font-bold text-royal-blue">Rs. {Number(booking.total_price).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          visualStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                          visualStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                          visualStatus === 'current' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {visualStatus.charAt(0).toUpperCase() + visualStatus.slice(1)}
                        </span>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-xs text-red-600 hover:underline font-medium"
                          >
                            Cancel
                          </button>
                        )}
                        {canReview && (
                          <button
                            onClick={() => {
                              setActiveReviewBookingId(booking.id);
                              setReviewForm(initialReviewForm);
                            }}
                            className="text-xs text-royal-blue hover:underline font-medium"
                          >
                            Add Liveability Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {booking.review && (
                    <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{booking.review.title}</p>
                          <p className="text-sm text-gray-700 mt-1">{booking.review.comment}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-700">
                          {Number(booking.review.rating).toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  )}

                  {isReviewOpen && (
                    <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Share your stay experience</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Overall rating
                          </label>
                          <select
                            name="rating"
                            value={reviewForm.rating}
                            onChange={handleReviewChange}
                            className="input-field"
                          >
                            {[5, 4, 3, 2, 1].map((value) => (
                              <option key={value} value={value}>{value}/5</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Review title
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={reviewForm.title}
                            onChange={handleReviewChange}
                            placeholder="e.g., Great for office commute"
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Comment
                        </label>
                        <textarea
                          name="comment"
                          value={reviewForm.comment}
                          onChange={handleReviewChange}
                          rows="3"
                          placeholder="What was it actually like to live there?"
                          className="input-field"
                        />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                        {[
                          ['wifi_rating', 'Wi-Fi'],
                          ['food_rating', 'Food'],
                          ['cleanliness', 'Cleanliness'],
                          ['safety_rating', 'Safety'],
                          ['rule_flexibility_rating', 'Rule flexibility']
                        ].map(([field, label]) => (
                          <div key={field}>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              {label}
                            </label>
                            <select
                              name={field}
                              value={reviewForm[field]}
                              onChange={handleReviewChange}
                              className="input-field"
                            >
                              {[5, 4, 3, 2, 1].map((value) => (
                                <option key={value} value={value}>{value}/5</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          onClick={() => submitReview(booking.id)}
                          disabled={reviewLoading || !reviewForm.title.trim() || !reviewForm.comment.trim()}
                          className="btn-primary disabled:opacity-60"
                        >
                          {reviewLoading ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                          onClick={() => setActiveReviewBookingId(null)}
                          className="btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Booking ID: <span className="font-mono text-gray-700">{booking.id}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
