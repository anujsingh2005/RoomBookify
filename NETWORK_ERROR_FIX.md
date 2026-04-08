# RoomBookify - "Network Error" Troubleshooting Guide

## The Problem

You're seeing "Network error. Please try again." when trying to login or register.

This means **the frontend (React) cannot reach the backend (Node.js API)**.

---

## Step-by-Step Fix

### Step 1: Verify Backend is Running

**Windows**:
1. Open Command Prompt (Win + R, type `cmd`)
2. Run:
   ```
   netstat -ano | findstr :5000
   ```
3. If you see output like `TCP 0.0.0.0:5000 ... LISTENING`, backend is running ✅
4. If no output, backend is NOT running ❌

**macOS/Linux**:
```bash
lsof -i :5000
```

---

### Step 2: Start Backend (If Not Running)

If backend is NOT running:

```bash
cd backend
npm start
```

**Expected output**:
```
✅ Database connection established
✅ Database synchronized
🚀 Server running on http://localhost:5000

📋 Available endpoints:
   - Health Check: GET http://localhost:5000/api/health
   - Login: POST http://localhost:5000/api/auth/login
   - Register: POST http://localhost:5000/api/auth/register

✅ Backend is ready! Frontend should connect now.
```

**If you see error like**: `ECONNREFUSED` or `Cannot connect to MySQL`
→ Go to **Step 3**

---

### Step 3: Check MySQL is Running

MySQL must be running for backend to work.

**Windows**:

Option A - Services App:
1. Press `Win + R`
2. Type `services.msc`
3. Look for "MySQL80" or "MySQL57"
4. If not running (status column is empty), right-click → Start

Option B - Command Prompt:
```bash
net start MySQL80
```

Option C - Check if service exists:
```bash
sc query MySQL80
```
Should show `STATE : 4 RUNNING`

**macOS**:
```bash
# If installed via Homebrew
brew services start mysql

# If installed manually
/usr/local/mysql/support-files/mysql.server start
```

**Linux**:
```bash
sudo systemctl start mysql
```

---

### Step 4: Verify Database Exists

Open MySQL client:

```bash
mysql -u root -p
```

Enter password: `Anuj2005@`

Then run:
```sql
SHOW DATABASES;
```

You should see `roombookify` in the list.

If NOT present, create it:
```sql
CREATE DATABASE roombookify;
CREATE DATABASE roombookify_test;
EXIT;
```

---

### Step 5: Test Backend Connection

**Windows Command Prompt**:
```bash
curl http://localhost:5000/api/health
```

**macOS/Linux Terminal**:
```bash
curl http://localhost:5000/api/health
```

**Expected response**:
```json
{"status":"Server is running"}
```

**If curl not found**, use browser instead:
- Open: http://localhost:5000/api/health
- Should see: `{"status":"Server is running"}`

---

### Step 6: Test Frontend Connection

Make sure frontend is also running:

```bash
cd frontend
npm run dev
```

**Expected output**:
```
VITE v3.x.x  ready in xxx ms

➜  Local:   http://localhost:3000
```

Open browser to: http://localhost:3000

---

## Quick Diagnostic Check

Run this to check everything:

**Windows**: Double-click `DIAGNOSE.bat`
**macOS/Linux**: Run `bash DIAGNOSE.sh`

---

## Common Issues & Solutions

### Issue 1: "Port 5000 already in use"

Another process is using port 5000.

**Windows**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace XXXX with PID from output)
taskkill /PID XXXX /F
```

**macOS/Linux**:
```bash
# Find process
lsof -i :5000

# Kill process (replace XXXX with PID)
kill -9 XXXX
```

Then try starting backend again.

---

### Issue 2: "Cannot connect to MySQL"

Database connection is failing.

**Checklist**:
- [ ] MySQL service is running (`sc query MySQL80`)
- [ ] Username is "root"
- [ ] Password is "Anuj2005@" (check .env file)
- [ ] Database "roombookify" exists

**Fix**:
```bash
# Verify credentials
mysql -u root -p
# Enter: Anuj2005@

# If successful, you'll see: mysql>
# Type: EXIT
```

If password is wrong, check `.env` file:
```
DB_USER=root
DB_PASSWORD=Anuj2005@
DB_NAME=roombookify
```

---

### Issue 3: "Database not synchronized"

Backend can't create tables.

**Solution**:
1. Check database exists: `SHOW DATABASES;`
2. Check user permissions: Run backend, watch console
3. Delete database and recreate:
   ```sql
   DROP DATABASE roombookify;
   CREATE DATABASE roombookify;
   EXIT;
   ```
4. Restart backend: `npm start`

---

### Issue 4: "CORS Error" or "Blocked by CORS policy"

Frontend blocked from accessing backend.

**Solution**:
Check `.env` file in backend folder:
```
FRONTEND_URL=http://localhost:3000
```

Should be exactly that. Then restart backend.

---

## Full Restart Procedure

If all else fails, do a complete restart:

1. **Kill existing processes**:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID XXXX /F

   netstat -ano | findstr :3000
   taskkill /PID YYYY /F
   ```

2. **Verify MySQL is running**:
   ```bash
   net start MySQL80
   ```

3. **Start Backend fresh**:
   ```bash
   cd backend
   npm start
   # Wait for: ✅ Backend is ready!
   ```

4. **In new terminal, start Frontend**:
   ```bash
   cd frontend
   npm run dev
   # Wait for: ➜ Local: http://localhost:3000
   ```

5. **Test in browser**: http://localhost:3000

---

## Debug with Browser DevTools

1. Open http://localhost:3000
2. Press `F12` (DevTools)
3. Go to "Network" tab
4. Try to login
5. Look for failed requests
6. Click on failed request
7. Check "Response" tab for error message

Common error responses:
- `401 Unauthorized` → Wrong credentials
- `500 Internal Server Error` → Backend error, check console
- `Connection refused` → Backend not running
- `404 Not Found` → Wrong API endpoint

---

## Still Not Working?

Try these in order:

1. **Browser Cache**:
   - Open DevTools (F12)
   - Right-click refresh → "Empty cache and hard refresh"

2. **Clear localStorage**:
   - DevTools → Console
   - Type: `localStorage.clear()`
   - Press Enter

3. **Different Browser**:
   - Try Chrome, Firefox, Safari
   - Rules out browser-specific issues

4. **Ports**:
   - Change frontend port in `vite.config.js` to 3001
   - Change backend port in `.env` to 5001
   - Update frontend API calls to 5001

5. **Restart Everything**:
   - Close all terminals
   - Restart your computer
   - Follow "Full Restart Procedure" above

---

## What Should Work

After fixing:

1. ✅ Backend running on http://localhost:5000
2. ✅ Frontend running on http://localhost:3000
3. ✅ Can access http://localhost:5000/api/health
4. ✅ Can login at http://localhost:3000 with:
   - Email: guest@example.com
   - Password: password123

---

## Emergency Checklist

- [ ] MySQL is running (check services.msc)
- [ ] Backend terminal shows "✅ Backend is ready!"
- [ ] Frontend terminal shows "➜ Local: http://localhost:3000"
- [ ] No red errors in backend console
- [ ] Can access http://localhost:5000/api/health
- [ ] Browser shows http://localhost:3000 (not localhost:5000)

If all checked, refresh browser and try login again!

---

Need more help? Check:
- Backend console for specific errors
- Browser DevTools Network tab for request failures
- .env file for correct credentials
- MySQL service status
