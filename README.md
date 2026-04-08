# RoomBookify

RoomBookify is a full-stack accommodation booking platform for discovering and booking rooms, PGs, hostels, hotels, and flats in one place.

It combines classic booking flows with three stronger differentiators:
- commute-fit search by office, college, metro, or landmark
- liveability scoring from structured tenant reviews
- move-in assurance badges for properties that offer listing-match support

## Highlights

- Map-first and list-first property discovery
- Typed location search plus destination-based commute search
- Support for hotels, hostels, PGs, guest houses, and flats
- Property details with commute, liveability, and assurance sections
- Booking flow with My Bookings tracking
- Post-stay liveability reviews from completed bookings
- Provider property management with location coordinates
- JWT auth plus Google OAuth support
- Loyalty, referral, chat, analytics, pricing, and admin modules already scaffolded

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, Sequelize
- Database: MySQL
- Auth: JWT, Google OAuth 2.0

## Project Structure

```text
RoomBookify/
├─ backend/
│  ├─ config/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ package.json
│  └─ server.js
├─ frontend/
│  ├─ public/
│  ├─ src/
│  ├─ package.json
│  └─ vite.config.js
└─ README.md
```

## Core User Flows

### Search and discovery
- Browse properties in list view or map view
- Search by city, locality, office, college, or landmark
- Filter by property type, price, amenities, preferred audience, and commute time

### Booking
- Open a property detail page
- Select room type, dates, and guests
- Confirm the booking
- View the booking in `My Bookings`

### Reviews
- Completed bookings can submit structured liveability reviews
- Reviews capture overall rating plus Wi-Fi, food, cleanliness, safety, and rule flexibility

### Provider tools
- Add and edit property listings
- Include map coordinates
- Add commute information and move-in assurance details

## Demo Accounts

After seeding demo data:

| Role | Email | Password |
|------|-------|----------|
| Seeker | `demo@example.com` | `demo123` |
| Provider | `provider@example.com` | `demo123` |
| Admin | `admin@example.com` | `demo123` |

## Local Setup

### 1. Clone and install

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=roombookify
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Create `frontend/.env` if needed for frontend-specific overrides.

### 3. Start the backend

```bash
cd backend
npm run dev
```

### 4. Seed demo data

Open:

```text
http://localhost:5000/api/seed
```

The seed route is refresh-friendly and populates demo properties, rooms, bookings, and review data.

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Important Notes

- Backend startup uses safe schema checks instead of `sequelize.sync({ alter: true })`
- If port `5000` is busy, run the backend on another port, for example `PORT=5001`
- The frontend currently uses `http://localhost:5000/api` as the API base URL

## Useful Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/google`

### Properties
- `GET /api/properties`
- `GET /api/properties/:id`
- `POST /api/properties`
- `PUT /api/properties/:id`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/:id`
- `DELETE /api/bookings/:id/cancel`
- `GET /api/user/bookings`

### Reviews
- `POST /api/reviews`

### Utility
- `GET /api/health`
- `GET /api/seed`

## Build Verification

Frontend production build:

```bash
cd frontend
npm run build
```

Backend syntax checks:

```bash
node --check backend/server.js
```

## Product Direction

RoomBookify is positioned as a smarter stay-discovery platform for students, working professionals, interns, families, and travelers who care about day-to-day fit, not just listing photos.
