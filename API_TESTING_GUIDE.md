# RoomBookify API Testing Guide

## Setup
1. Seed demo data: `GET /api/seed`
2. Use demo credentials:
   - **Guest**: demo@example.com / demo123
   - **Provider**: provider@example.com / demo123
   - **Admin**: admin@example.com / demo123

## Authentication Endpoints

### Register
```
POST /api/auth/register
Body: { name, email, password, role: 'seeker' | 'provider' }
Response: { token, user }
```

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

### Get Profile
```
GET /api/auth/profile
Headers: Authorization: Bearer {token}
Response: User object (full details)
```

## User Profile Endpoints (NEW)

### Get User Profile
```
GET /api/user/profile
Headers: Authorization: Bearer {token}
Response: User with recent bookings
```

### Get User Bookings
```
GET /api/user/bookings?status=confirmed&limit=10&offset=0
Headers: Authorization: Bearer {token}
Response: { total, bookings[], categorized: { upcoming, current, completed, cancelled } }
```

### Get User Statistics
```
GET /api/user/statistics
Headers: Authorization: Bearer {token}
Response: { bookings, spending, loyalty, referrals }
```

### Get User Loyalty Info
```
GET /api/user/loyalty
Headers: Authorization: Bearer {token}
Response: LoyaltyPoint object
```

### Get User Referrals
```
GET /api/user/referrals
Headers: Authorization: Bearer {token}
Response: { total_referrals, completed_referrals, pending_referrals, total_earnings, referrals[] }
```

### Get User Conversations
```
GET /api/user/conversations
Headers: Authorization: Bearer {token}
Response: Array of conversation objects with last message
```

### Update User Profile
```
PUT /api/user/profile
Body: { name, email }
Headers: Authorization: Bearer {token}
Response: { message, user }
```

## Property Endpoints

### Get All Properties (Public)
```
GET /api/properties?type=hotel&minPrice=500&maxPrice=5000&location=Mumbai
Response: Property[] with rooms included
```

### Get Property by ID (Public)
```
GET /api/properties/{id}
Response: Property with rooms and provider info
```

### Create Property (Protected)
```
POST /api/properties
Body: { name, type, address, base_price, amenities[], description, image_url }
Headers: Authorization: Bearer {token}
Response: { message, property }
```

### Update Property (Protected)
```
PUT /api/properties/{id}
Body: { name, address, base_price, amenities[], description, image_url }
Headers: Authorization: Bearer {token}
Response: { message, property }
```

### Delete Property (Protected)
```
DELETE /api/properties/{id}
Headers: Authorization: Bearer {token}
Response: { message }
```

## Booking Endpoints

### Create Booking (Protected)
```
POST /api/bookings
Body: { room_id, beds_booked, check_in, check_out }
Headers: Authorization: Bearer {token}
Response: { message, booking with discount info and loyalty points earned }
```

### Get Booking (Public)
```
GET /api/bookings/{id}
Response: Booking with user, room, and property details
```

### Get User Bookings
```
GET /api/bookings/user/bookings
Headers: Authorization: Bearer {token}
Response: Booking[] for logged-in user
```

### Get Property Bookings (Protected Provider Only)
```
GET /api/bookings/property/{propertyId}
Headers: Authorization: Bearer {token}
Response: All bookings for provider's property
```

### Cancel Booking (Protected)
```
DELETE /api/bookings/{id}
Headers: Authorization: Bearer {token}
Response: { message, booking }
```

## Admin Endpoints (NEW)

All admin endpoints require: `role === 'admin'`

### Get Dashboard Stats
```
GET /api/admin/dashboard/stats
Headers: Authorization: Bearer {token}
Response: {
  users: { total, providers, seekers },
  properties: { total, rooms },
  bookings: { total, completed, confirmed, cancelled, cancellation_rate },
  revenue: { total, monthly },
  loyalty_points: { total }
}
```

### Get All Users
```
GET /api/admin/users?limit=10&offset=0&role=provider&search=john
Headers: Authorization: Bearer {token}
Response: { users[], total }
```

