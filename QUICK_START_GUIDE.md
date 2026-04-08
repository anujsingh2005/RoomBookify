# RoomBookify Quick Start Guide

## System Overview

RoomBookify is a complete production-ready booking platform with:
- **3 User Roles**: Seeker (Guest), Provider (Host), Admin
- **10 Completed Features** with 50% implementation of 20-feature roadmap
- **Professional Booking.com-style UI** with Tailwind CSS
- **Real-time Chat** with polling mechanism
- **Loyalty & Referral System** for user engagement
- **Dynamic Pricing** for hosts to maximize revenue
- **Comprehensive Admin Panel** for platform management

---

## Starting the Application

### Prerequisites
- Node.js 14+ installed
- MySQL database running
- Environment variables configured (.env file)

### Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

---

## Demo Credentials

After running the seed endpoint, use these test accounts:

### Guest Account
- Email: `demo@example.com`
- Password: `demo123`
- Features: Browse properties, make bookings, view loyalty points

### Provider Account
- Email: `provider@example.com`
- Password: `demo123`
- Features: Create/edit properties, view bookings, access analytics

### Admin Account
- Email: `admin@example.com`
- Password: `demo123`
- Features: Manage users, view all bookings/properties, analytics dashboard

---

## Seed Demo Data

**Important**: Run this once to populate test data

```bash
curl http://localhost:5000/api/seed
```

Or through the UI: Open browser DevTools and run:
```javascript
fetch('http://localhost:5000/api/seed').then(r => r.json()).then(console.log)
```

---

## User Profile System (NEW THIS SESSION)

When you login, a profile dropdown appears in the top-right corner:

### Guest Features
- **My Profile**: View personal information and statistics
- **My Bookings**: See all bookings with categorization (Upcoming, Current, Completed, Cancelled)
- **Loyalty Program**: Check points balance, tier, redemption options
- **Edit Profile**: Update name and email

### Provider Features (+ all guest features)
- **Provider Dashboard**: Manage properties and view booking statistics
- **Analytics**: Revenue trends, occupancy rates, pricing recommendations

### Admin Features (Top Priority)
- **Admin Panel**: Access complete platform management dashboard
  - 📊 **Overview Tab**: KPI cards showing users, revenue, bookings, properties
  - 👥 **Users Tab**: List, search, filter, and manage all users
  - 🏢 **Properties Tab**: View all properties with provider information
  - 📅 **Bookings Tab**: Monitor all system bookings with status tracking

---

## Key API Endpoints Overview

### User Profile (NEW)
```
GET  /api/user/profile              → User info with recent bookings
GET  /api/user/bookings             → All user bookings with filtering
GET  /api/user/statistics           → Comprehensive user stats
GET  /api/user/loyalty              → Loyalty points & tier
GET  /api/user/referrals            → Referral information
GET  /api/user/conversations        → Chat conversations
PUT  /api/user/profile              → Update profile
```

### Admin System (NEW)
```
GET  /api/admin/dashboard/stats     → Platform KPIs
GET  /api/admin/users               → List all users
GET  /api/admin/users/:id           → User details
PUT  /api/admin/users/:id/role      → Change user role
DELETE /api/admin/users/:id         → Delete user
GET  /api/admin/properties          → List properties
GET  /api/admin/bookings            → List bookings
GET  /api/admin/analytics/revenue   → Revenue analytics
GET  /api/admin/analytics/providers → Top providers
```

### Core Features
```
Properties:    GET/POST/PUT/DELETE /api/properties
Bookings:      POST/GET/DELETE /api/bookings
Loyalty:       GET /api/loyalty/user, POST /api/loyalty/redeem
Referrals:     GET /api/referral/stats, POST /api/referral/apply
Messages:      POST /api/messages/send, GET /api/messages/conversations
Analytics:     GET /api/analytics/...
```

---

## Features by User Role

### 🎯 Guest (Seeker) Features
✅ Search and browse properties by category, price, location
✅ View detailed property information and available rooms
✅ Make bookings with automatic loyalty points reward
✅ View booking history with status tracking
✅ Earn loyalty points (1 point per ₹1 spent)
✅ Tier progression: Bronze → Silver → Gold → Platinum
✅ Apply referral codes for bonus points
✅ Chat with property owners
✅ View personal dashboard with statistics

