import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'hotel',
    address: '',
    base_price: '',
    description: '',
    amenities: [],
    latitude: '',
    longitude: '',
    commute_landmark: '',
    commute_minutes: '',
    preferred_for: '',
    move_in_assurance: false,
    assurance_notes: ''
  });

  const amenitiesOptions = [
    { key: 'WiFi', label: 'WiFi' },
    { key: 'meals_included', label: 'Meals Included' },
    { key: 'room_service', label: 'Room Service' },
    { key: 'gym', label: 'Gym' },
    { key: 'swimming_pool', label: 'Swimming Pool' },
    { key: 'spa', label: 'Spa' },
    { key: 'laundry', label: 'Laundry' },
    { key: 'AC', label: 'Air Conditioning' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((activeAmenity) => activeAmenity !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          base_price: parseFloat(formData.base_price),
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          commute_minutes: formData.commute_minutes ? parseInt(formData.commute_minutes, 10) : null
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to add property');
        return;
      }

      alert('Property added successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-600 mt-2">Fill in the details to list your property</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Property Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Ocean View Hotel"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Property Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="hotel">Hotel</option>
                <option value="hostel">Hostel</option>
                <option value="pg">PG</option>
                <option value="room">Guest House</option>
                <option value="flat">Flat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                rows="3"
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Latitude (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g., 19.0760"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Longitude (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g., 72.8777"
                  className="input-field"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 -mt-3">
              Add coordinates if you want the property to appear on the exact spot in the map explorer.
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Base Price per Night (Rs.)
              </label>
              <input
                type="number"
                name="base_price"
                value={formData.base_price}
                onChange={handleChange}
                placeholder="e.g., 3500"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows="4"
                className="input-field"
              />
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Commute-Fit Search</h2>
              <p className="text-sm text-gray-600 mb-4">
                Help users discover this stay by where they need to go every day.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nearby office / college / landmark
                  </label>
                  <input
                    type="text"
                    name="commute_landmark"
                    value={formData.commute_landmark}
                    onChange={handleChange}
                    placeholder="e.g., Manyata Tech Park"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Average commute time (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="commute_minutes"
                    value={formData.commute_minutes}
                    onChange={handleChange}
                    placeholder="e.g., 15"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Best suited for
                </label>
                <select
                  name="preferred_for"
                  value={formData.preferred_for}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select audience</option>
                  <option value="student">Students</option>
                  <option value="working_professional">Working Professionals</option>
                  <option value="intern">Interns</option>
                  <option value="family">Families</option>
                  <option value="traveler">Travelers</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Move-In Assurance</h2>
              <p className="text-sm text-gray-600 mb-4">
                Highlight trust-building support if the stay does not match the listing on arrival.
              </p>

              <label className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3">
                <input
                  type="checkbox"
                  name="move_in_assurance"
                  checked={formData.move_in_assurance}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-900">
                  Offer a move-in assurance badge for this property
                </span>
              </label>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Assurance details
                </label>
                <textarea
                  name="assurance_notes"
                  value={formData.assurance_notes}
                  onChange={handleChange}
                  placeholder="e.g., verified photos, host KYC, room mismatch help within 48 hours"
                  rows="3"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-3">
                {amenitiesOptions.map((amenity) => (
                  <label key={amenity.key} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: formData.amenities.includes(amenity.key) ? '#4169E1' : '#e5e7eb' }}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity.key)}
                      onChange={() => toggleAmenity(amenity.key)}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Property...' : 'Add Property'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProperty;
