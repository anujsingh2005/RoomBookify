const API_BASE_URL = 'http://localhost:5000/api';

const CITY_COORDINATE_ENTRIES = [
  { name: 'Mumbai', aliases: ['mumbai'], latitude: 19.076, longitude: 72.8777 },
  { name: 'Bangalore', aliases: ['bangalore', 'bengaluru'], latitude: 12.9716, longitude: 77.5946 },
  { name: 'Delhi', aliases: ['delhi', 'new delhi'], latitude: 28.6139, longitude: 77.209 },
  { name: 'Pune', aliases: ['pune'], latitude: 18.5204, longitude: 73.8567 },
  { name: 'Hyderabad', aliases: ['hyderabad'], latitude: 17.385, longitude: 78.4867 },
  { name: 'Chennai', aliases: ['chennai'], latitude: 13.0827, longitude: 80.2707 },
  { name: 'Kolkata', aliases: ['kolkata', 'calcutta'], latitude: 22.5726, longitude: 88.3639 },
  { name: 'Goa', aliases: ['goa', 'panaji'], latitude: 15.4909, longitude: 73.8278 },
  { name: 'Noida', aliases: ['noida'], latitude: 28.5355, longitude: 77.391 },
  { name: 'Jaipur', aliases: ['jaipur'], latitude: 26.9124, longitude: 75.7873 }
];

const TYPE_COORDINATE_OFFSETS = {
  hotel: { latitude: 0.14, longitude: 0.16 },
  hostel: { latitude: 0.2, longitude: -0.16 },
  pg: { latitude: -0.18, longitude: 0.12 },
  room: { latitude: -0.08, longitude: -0.22 },
  flat: { latitude: 0.05, longitude: -0.28 }
};

const LIVEABILITY_FIELDS = [
  { key: 'wifi_rating', label: 'Wi-Fi' },
  { key: 'food_rating', label: 'Food' },
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'safety_rating', label: 'Safety' },
  { key: 'rule_flexibility_rating', label: 'Rule flexibility' }
];

export const propertyTypeLabels = {
  hotel: 'Hotel',
  hostel: 'Hostel',
  pg: 'PG',
  room: 'Guest House',
  flat: 'Flat'
};

export const propertyTypeOptions = [
  { key: 'hotel', label: 'Hotels' },
  { key: 'pg', label: 'PGs' },
  { key: 'hostel', label: 'Hostels' },
  { key: 'room', label: 'Guest Houses' },
  { key: 'flat', label: 'Flats' }
];

export const preferredForLabels = {
  student: 'Students',
  working_professional: 'Working Professionals',
  intern: 'Interns',
  family: 'Families',
  traveler: 'Travelers'
};

export const preferredForOptions = [
  { key: 'student', label: preferredForLabels.student },
  { key: 'working_professional', label: preferredForLabels.working_professional },
  { key: 'intern', label: preferredForLabels.intern },
  { key: 'family', label: preferredForLabels.family },
  { key: 'traveler', label: preferredForLabels.traveler }
];

export const amenityLabels = {
  WiFi: 'WiFi',
  meals_included: 'Meals Included',
  room_service: 'Room Service',
  gym: 'Gym',
  laundry: 'Laundry',
  AC: 'Air Conditioning',
  swimming_pool: 'Swimming Pool',
  spa: 'Spa',
  common_kitchen: 'Common Kitchen',
  attached_bathroom: 'Attached Bathroom'
};

