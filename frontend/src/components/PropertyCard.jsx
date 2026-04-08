import { Link } from 'react-router-dom';
import { formatCurrency, preferredForLabels, propertyTypeLabels } from '../lib/propertySearch';

function PropertyCard({
  id,
  name,
  type,
  price,
  location,
  rating = 4.5,
  reviews = 128,
  images = 3,
  liveabilityScore,
  commuteLandmark,
  commuteMinutes,
  preferredFor,
  moveInAssurance
}) {
  return (
    <Link to={`/property/${id}`}>
      <div className="bg-white rounded-lg overflow-hidden card-shadow border border-gray-200 hover:border-gray-300">
        <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="absolute top-3 left-3">
            <span className="badge badge-primary">{propertyTypeLabels[type] || 'Stay'}</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-gray-900 bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
            {images} images
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">{name}</h3>
          <p className="text-sm text-gray-600 mb-3 truncate">{location}</p>

          <div className="mb-3 flex flex-wrap gap-2">
            {commuteMinutes && (
              <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {commuteMinutes} mins to {commuteLandmark || 'destination'}
              </span>
            )}
            {liveabilityScore && (
              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                Liveability {liveabilityScore.toFixed(1)}
              </span>
            )}
            {moveInAssurance && (
              <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Move-in assured
              </span>
            )}
            {preferredFor && (
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                Best for {preferredForLabels[preferredFor] || preferredFor}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">{rating}</span>
            <span className="text-xs text-gray-600">({reviews})</span>
          </div>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(price)}</span>
            <span className="text-gray-600 text-sm">/night</span>
          </div>

          <button className="btn-primary w-full text-sm">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
