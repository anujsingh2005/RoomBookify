import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LocationMapExplorer from '../components/LocationMapExplorer';
import PropertyCard from '../components/PropertyCard';
import {
  amenityLabels,
  fetchSearchProperties,
  preferredForLabels,
  preferredForOptions,
  propertyTypeLabels,
  propertyTypeOptions
} from '../lib/propertySearch';

function Results() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceMessage, setSourceMessage] = useState('');
  const [priceCap, setPriceCap] = useState(10000);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [locationInput, setLocationInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');

  const selectedType = searchParams.get('type') || 'all';
  const selectedLocation = searchParams.get('location');
  const selectedDestination = searchParams.get('destination');
  const selectedPreferredFor = searchParams.get('preferredFor') || 'all';
  const selectedMaxCommute = searchParams.get('maxCommute') || 'all';
  const currentView = searchParams.get('view') === 'map' ? 'map' : 'list';
  const activeLocation = !selectedLocation || selectedLocation === 'all' ? '' : selectedLocation;
  const activeDestination = !selectedDestination || selectedDestination === 'all' ? '' : selectedDestination;
  const amenitiesOptions = Object.entries(amenityLabels).map(([key, label]) => ({ key, label }));

  useEffect(() => {
    setLocationInput(activeLocation);
  }, [activeLocation]);

  useEffect(() => {
    setDestinationInput(activeDestination);
  }, [activeDestination]);

  useEffect(() => {
    let isMounted = true;

    const loadProperties = async () => {
      setLoading(true);

      const { properties: loadedProperties, source } = await fetchSearchProperties();

      if (!isMounted) {
        return;
      }

      const highestPrice = loadedProperties.reduce((currentMax, property) => (
        Math.max(currentMax, property.price)
      ), 0);
      const normalizedPriceCap = Math.max(1000, Math.ceil(highestPrice / 500) * 500);

      setProperties(loadedProperties);
      setPriceCap(normalizedPriceCap);
      setPriceRange([0, normalizedPriceCap]);
      setSourceMessage(
        source === 'fallback'
          ? 'Showing seeded demo stays while backend property data is unavailable.'
          : ''
      );
      setLoading(false);
    };

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((previousAmenities) =>
      previousAmenities.includes(amenity)
        ? previousAmenities.filter((activeAmenity) => activeAmenity !== amenity)
        : [...previousAmenities, amenity]
    );
  };

  const updateSearchParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all') {
        nextParams.delete(key);
        return;
      }

      nextParams.set(key, value);
    });

    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSelectedAmenities([]);
    setSortBy('popularity');
    setPriceRange([0, priceCap]);
  };

  const handleLocationSearch = () => {
    updateSearchParams({ location: locationInput.trim() || null });
  };

  const handleDestinationSearch = () => {
    updateSearchParams({ destination: destinationInput.trim() || null });
  };

  const filteredProperties = properties
    .filter((property) => {
      const typeMatch = selectedType === 'all' || property.type === selectedType;
      const locationMatch = !activeLocation ||
        property.city.toLowerCase().includes(activeLocation.toLowerCase()) ||
        property.address.toLowerCase().includes(activeLocation.toLowerCase());
      const destinationMatch = !activeDestination ||
        property.commuteLandmark?.toLowerCase().includes(activeDestination.toLowerCase()) ||
        property.address.toLowerCase().includes(activeDestination.toLowerCase()) ||
        property.city.toLowerCase().includes(activeDestination.toLowerCase());
      const preferredForMatch =
        selectedPreferredFor === 'all' || property.preferredFor === selectedPreferredFor;
      const commuteMatch =
        selectedMaxCommute === 'all' ||
        (property.commuteMinutes && property.commuteMinutes <= parseInt(selectedMaxCommute, 10));
      const priceMatch = property.price >= priceRange[0] && property.price <= priceRange[1];
      const amenitiesMatch =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => property.amenities.includes(amenity));

      return (
        typeMatch &&
        locationMatch &&
        destinationMatch &&
        preferredForMatch &&
        commuteMatch &&
        priceMatch &&
        amenitiesMatch
      );
    })
    .sort((firstProperty, secondProperty) => {
      if (sortBy === 'price_low') {
        return firstProperty.price - secondProperty.price;
      }

      if (sortBy === 'price_high') {
        return secondProperty.price - firstProperty.price;
      }

      if (sortBy === 'rating') {
        return secondProperty.rating - firstProperty.rating;
      }

      if (sortBy === 'commute') {
        const firstCommute = firstProperty.commuteMinutes ?? Number.MAX_SAFE_INTEGER;
        const secondCommute = secondProperty.commuteMinutes ?? Number.MAX_SAFE_INTEGER;
        return firstCommute - secondCommute;
      }

      if (sortBy === 'liveability') {
        return (secondProperty.liveabilityScore || 0) - (firstProperty.liveabilityScore || 0);
      }

      return secondProperty.reviews - firstProperty.reviews;
    });

  const showResetAction = (
    activeLocation ||
    activeDestination ||
    selectedType !== 'all' ||
    selectedPreferredFor !== 'all' ||
    selectedMaxCommute !== 'all' ||
    selectedAmenities.length > 0
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-royal-blue">
                {currentView === 'map' ? 'Map Search' : 'Property Browser'}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentView === 'map' ? 'Explore stays on the map' : 'Browse properties by list'}
              </h1>
              <p className="text-gray-600">
                {activeDestination
                  ? `Optimized for places near ${activeDestination}`
                  : activeLocation
                    ? `Showing stays around ${activeLocation}`
                    : 'Search by city, daily destination, and commute fit to find the right stay faster.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateSearchParams({ view: 'list' })}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  currentView === 'list'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-slate-400'
                }`}
              >
                Browse View
              </button>
              <button
                type="button"
                onClick={() => updateSearchParams({ view: 'map' })}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  currentView === 'map'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-slate-400'
                }`}
              >
                Map View
              </button>
              <button
                type="button"
                onClick={() => updateSearchParams({ type: null })}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedType === 'all'
                    ? 'bg-royal-blue text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                }`}
              >
                All stays
              </button>
              {propertyTypeOptions.map((propertyType) => (
                <button
                  key={propertyType.key}
                  type="button"
                  onClick={() => updateSearchParams({ type: propertyType.key })}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedType === propertyType.key
                      ? 'bg-royal-blue text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {propertyType.label}
                </button>
              ))}
            </div>
          </div>

          {sourceMessage && (
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {sourceMessage}
            </div>
          )}
        </div>

        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr,1.2fr,180px,220px,auto] lg:items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Search by location
              </label>
              <input
                type="text"
                value={locationInput}
                onChange={(event) => setLocationInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleLocationSearch();
                  }
                }}
                placeholder="Type city, area, or locality"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Daily destination
              </label>
              <input
                type="text"
                value={destinationInput}
                onChange={(event) => setDestinationInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleDestinationSearch();
                  }
                }}
                placeholder="Type office, college, or landmark"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Max commute
              </label>
              <select
                value={selectedMaxCommute}
                onChange={(event) => updateSearchParams({ maxCommute: event.target.value })}
                className="input-field"
              >
                <option value="all">Any time</option>
                <option value="10">10 mins</option>
                <option value="15">15 mins</option>
                <option value="20">20 mins</option>
                <option value="30">30 mins</option>
                <option value="45">45 mins</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Best for
              </label>
              <select
                value={selectedPreferredFor}
                onChange={(event) => updateSearchParams({ preferredFor: event.target.value })}
                className="input-field"
              >
                <option value="all">Anyone</option>
                {preferredForOptions.map((option) => (
                  <option key={option.key} value={option.key}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={() => {
                  handleLocationSearch();
                  handleDestinationSearch();
                }}
                className="btn-primary min-w-40"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocationInput('');
                  setDestinationInput('');
                  clearFilters();
                  updateSearchParams({
                    location: null,
                    destination: null,
                    preferredFor: null,
                    maxCommute: null
                  });
                }}
                className="btn-outline min-w-32"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Unique Search
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Search by office, college, metro, or landmark instead of just city names.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Trust Layer
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Compare liveability signals like Wi-Fi, food, safety, cleanliness, and rule flexibility.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Move-In Assurance
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Spot hosts who promise support if the property does not match the listing on arrival.
              </p>
            </div>
          </div>
        </div>

        {currentView === 'map' ? (
          <div className="mb-8">
            <LocationMapExplorer
              properties={filteredProperties}
              selectedCity={activeLocation}
              onCitySelect={(cityName) => updateSearchParams({ location: cityName })}
              onClearSelection={() => updateSearchParams({ location: null })}
            />
          </div>
        ) : (
          <div className="mb-8 rounded-3xl border border-gray-200 bg-gradient-to-r from-slate-900 to-slate-700 p-5 text-white">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
                  Quick Switch
                </p>
                <h2 className="mt-1 text-2xl font-bold">Need map-based discovery?</h2>
                <p className="mt-2 text-sm text-slate-200">
                  Switch to map view to click city pins and compare how close each stay is to your daily destination.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateSearchParams({ view: 'map' })}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900"
              >
                Open Map Explorer
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {activeLocation && (
            <span className="badge badge-primary">
              Area: {activeLocation}
            </span>
          )}
          {activeDestination && (
            <span className="badge badge-primary">
              Destination: {activeDestination}
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="badge badge-primary">
              Type: {propertyTypeLabels[selectedType]}
            </span>
          )}
          {selectedPreferredFor !== 'all' && (
            <span className="badge badge-primary">
              Audience: {preferredForLabels[selectedPreferredFor]}
            </span>
          )}
          {selectedMaxCommute !== 'all' && (
            <span className="badge badge-primary">
              Max commute: {selectedMaxCommute} mins
            </span>
          )}
          {selectedAmenities.map((amenity) => (
            <span key={amenity} className="badge badge-primary">
              {amenityLabels[amenity]}
            </span>
          ))}
          {showResetAction && (
            <button
              type="button"
              onClick={() => {
                setLocationInput('');
                setDestinationInput('');
                clearFilters();
                updateSearchParams({
                  location: null,
                  destination: null,
                  type: null,
                  preferredFor: null,
                  maxCommute: null
                });
              }}
              className="text-sm font-semibold text-royal-blue hover:text-blue-700"
            >
              Reset search
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[290px,minmax(0,1fr)] gap-6">
          <div>
            <div className="bg-white rounded-3xl p-6 sticky top-20 card-shadow border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Refine Results</h2>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Price per Night</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max={priceCap}
                    step="100"
                    value={priceRange[1]}
                    onChange={(event) => setPriceRange([priceRange[0], parseInt(event.target.value, 10)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Rs. {priceRange[0].toLocaleString()}</span>
                    <span>Rs. {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {amenitiesOptions.map((amenity) => (
                    <label key={amenity.key} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity.key)}
                        onChange={() => toggleAmenity(amenity.key)}
                        className="w-4 h-4 text-royal-blue rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="btn-secondary w-full mt-6 text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div>
            <div className="mb-6 flex flex-col gap-3 bg-white p-4 rounded-2xl border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProperties.length}</span> matched properties found
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field max-w-xs text-sm"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="commute">Fastest Commute</option>
                <option value="liveability">Highest Liveability</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((placeholderCard) => (
                  <div key={placeholderCard} className="h-80 rounded-3xl border border-gray-200 bg-white animate-pulse" />
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    name={property.name}
                    type={property.type}
                    price={property.price}
                    location={property.location}
                    rating={property.rating}
                    reviews={property.reviews}
                    images={property.images}
                    liveabilityScore={property.liveabilityScore}
                    commuteLandmark={property.commuteLandmark}
                    commuteMinutes={property.commuteMinutes}
                    preferredFor={property.preferredFor}
                    moveInAssurance={property.moveInAssurance}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Try another city, destination, or a wider commute range.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