### Get User Details
```
GET /api/admin/users/{userId}
Headers: Authorization: Bearer {token}
Response: User with bookings and properties
```

### Update User Role
```
PUT /api/admin/users/{userId}/role
Body: { role: 'seeker' | 'provider' | 'admin' }
Headers: Authorization: Bearer {token}
Response: { message, user }
```

### Delete User
```
DELETE /api/admin/users/{userId}
Headers: Authorization: Bearer {token}
Response: { message }
```

### Get All Properties
```
GET /api/admin/properties?limit=10&offset=0&category=hotel&search=luxury
Headers: Authorization: Bearer {token}
Response: { properties[], total }
```

### Get All Bookings
```
GET /api/admin/bookings?limit=10&offset=0&status=completed
Headers: Authorization: Bearer {token}
Response: { bookings[], total }
```

### Get Revenue Analytics
```
GET /api/admin/analytics/revenue?days=30
Headers: Authorization: Bearer {token}
Response: Array of { date, revenue, bookings }
```

### Get Provider Stats
```
GET /api/admin/analytics/providers
Headers: Authorization: Bearer {token}
Response: Array of top providers with property counts
```

## Loyalty Endpoints

### Get User Loyalty
```
GET /api/loyalty/user
Headers: Authorization: Bearer {token}
Response: LoyaltyPoint object
```

### Redeem Points
```
POST /api/loyalty/redeem
Body: { points }
Headers: Authorization: Bearer {token}
Response: { message, loyalty, discount_value }
```

## Referral Endpoints

### Get Referral Stats
```
GET /api/referral/stats
Headers: Authorization: Bearer {token}
Response: { total_referrals, completed, pending, total_earnings, referrals[] }
```

### Apply Referral Code
```
POST /api/referral/apply
Body: { referral_code }
Headers: Authorization: Bearer {token}
Response: { message, bonus_points }
```

## Message Endpoints

### Send Message
```
POST /api/messages/send
Body: { receiver_id, message, message_type: 'text' | 'check_in_info' | 'support' | 'review_request' }
Headers: Authorization: Bearer {token}
Response: { message, data }
```

### Get Conversation
```
GET /api/messages/conversation/{userId}
Headers: Authorization: Bearer {token}
Response: Message[]
```

### Get All Conversations
```
GET /api/messages/conversations
Headers: Authorization: Bearer {token}
Response: Grouped conversations with last message
```

### Mark Message as Read
```
PATCH /api/messages/{messageId}/read
Headers: Authorization: Bearer {token}
Response: { message }
```

## Testing Workflow

### 1. Guest Flow
- Login as guest: `POST /api/auth/login` with demo@example.com
- Browse properties: `GET /api/properties`
- View property: `GET /api/properties/{id}`
- Make booking: `POST /api/bookings`
- View bookings: `GET /api/user/bookings`
- View profile: `GET /api/user/profile`
- Check loyalty: `GET /api/user/loyalty`

### 2. Provider Flow
- Login as provider: `POST /api/auth/login` with provider@example.com
- View properties: `GET /api/properties` (owned by provider)
- Create property: `POST /api/properties`
- Edit property: `PUT /api/properties/{id}`
- View bookings: `GET /api/bookings/property/{propertyId}`
- View analytics: `GET /api/analytics/property-performance/{propertyId}`

### 3. Admin Flow
- Login as admin: `POST /api/auth/login` with admin@example.com
- View dashboard: `GET /api/admin/dashboard/stats`
- View users: `GET /api/admin/users`
- View properties: `GET /api/admin/properties`
- View bookings: `GET /api/admin/bookings`
- View analytics: `GET /api/admin/analytics/revenue`

## Frontend Routes

- **Guest**: `/` → `/results` → `/property/:id` → Book → `/my-bookings` → `/profile` → `/loyalty`
- **Provider**: `/login` → `/dashboard` → `/add-property` → `/edit-property/:id` → `/analytics`
- **Admin**: `/admin` (dashboard with stats, users, properties, bookings)
