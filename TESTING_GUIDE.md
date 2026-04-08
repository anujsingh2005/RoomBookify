# RoomBookify - Complete Testing & Feature Guide

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ installed
- MySQL running on localhost:3306
- Backend running on http://localhost:5000
- Frontend running on http://localhost:3000 or http://localhost:3002

### Start Backend
```bash
cd backend
npm install
npm run dev
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Guest | demo@example.com | demo123 |
| Provider | provider@example.com | demo123 |
| Admin | admin@example.com | demo123 |

## ✅ Core Features Implemented

1. ✅ Google OAuth + Local Authentication
2. ✅ Multi-category Booking System (Hotels, Hostels, PGs, Rooms)
3. ✅ Property Management (Add/Edit/Delete)
4. ✅ Real-Time Chat System
5. ✅ Loyalty Points & Tier System
6. ✅ Referral Program
7. ✅ Extended Stay Pricing & Discounts
8. ✅ Sustainability Certification
9. ✅ Dynamic Pricing & Analytics
10. ✅ User Profile & Admin System

## 🧪 Test Scenarios

### Test 1: Complete Booking Flow
1. Login as Guest (demo@example.com / demo123)
2. Go to Home - "Find Your Space"
3. Select property type and search
4. Click on property
5. Select room, dates, beds
6. Confirm booking
7. Check My Bookings page
8. Verify loyalty points awarded

### Test 2: Provider Management
1. Login as Provider (provider@example.com / demo123)
2. Go to Provider Dashboard
3. View properties and bookings
4. Click "View Analytics"
5. Check revenue trends
6. Edit a property

### Test 3: Admin Oversight
1. Login as Admin (admin@example.com / demo123)
2. Go to Admin Panel
3. View platform KPIs
4. Check Users, Properties, Bookings tables
5. Verify data accuracy

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Server health check |
| POST | /api/seed/seed | Seed demo data |
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| GET | /api/user/profile | Get user profile |
| GET | /api/user/bookings | Get user bookings |
| GET | /api/admin/dashboard/stats | Admin KPIs |

## 📱 Key Pages

| Page | Route | Access |
|------|-------|--------|
| Home | / | Public |
| Login | /login | Public |
| Register | /register | Public |
| Browse Properties | /results | Authenticated |
| Property Details | /property/:id | Authenticated |
| User Profile | /profile | Authenticated |
| My Bookings | /my-bookings | Authenticated |
| Loyalty | /loyalty | Authenticated |
| Provider Dashboard | /dashboard | Provider/Admin |
| Analytics | /analytics | Provider/Admin |
| Admin Panel | /admin | Admin |

## 🐛 Troubleshooting

**Network Error:** 
- Check backend is running on :5000
- Clear browser cache (F12 → Storage → Clear data)

**Login fails:**
- Seed demo data: POST /api/seed/seed
- Use correct credentials

**Profile not showing:**
- Refresh page (Ctrl+Shift+R)
- Check token in localStorage

**CORS Error:**
- Backend allows localhost on all ports

---

**Last Updated:** April 1, 2026
**Status:** Development / Testing Ready ✅
