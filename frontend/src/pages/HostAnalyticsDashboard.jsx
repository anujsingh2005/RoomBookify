import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function HostAnalyticsDashboard() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [pricingStrategy, setPricingStrategy] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const token = localStorage.getItem('token');

  const propertyIdParam = propertyId || new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    if (!propertyIdParam) {
      setError('Property ID not provided');
      setLoading(false);
      return;
    }
    fetchAnalyticsData();
  }, [propertyIdParam]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch analytics
      const analyticsRes = await fetch(
        `http://localhost:5000/api/analytics/${propertyIdParam}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);

      // Fetch recommendations
      const recommendRes = await fetch(
        `http://localhost:5000/api/analytics/${propertyIdParam}/pricing-recommendation`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const recommendData = await recommendRes.json();
      setRecommendations(recommendData);

      // Fetch pricing strategy
      const strategyRes = await fetch(
        `http://localhost:5000/api/analytics/${propertyIdParam}/pricing-strategy`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const strategyData = await strategyRes.json();
      setPricingStrategy(strategyData);

      // Fetch revenue trend
      const trendRes = await fetch(
        `http://localhost:5000/api/analytics/${propertyIdParam}/revenue-trend?days=30`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const trendData = await trendRes.json();
      setRevenueTrend(trendData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading analytics...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your property performance and get pricing recommendations</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {['overview', 'revenue', 'pricing', 'recommendations'].map(tab => (
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
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600 text-sm mb-2">Total Revenue (30 days)</p>
                <p className="text-3xl font-bold text-royal-blue">₹{Math.round(analytics.revenue.total).toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600 text-sm mb-2">Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.bookings.total_confirmed}</p>
                <p className="text-xs text-red-600 mt-1">
                  {analytics.bookings.total_cancelled} cancelled ({analytics.bookings.cancellation_rate}%)
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600 text-sm mb-2">Occupancy Rate</p>
                <p className="text-3xl font-bold text-green-600">{analytics.occupancy.rate_percent}%</p>
                <p className="text-xs text-gray-600 mt-1">
                  {analytics.occupancy.beds_booked}/{analytics.occupancy.beds_available} beds
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600 text-sm mb-2">Avg. Price/Booking</p>
                <p className="text-3xl font-bold text-gray-900">₹{Math.round(analytics.revenue.average_per_booking).toLocaleString()}</p>
              </div>
            </div>

            {/* Performance Gauge */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Occupancy Rate</span>
                    <span className="text-sm font-bold text-gray-900">{analytics.occupancy.rate_percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${parseFloat(analytics.occupancy.rate_percent)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Target: 80%</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Cancellation Rate</span>
                    <span className="text-sm font-bold text-gray-900">{analytics.bookings.cancellation_rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full"
                      style={{ width: `${parseFloat(analytics.bookings.cancellation_rate)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Industry Average: 5-10%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && revenueTrend && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (30 days)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-right py-2 px-4">Revenue</th>
                    <th className="text-right py-2 px-4">Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueTrend.map((day, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{day.date}</td>
                      <td className="text-right py-3 px-4 font-semibold">₹{Math.round(day.revenue).toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{day.bookings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && pricingStrategy && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing Strategy</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Strategy Type</label>
                <p className="text-lg font-semibold text-gray-900 capitalize">{pricingStrategy.strategy_type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Price</label>
                <p className="text-lg font-semibold text-gray-900">₹{Math.round(pricingStrategy.base_price)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peak Season Multiplier</label>
                <p className="text-lg font-semibold text-gray-900">{pricingStrategy.peak_season_multiplier}x</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Low Season Multiplier</label>
                <p className="text-lg font-semibold text-gray-900">{pricingStrategy.low_season_multiplier}x</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekend Multiplier</label>
                <p className="text-lg font-semibold text-gray-900">{pricingStrategy.weekend_multiplier}x</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto Adjust</label>
                <p className="text-lg font-semibold text-gray-900">{pricingStrategy.auto_adjust ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && recommendations && (
          <div className="space-y-4">
            {recommendations.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-6 ${
                  rec.type === 'price_increase'
                    ? 'bg-green-50 border border-green-200'
                    : rec.type === 'price_decrease'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 capitalize">{rec.type.replace('_', ' ')}</h4>
                  {rec.estimated_new_price && (
                    <span className="text-lg font-bold text-gray-900">
                      ₹{Math.round(rec.estimated_new_price).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-2">{rec.suggestion}</p>
                <p className="text-xs text-gray-600">{rec.reason || rec.suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HostAnalyticsDashboard;
