# RoomBookify - Complete Setup & Troubleshooting Guide

## Prerequisites
- Node.js (v14+) installed
- MySQL server running on localhost:3306
- npm or yarn package manager

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Setup
Make sure MySQL is running and create the database:

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE roombookify;
CREATE DATABASE roombookify_test;

-- Exit
EXIT;
```

### 3. Environment Configuration
The `.env` file should contain:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Anuj2005@
DB_NAME=roombookify
DB_PORT=3306
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=roombookify_jwt_secret_change_in_production_12345
JWT_EXPIRE=7d
```

**Note:** If you get connection errors, verify:
- MySQL service is running: `net start MySQL80` (Windows) or `brew services start mysql` (Mac)
- Database credentials are correct
- Port 3306 is accessible

### 4. Start Backend Server
```bash
npm start
```

Expected output:
```
✅ Database connection established
✅ Database synchronized
🚀 Server running on http://localhost:5000

📋 Available endpoints:
   - Health Check: GET http://localhost:5000/api/health
   - Seed Demo Data: GET http://localhost:5000/api/seed
   - Login: POST http://localhost:5000/api/auth/login
   - Register: POST http://localhost:5000/api/auth/register

✅ Backend is ready! Frontend should connect now.
```

### Verify Backend is Working
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"Server is running"}
```

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v3.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5000
  ➜  press h to show help
```

---

## Login & Registration Testing

### Test Credentials (After Seeding)
```
Email: guest@example.com
Password: password123
Role: seeker

Email: provider@example.com
Password: password123
Role: provider
```

### Manual Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "guest@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Guest User",
    "email": "guest@example.com",
    "role": "seeker"
  }
}
```

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/profile` - Get current user (protected)

### Properties
- `GET /api/properties` - Get all properties (public)
- `POST /api/properties` - Create property (protected)
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property (protected)
- `DELETE /api/properties/:id` - Delete property (protected)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/user/my` - Get user bookings (protected)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (protected)

### User Profile
- `GET /api/user/profile` - Get user profile (protected)
- `GET /api/user/bookings` - Get all user bookings (protected)
- `GET /api/user/loyalty` - Get loyalty info (protected)
- `GET /api/user/referrals` - Get referral stats (protected)
- `GET /api/user/statistics` - Get user statistics (protected)
- `PUT /api/user/profile` - Update profile (protected)

### Admin (Admin role required)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:userId` - Get user details
- `PUT /api/admin/users/:userId/role` - Update user role
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/properties` - List properties
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/analytics/revenue` - Revenue analytics
- `GET /api/admin/analytics/providers` - Provider statistics

### Loyalty & Referrals
- `GET /api/loyalty/user/:id` - Get loyalty info
- `POST /api/loyalty/add` - Add loyalty points (protected)
- `POST /api/referral/generate` - Generate referral code (protected)
- `POST /api/referral/apply` - Apply referral code (protected)

---

## Common Issues & Solutions

### Issue: "Network error. Please try again."

**Cause 1: Backend not running**
- Solution:
  ```bash
  cd backend
  npm start
  ```
- Verify: `curl http://localhost:5000/api/health`

**Cause 2: Database connection failed**
- Solution: Check MySQL is running
  - Windows: `services.msc` → start MySQL80
  - Mac: `brew services start mysql`
  - Linux: `sudo systemctl start mysql`
- Verify credentials in `.env` file

**Cause 3: Wrong database credentials**
- Solution:
  ```bash
  mysql -u root -p
  # Enter password: Anuj2005@ (or your MySQL password)
  SHOW DATABASES;
  ```

**Cause 4: Port 5000 already in use**
- Solution: Kill process or use different port
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # Mac/Linux
  lsof -i :5000
  kill -9 <PID>
  ```

### Issue: "Property not found" when editing

**Cause: EditProperty not fetching real data**
- Solution: Check Network tab in browser DevTools
  - Should see GET request to `/api/properties/:id`
  - Check if token is present in Authorization header

### Issue: Login shows "Invalid email or password"

**Cause 1: User doesn't exist**
- Solution: Register first or use seed data

**Cause 2: Wrong password**
- Solution: Try again or reset password

**Cause 3: Database not synced**
- Solution: Check backend console, should show `✅ Database synchronized`

---

## Seeding Demo Data

To populate the database with demo data:

```bash
# Get list of seed endpoints
curl http://localhost:5000/api/seed

# Or open in browser
http://localhost:5000/api/seed
```

This creates:
- Demo users (guests and providers)
- Sample properties
- Sample bookings
- Test data for all features

---

## Feature Access

After login:

### Guest User (Seeker) Can Access:
- Browse properties (`/results`)
- View property details (`/property/:id`)
- My Bookings (`/my-bookings`)
- User Profile (`/profile`)
- Loyalty Program (`/loyalty`)

### Provider User Can Access:
- Provider Dashboard (`/dashboard`)
- Add Property (`/add-property`)
- Edit Property (`/edit-property/:id`)
- Analytics (`/analytics`)
- All guest features

### Admin User Can Access:
- Admin Dashboard (`/admin`)
- Full platform management
- User management
- Property management
- Analytics and revenue reporting

---

## Debugging Tips

### Check Browser Console
- Open DevTools (F12)
- Look for error messages
- Check Network tab for failed requests

### Check Backend Logs
- Terminal where you ran `npm start`
- Look for error messages and status codes
- Check database query logs

### Enable Detailed Logging
Edit `backend/config/database.js`:
```javascript
const sequelize = new Sequelize({
  // ... other config
  logging: console.log  // Enable SQL query logging
});
```

---

## Performance Notes

- Database pooling is configured with max 5 connections
- JWT tokens expire after 7 days
- Message polling interval is 2 seconds
- API requests timeout after 30 seconds

---

## Production Deployment

Before deploying:

1. Change JWT_SECRET to a strong random string
2. Set NODE_ENV=production
3. Use production MySQL database
4. Enable HTTPS
5. Set proper CORS origins
6. Configure environment variables securely

---

## Support

For issues not covered here:

1. Check backend console for error messages
2. Check browser DevTools Network tab
3. Verify all services are running (MySQL, Node, Vite)
4. Restart both backend and frontend
5. Check that ports 5000 and 3000 are not blocked by firewall
