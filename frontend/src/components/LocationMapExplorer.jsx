import { propertyTypeLabels } from '../lib/propertySearch';

const MAP_BOUNDS = {
  minLatitude: 7,
  maxLatitude: 37,
  minLongitude: 68,
  maxLongitude: 97
};

const INDIA_OUTLINE_PATH =
  'M28 11 L37 8 L47 10 L55 10 L63 15 L69 21 L71 28 L69 35 L73 43 L70 50 L66 57 L64 66 L58 75 L50 87 L45 82 L40 72 L37 61 L31 52 L27 43 L23 31 L24 21 Z';

const projectCoordinates = (latitude, longitude) => {
  const xPercent =
    ((longitude - MAP_BOUNDS.minLongitude) /
      (MAP_BOUNDS.maxLongitude - MAP_BOUNDS.minLongitude)) *
    100;
  const yPercent =
    (1 -
      (latitude - MAP_BOUNDS.minLatitude) /
        (MAP_BOUNDS.maxLatitude - MAP_BOUNDS.minLatitude)) *
    100;

  return {
    left: `${Math.max(8, Math.min(92, xPercent))}%`,
    top: `${Math.max(8, Math.min(92, yPercent))}%`
  };
};

function LocationMapExplorer({
  properties,
  selectedCity,
  onCitySelect,
  onClearSelection
}) {
  const cityMap = new Map();

  properties.forEach((property) => {
    const cityName = property.city || property.location || 'India';
    const existingCity = cityMap.get(cityName);

    if (existingCity) {
      existingCity.count += 1;
      existingCity.latitudeTotal += property.latitude;
      existingCity.longitudeTotal += property.longitude;
      existingCity.lowestPrice = Math.min(existingCity.lowestPrice, property.price);
      existingCity.types.add(property.type);
      return;
    }

    cityMap.set(cityName, {
      name: cityName,
      count: 1,
      latitudeTotal: property.latitude,
      longitudeTotal: property.longitude,
      lowestPrice: property.price,
      types: new Set([property.type])
    });
  });

  const cities = Array.from(cityMap.values())
    .map((city) => ({
      ...city,
      latitude: city.latitudeTotal / city.count,
      longitude: city.longitudeTotal / city.count,
      types: Array.from(city.types).sort()
    }))
    .sort((firstCity, secondCity) => secondCity.count - firstCity.count || firstCity.name.localeCompare(secondCity.name));

  const activeCity = cities.find((city) => city.name === selectedCity) || null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-royal-blue">
            Map Explorer
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Pick a city and search that area instantly
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Tap a city pin to filter rooms, PGs, hostels, hotels, and flats by map location.
          </p>
        </div>

        {selectedCity && (
          <button
            type="button"
            onClick={onClearSelection}
            className="btn-outline text-sm"
          >
            Clear Map Selection
          </button>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr),320px]">
        <div className="relative min-h-[340px] overflow-hidden rounded-3xl bg-slate-950 p-4 text-white md:min-h-[420px]">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '54px 54px'
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.35),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(37,99,235,0.28),_transparent_55%)]" />

          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full opacity-70"
            aria-hidden="true"
          >
            <path
              d={INDIA_OUTLINE_PATH}
              fill="rgba(148, 163, 184, 0.2)"
              stroke="rgba(191, 219, 254, 0.7)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>

          <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
            India coverage
          </div>

          {cities.map((city) => {
            const position = projectCoordinates(city.latitude, city.longitude);
            const isActive = city.name === selectedCity;

            return (
              <button
                key={city.name}
                type="button"
                onClick={() => onCitySelect(city.name)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-left transition-all ${
                  isActive
                    ? 'border-white bg-white text-slate-950 shadow-[0_0_0_10px_rgba(255,255,255,0.16)]'
                    : 'border-white/30 bg-royal-blue text-white hover:bg-blue-500'
                }`}
                style={{ left: position.left, top: position.top }}
                aria-label={`Show stays in ${city.name}`}
              >
                <span className="flex min-w-[44px] items-center justify-center gap-2 px-3 py-2 text-sm font-semibold">
                  <span>{city.count}</span>
                </span>
              </button>
            );
          })}

          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
            {cities.slice(0, 8).map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => onCitySelect(city.name)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  city.name === selectedCity
                    ? 'border-white bg-white text-slate-950'
                    : 'border-white/20 bg-white/10 text-blue-100 hover:bg-white/20'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Selected Area
          </p>

          {activeCity ? (
            <>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">{activeCity.name}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {activeCity.count} stay{activeCity.count > 1 ? 's' : ''} available from{' '}
                {activeCity.lowestPrice ? `Rs. ${Math.round(activeCity.lowestPrice)}` : 'flexible pricing'}.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {activeCity.types.map((type) => (
                  <span
                    key={type}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    {propertyTypeLabels[type] || type}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">How to use it</p>
                <p className="mt-2 text-sm text-slate-600">
                  Keep the map city selected and refine the list with price, type, and amenities on the results panel.
                </p>
              </div>
            </>
          ) : (
            <>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">All cities</h3>
              <p className="mt-2 text-sm text-slate-600">
                Every mapped listing is visible right now. Choose a city pin to narrow the list to a specific location.
              </p>

              <div className="mt-6 space-y-3">
                {cities.slice(0, 5).map((city) => (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => onCitySelect(city.name)}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span>
                      <span className="block font-semibold text-slate-900">{city.name}</span>
                      <span className="block text-xs text-slate-500">{city.count} mapped stays</span>
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-blue">
                      View
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default LocationMapExplorer;
