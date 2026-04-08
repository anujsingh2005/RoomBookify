# Google OAuth2 Setup Guide for RoomBookify

## 🔐 Getting Google Credentials

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project selector at the top
3. Click "NEW PROJECT"
4. Enter project name (e.g., "RoomBookify")
5. Click "Create"

### Step 2: Enable Google+ API
1. In the Google Cloud Console, go to APIs & Services
2. Click "Enable APIs and Services"
3. Search for "Google+ API"
4. Click on it and press "Enable"

### Step 3: Create OAuth2 Credentials
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Fill in the form:
   - **Name**: RoomBookify OAuth Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `http://localhost:5000`
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback`
5. Click "Create"
6. Copy the Client ID and Client Secret

---

## ⚙️ Backend Configuration

### Update `.env` file:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### Install Dependencies:
```bash
cd backend
npm install passport passport-google-oauth20 express-session
```

### Database Changes:
The User model has been updated with Google OAuth fields:
- `googleId` - Stores Google user ID
- `googleProfilePicture` - Stores profile image
- `authProvider` - Tracks if user logged in via 'local' or 'google'

---

## 🎨 Frontend Configuration

### Already Configured:
✅ Login page with "Continue with Google" button
✅ Register page with "Continue with Google" button
✅ OAuth redirect handling
✅ Automatic token storage and redirect

### Flow:
1. User clicks "Continue with Google"
2. Redirected to: `http://localhost:5000/api/auth/google`
3. Google OAuth consent screen appears
4. User grants permission
5. Redirected back to callback with user data
6. JWT token generated and stored in localStorage
7. User automatically redirected to dashboard/results

---

## 🧪 Testing Google OAuth

### Login with Google:
1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. Select or sign in with a Google account
4. Allow permissions
5. You should be redirected and logged in

### Register with Google:
1. Go to http://localhost:3000/register
2. Click "Sign Up with Google"
3. Complete the flow
4. Account created with role 'seeker' by default

---

## 📝 Important Notes

### Password Not Required for Google Users:
- `password_hash` is nullable for Google OAuth users
- Google handles password security
- Users can't use password login if registered via Google

### Automatic Account Creation:
- First-time Google login creates a new account
- Existing users linking Google adds OAuth data
- Email must be unique

### Production Deployment:
Before deploying to production:
1. Update OAuth redirect URIs in Google Cloud Console
2. Change `FRONTEND_URL` and `GOOGLE_CALLBACK_URL` to production domain
3. Use secure JWT_SECRET
4. Enable HTTPS
5. Add production domain to CORS origins

---

## 🔗 API Endpoints

### Google OAuth Routes:
- **GET** `/api/auth/google` - Starts Google OAuth flow
- **GET** `/api/auth/google/callback` - OAuth callback (handles redirect)

### Response Format:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@gmail.com",
    "role": "seeker",
    "googleProfilePicture": "https://..."
  }
}
```

---

## 🐛 Troubleshooting

### "redirect_uri_mismatch" Error:
- Verify GOOGLE_CALLBACK_URL matches Google Console settings
- Check for trailing slashes
- Ensure http:// or https:// matches

### Google Account Not Found:
- Check browser cookies/cache
- Try incognito mode
- Verify Google Cloud project is enabled

### Token Not Storing:
- Check localStorage is enabled
- Look at browser console for errors
- Verify JWT_SECRET is set in backend

---

## 📦 Environment Variables Checklist

Backend `.env`:
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `GOOGLE_CALLBACK_URL`
- ✅ `FRONTEND_URL`
- ✅ `JWT_SECRET`
- ✅ `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

---

## 🎯 Next Steps

1. Get Google OAuth credentials from Google Cloud Console
2. Update backend `.env` file
3. Restart backend server
4. Test login/register with Google
5. Verify user data in database

Happy authenticating! 🚀