const fallbackProperties = [
  {
    id: 1,
    name: 'Ocean View Luxury Hotel',
    type: 'hotel',
    address: '123 Marine Drive, Mumbai, Maharashtra 400020',
    base_price: 3500,
    rating: 4.8,
    reviews: 312,
    amenities: ['WiFi', 'meals_included', 'room_service', 'gym', 'AC'],
    images: 5,
    latitude: 19.078,
    longitude: 72.8798,
    commute_landmark: 'Nariman Point offices',
    commute_minutes: 14,
    preferred_for: 'working_professional',
    move_in_assurance: true,
    assurance_notes: 'Verified check-in, first 48-hour relocation help, and host KYC.',
    liveabilityScore: 4.7,
    liveabilityBreakdown: {
      wifi_rating: { label: 'Wi-Fi', score: 4.8 },
      food_rating: { label: 'Food', score: 4.4 },
      cleanliness: { label: 'Cleanliness', score: 4.9 },
      safety_rating: { label: 'Safety', score: 4.9 },
      rule_flexibility_rating: { label: 'Rule flexibility', score: 4.3 }
    }
  },
  {
    id: 2,
    name: 'Marine Stay Studio Flats',
    type: 'flat',
    address: '14 Colaba Causeway, Mumbai, Maharashtra 400005',
    base_price: 2800,
    rating: 4.6,
    reviews: 118,
    amenities: ['WiFi', 'AC', 'laundry'],
    images: 4,
    latitude: 18.9217,
    longitude: 72.8331,
    commute_landmark: 'World Trade Centre',
    commute_minutes: 11,
    preferred_for: 'intern',
    move_in_assurance: true,
    assurance_notes: 'Move-in inventory checks and same-day issue resolution.',
    liveabilityScore: 4.5,
    liveabilityBreakdown: {
      wifi_rating: { label: 'Wi-Fi', score: 4.6 },
      cleanliness: { label: 'Cleanliness', score: 4.5 },
      safety_rating: { label: 'Safety', score: 4.7 }
    }
  },
  {
    id: 3,
    name: 'The Grand PG Residences',
    type: 'pg',
    address: '456 Tech Park, Bangalore, Karnataka 560001',
    base_price: 1500,
    rating: 4.5,
    reviews: 156,
    amenities: ['WiFi', 'meals_included', 'laundry', 'AC'],
    images: 3,
    latitude: 12.9759,
    longitude: 77.6069,
    commute_landmark: 'Manyata Tech Park',
    commute_minutes: 18,
    preferred_for: 'student',
    move_in_assurance: true,
    assurance_notes: 'Deposit-support desk and room mismatch escalation.',
    liveabilityScore: 4.4,
    liveabilityBreakdown: {
      wifi_rating: { label: 'Wi-Fi', score: 4.3 },
      food_rating: { label: 'Food', score: 4.2 },
      cleanliness: { label: 'Cleanliness', score: 4.4 },
      safety_rating: { label: 'Safety', score: 4.7 },
      rule_flexibility_rating: { label: 'Rule flexibility', score: 4.2 }
    }
  },
  {
    id: 4,
    name: 'Backpacker Hub Hostel',
    type: 'hostel',
    address: '789 Main Street, Delhi, Delhi 110001',
    base_price: 800,
    rating: 4.3,
    reviews: 428,
    amenities: ['WiFi', 'common_kitchen', 'laundry'],
    images: 4,
    latitude: 28.6329,
    longitude: 77.2195,
    commute_landmark: 'Connaught Place metro',
    commute_minutes: 9,
    preferred_for: 'traveler',
    move_in_assurance: false,
    assurance_notes: '',
    liveabilityScore: 4.1,
    liveabilityBreakdown: {
      wifi_rating: { label: 'Wi-Fi', score: 4.0 },
      cleanliness: { label: 'Cleanliness', score: 4.0 },
      safety_rating: { label: 'Safety', score: 4.3 },
      rule_flexibility_rating: { label: 'Rule flexibility', score: 4.2 }
    }
  },
  {
    id: 5,
    name: 'Cozy Private Room',
    type: 'room',
    address: '21 Koregaon Park, Pune, Maharashtra 411001',
    base_price: 1200,
    rating: 4.6,
    reviews: 89,
    amenities: ['WiFi', 'AC', 'attached_bathroom'],
    images: 2,
    latitude: 18.5362,
    longitude: 73.8951,
    commute_landmark: 'EON IT Park',
    commute_minutes: 20,
    preferred_for: 'working_professional',
    move_in_assurance: false,
    assurance_notes: '',
    liveabilityScore: 4.3
  },
  {
    id: 6,
    name: 'Modern PG Apartments',
    type: 'pg',
    address: '7 HITEC City, Hyderabad, Telangana 500081',
    base_price: 2000,
    rating: 4.4,
    reviews: 127,
    amenities: ['WiFi', 'meals_included', 'gym', 'laundry'],
    images: 4,
    latitude: 17.4421,
    longitude: 78.3794,
    commute_landmark: 'HITEC City offices',
    commute_minutes: 12,
    preferred_for: 'intern',
    move_in_assurance: true,
    assurance_notes: 'Verified photos and arrival support.',
    liveabilityScore: 4.2
  },
  {
    id: 7,
    name: 'Budget Hotel Central',
    type: 'hotel',
    address: '88 Mount Road, Chennai, Tamil Nadu 600002',
    base_price: 1800,
    rating: 4.2,
    reviews: 301,
    amenities: ['WiFi', 'room_service', 'AC'],
    images: 3,
    latitude: 13.0679,
    longitude: 80.2641,
    commute_landmark: 'Central Station',
    commute_minutes: 8,
    preferred_for: 'traveler',
    move_in_assurance: false,
    assurance_notes: '',
    liveabilityScore: 4.0
  },
  {
    id: 8,
    name: 'Student PG Housing',
    type: 'pg',
    address: '55 Salt Lake, Kolkata, West Bengal 700091',
    base_price: 900,
    rating: 4.0,
    reviews: 74,
    amenities: ['WiFi', 'laundry'],
    images: 2,
    latitude: 22.5867,
    longitude: 88.4172,
    commute_landmark: 'Sector V',
    commute_minutes: 10,
    preferred_for: 'student',
    move_in_assurance: true,
    assurance_notes: 'Support for bed mismatch and deposit disputes.',
    liveabilityScore: 4.1
  },
  {
    id: 9,
    name: 'Skyline Family Flat',
    type: 'flat',
    address: '34 Sector 62, Noida, Uttar Pradesh 201309',
    base_price: 2600,
    rating: 4.7,
    reviews: 93,
    amenities: ['WiFi', 'AC', 'laundry'],
    images: 4,
    latitude: 28.6281,
    longitude: 77.3649,
    commute_landmark: 'Sector 62 business district',
    commute_minutes: 7,
    preferred_for: 'family',
    move_in_assurance: true,
    assurance_notes: 'Verified inventory checklist, host KYC, and same-day support.',
    liveabilityScore: 4.6,
    liveabilityBreakdown: {
      wifi_rating: { label: 'Wi-Fi', score: 4.5 },
      cleanliness: { label: 'Cleanliness', score: 4.8 },
      safety_rating: { label: 'Safety', score: 4.8 },
      rule_flexibility_rating: { label: 'Rule flexibility', score: 4.6 }
    }
  },
  {
    id: 10,
    name: 'Pink City Hostel House',
    type: 'hostel',
    address: '12 Bani Park, Jaipur, Rajasthan 302016',
    base_price: 950,
    rating: 4.3,
    reviews: 144,
    amenities: ['WiFi', 'common_kitchen', 'laundry'],
    images: 3,
    latitude: 26.9304,
    longitude: 75.7973,
    commute_landmark: 'Jaipur Junction',
    commute_minutes: 13,
    preferred_for: 'traveler',
    move_in_assurance: false,
    assurance_notes: '',
    liveabilityScore: 4.1
  }
];

