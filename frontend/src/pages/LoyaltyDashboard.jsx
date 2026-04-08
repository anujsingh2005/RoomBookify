import { useState, useEffect } from 'react';

function LoyaltyDashboard() {
  const [loyalty, setLoyalty] = useState(null);
  const [referralStats, setReferralStats] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      const loyaltyRes = await fetch('http://localhost:5000/api/loyalty/my-loyalty', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const loyaltyData = await loyaltyRes.json();
      setLoyalty(loyaltyData);

      const referralRes = await fetch('http://localhost:5000/api/referral/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const referralData = await referralRes.json();
      setReferralStats(referralData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      setLoading(false);
    }
  };

  const handleGenerateReferralCode = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/referral/generate-code', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setReferralCode(data.referral_code);
      setMessage('Referral code generated! Share your link to earn 500 points.');
    } catch (error) {
      console.error('Error generating referral code:', error);
    }
  };

  const handleRedeemPoints = async (e) => {
    e.preventDefault();
    if (!redeemPoints || parseInt(redeemPoints) <= 0) return;

    try {
      const res = await fetch('http://localhost:5000/api/loyalty/redeem-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ points: parseInt(redeemPoints) })
      });
      const data = await res.json();
      setMessage(`Points redeemed! Discount coupon: ${data.coupon_code} (₹${data.discount})`);
      setRedeemPoints('');
      fetchLoyaltyData();
    } catch (error) {
      console.error('Error redeeming points:', error);
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: 'bg-amber-100 text-amber-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-blue-100 text-blue-800'
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  const getTierBenefits = (tier) => {
    const benefits = {
      bronze: ['5% discount on next 3 bookings'],
      silver: ['10% discount', 'Priority support'],
      gold: ['15% discount', 'Free cancellation'],
      platinum: ['20% discount', 'VIP support', 'Exclusive deals']
    };
    return benefits[tier] || [];
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Program</h1>
          <p className="text-gray-600">Earn points on every booking and unlock great rewards</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {message}
          </div>
        )}

        {/* Points & Tier Card */}
        {loyalty && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-gray-600 text-sm mb-2">Current Points</p>
                <p className="text-4xl font-bold text-royal-blue">{loyalty.points.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Earned</p>
                <p className="text-4xl font-bold text-gray-900">{loyalty.total_earned.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Redeemed</p>
                <p className="text-4xl font-bold text-gray-900">{loyalty.total_redeemed.toLocaleString()}</p>
              </div>
            </div>

            {/* Tier Status */}
            <div className={`rounded-lg p-6 ${getTierColor(loyalty.tier)}`}>
              <p className="text-sm font-semibold mb-2">YOUR TIER</p>
              <p className="text-2xl font-bold capitalize mb-4">{loyalty.tier}</p>
              <div className="space-y-1">
                {getTierBenefits(loyalty.tier).map((benefit, idx) => (
                  <p key={idx} className="text-sm">• {benefit}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Redeem Points */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Redeem Points</h2>
            <form onSubmit={handleRedeemPoints} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points to Redeem</label>
                <input
                  type="number"
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(e.target.value)}
                  placeholder="Enter points"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-royal-blue"
                  min="1"
                  max={loyalty?.points || 0}
                />
                <p className="text-xs text-gray-500 mt-2">1 point = ₹0.01 discount</p>
              </div>
              <button
                type="submit"
                className="w-full bg-royal-blue text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Redeem
              </button>
            </form>
          </div>

          {/* Referral Program */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Referral Program</h2>
            {referralStats && (
              <>
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Referrals</p>
                    <p className="text-2xl font-bold text-gray-900">{referralStats.total_referrals}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{referralStats.completed_referrals}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Earnings</p>
                    <p className="text-2xl font-bold text-royal-blue">{referralStats.total_earnings} points</p>
                  </div>
                </div>
                {referralCode && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="text-xs text-gray-600 mb-1">Your Referral Code</p>
                    <p className="font-mono text-sm font-bold text-royal-blue">{referralCode}</p>
                  </div>
                )}
                <button
                  onClick={handleGenerateReferralCode}
                  className="w-full bg-royal-blue text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {referralCode ? 'Copy & Share' : 'Generate Referral Code'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tier Requirements */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tier Progression</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-semibold text-gray-900">Bronze</p>
                <p className="text-sm text-gray-600">0 - 10,000 points</p>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-semibold text-gray-900">Silver</p>
                <p className="text-sm text-gray-600">10,000 - 25,000 points</p>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-gray-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-semibold text-gray-900">Gold</p>
                <p className="text-sm text-gray-600">25,000 - 50,000 points</p>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Platinum</p>
                <p className="text-sm text-gray-600">50,000+ points</p>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoyaltyDashboard;