### 🏠 Provider (Host) Features
✅ All guest features
✅ Create new properties with multiple room types
✅ Edit/update property information
✅ Add/manage amenities for properties
✅ View all bookings for owned properties
✅ Access Analytics Dashboard:
   - Revenue trends over time
   - Occupancy rate tracking
   - Dynamic pricing recommendations
   - Competitor price comparison
✅ Apply pricing strategies (manual/dynamic/seasonal)
✅ Track sustainability certification progress

### 🔧 Admin Features
✅ View comprehensive platform dashboard
✅ Manage all users:
   - Change user roles
   - Search and filter users
   - Delete users and associated data
✅ Monitor all properties
✅ Track all bookings across platform
✅ View revenue analytics with date ranges
✅ Analyze provider performance
✅ System-wide statistics and metrics

---

## Testing Checklist

### 1. Quick Start Test (5 minutes)
```
1. Seed demo data: GET /api/seed
2. Login as guest: demo@example.com
3. View profile dropdown (top-right)
4. Click "My Bookings" → see categorized bookings
5. Logout
```

### 2. Booking Flow Test
```
1. Login as guest
2. Go to Results page
3. Browse properties
4. Book a room (creates loyalty points)
5. Check "My Profile" → verify stats updated
6. Go to "My Bookings" → see new booking
```

### 3. Provider Flow Test
```
1. Login as provider
2. Go to Provider Dashboard
3. View existing properties
4. Click Edit on a property (should fetch real data)
5. Modify and save
6. View Analytics
7. Check revenue trends and recommendations
```

### 4. Admin Flow Test
```
1. Login as admin
2. From profile dropdown, click "Admin Panel"
3. View Overview tab:
   - Total users, revenue, bookings, properties
   - Booking distribution pie chart
   - User breakdown bar chart
4. Click Users tab → see all users
5. Click Properties tab → see all properties
6. Click Bookings tab → see system bookings
```

---

## Fixed Issues This Session

✅ **EditProperty Edit Button**: Now correctly fetches real property data from API
✅ **User Profile Dropdown**: Implemented in Navbar with all navigation links
✅ **Admin Dashboard**: Complete platform management interface
✅ **Admin Role**: Added to User model for role-based access
✅ **User Statistics**: Comprehensive stats endpoint for dashboard
✅ **Booking Categorization**: Automatic categorization of bookings by status
✅ **Seed Data**: Admin user and loyalty/referral records now created

---

## Database Models

```
User (13 models total)
├── Properties (provider_id)
├── Bookings (user_id)
├── Messages (sender_id, receiver_id)
├── LoyaltyPoint (1:1)
├── Referrals (referrer_id)
└── Reviews (guest_id)

Property
├── Rooms
├── Reviews
├── PropertyAnalytics
├── SustainabilityCertification
├── PricingStrategy
└── PricingTiers (per room)

Room
├── Bookings
└── PricingTiers

Booking
├── Messages
└── Review
```

---

## Next Steps to Implement

- Feature 11: Travel Insurance Integration
- Feature 12: 24/7 AI Chatbot Support
- Feature 13: Local Experiences Marketplace
- Feature 14: Instant Refund System
- Feature 15: Corporate B2B Portal
- Feature 16: Multi-City Flash Sales
- Feature 17: BNPL Payment Integration
- Feature 18: Campus Housing Specialization
- Feature 19: Accessibility Features
- Feature 20: AR Room Preview

---

## Troubleshooting

### Backend fails to start
```
1. Check MySQL is running
2. Verify .env variables
3. Run: npm install
4. Check port 5000 is available
```

### Cannot login
```
1. Run /api/seed first
2. Check credentials in console output
3. Verify JWT_SECRET in .env
```

### Property edit shows error
```
1. Check network tab in DevTools
2. Verify property exists
3. Ensure you're logged in as the provider
```

### Admin panel shows no data
```
1. Login with admin@example.com
2. Run /api/seed if not done
3. Check user role is 'admin'
```

---

## Development Notes

- **Code Style**: ES6, modular pattern, no emojis in code
- **Authentication**: JWT-based with LocalStorage
- **Database**: Sequelize ORM with MySQL
- **Frontend**: React hooks + React Router
- **Styling**: Tailwind CSS with custom royal-blue color
- **Validation**: Frontend forms + backend validation
- **Error Handling**: Try-catch blocks + proper status codes

---

## Documentation Files
- `API_TESTING_GUIDE.md` - Comprehensive API reference
- `FUNCTIONALITY_CHECKLIST.md` - Testing checklist for all features
- `COMPLETE_FEATURE_GUIDE.md` - Implementation details for features 1-20