const toNumber = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const toOptionalNumber = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const averageNumbers = (values) => {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const findCityEntry = (value = '') => {
  const normalizedValue = value.toLowerCase();
  return CITY_COORDINATE_ENTRIES.find((entry) =>
    entry.aliases.some((alias) => normalizedValue.includes(alias))
  );
};

export const getPropertyCity = (property) => {
  if (property.city) {
    return property.city;
  }

  const address = property.address || property.location || '';
  const matchedCity = findCityEntry(address);
  if (matchedCity) {
    return matchedCity.name;
  }

  const addressParts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (addressParts.length >= 2) {
    return addressParts[addressParts.length - 2];
  }

  return addressParts[0] || 'India';
};

export const inferCoordinatesFromAddress = (address, type = 'hotel') => {
  const matchedCity = findCityEntry(address);
  const offset = TYPE_COORDINATE_OFFSETS[type] || TYPE_COORDINATE_OFFSETS.hotel;

  if (matchedCity) {
    return {
      city: matchedCity.name,
      latitude: matchedCity.latitude + offset.latitude,
      longitude: matchedCity.longitude + offset.longitude
    };
  }

  return {
    city: 'India',
    latitude: 20.5937 + offset.latitude,
    longitude: 78.9629 + offset.longitude
  };
};

export const getLiveabilityBreakdown = (reviews = [], fallbackBreakdown = null) => {
  if (Array.isArray(reviews) && reviews.length > 0) {
    const breakdown = LIVEABILITY_FIELDS.reduce((accumulator, field) => {
      const values = reviews
        .map((review) => toOptionalNumber(review[field.key]))
        .filter((value) => value && value > 0);

      if (values.length > 0) {
        accumulator[field.key] = {
          label: field.label,
          score: Number(averageNumbers(values).toFixed(1)),
          count: values.length
        };
      }

      return accumulator;
    }, {});

    if (Object.keys(breakdown).length > 0) {
      return breakdown;
    }
  }

  return fallbackBreakdown || {};
};

export const getLiveabilitySummary = (reviews = [], fallbackScore = null, fallbackBreakdown = null) => {
  const breakdown = getLiveabilityBreakdown(reviews, fallbackBreakdown);
  const breakdownScores = Object.values(breakdown)
    .map((item) => toOptionalNumber(item.score))
    .filter((value) => value && value > 0);

  if (breakdownScores.length > 0) {
    return {
      score: Number(averageNumbers(breakdownScores).toFixed(1)),
      breakdown
    };
  }

  if (Array.isArray(reviews) && reviews.length > 0) {
    const overallRatings = reviews
      .map((review) => toOptionalNumber(review.rating))
      .filter((value) => value && value > 0);

    if (overallRatings.length > 0) {
      return {
        score: Number(averageNumbers(overallRatings).toFixed(1)),
        breakdown
      };
    }
  }

  const normalizedFallback = toOptionalNumber(fallbackScore);
  return {
    score: normalizedFallback ? Number(normalizedFallback.toFixed(1)) : null,
    breakdown
  };
};

export const normalizeProperty = (property, index = 0) => {
  const inferredLocation = inferCoordinatesFromAddress(
    property.address || property.location || '',
    property.type
  );
  const coordinateDrift = (index % 3) * 0.01;
  const reviewList = Array.isArray(property.reviews) ? property.reviews : [];
  const liveability = getLiveabilitySummary(
    reviewList,
    property.liveabilityScore,
    property.liveabilityBreakdown
  );

  return {
    ...property,
    id: property.id,
    type: property.type || 'hotel',
    city: getPropertyCity(property),
    price: toNumber(property.base_price ?? property.price),
    location: property.address || property.location || inferredLocation.city,
    address: property.address || property.location || inferredLocation.city,
    rating: toNumber(property.rating, 4.4),
    reviews: reviewList.length > 0 ? reviewList.length : toNumber(property.reviews, 64),
    reviewList,
    liveabilityScore: liveability.score,
    liveabilityBreakdown: liveability.breakdown,
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    images: toNumber(property.images, property.image_url ? 1 : 4),
    latitude: toNumber(property.latitude, inferredLocation.latitude + coordinateDrift),
    longitude: toNumber(property.longitude, inferredLocation.longitude + coordinateDrift),
    imageUrl: property.image_url || property.imageUrl || '',
    rooms: Array.isArray(property.rooms) ? property.rooms : [],
    commuteLandmark: property.commute_landmark || property.commuteLandmark || '',
    commuteMinutes: toOptionalNumber(property.commute_minutes ?? property.commuteMinutes),
    preferredFor: property.preferred_for || property.preferredFor || '',
    moveInAssurance: Boolean(property.move_in_assurance ?? property.moveInAssurance),
    assuranceNotes: property.assurance_notes || property.assuranceNotes || ''
  };
};

export const formatCurrency = (value) => `Rs. ${Math.round(toNumber(value)).toLocaleString()}`;

export const fetchSearchProperties = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties`);

    if (!response.ok) {
      throw new Error('Unable to load properties');
    }

    const data = await response.json();
    const sourceProperties = Array.isArray(data) && data.length > 0 ? data : fallbackProperties;

    return {
      properties: sourceProperties.map(normalizeProperty),
      source: Array.isArray(data) && data.length > 0 ? 'api' : 'fallback'
    };
  } catch (error) {
    return {
      properties: fallbackProperties.map(normalizeProperty),
      source: 'fallback'
    };
  }
};
