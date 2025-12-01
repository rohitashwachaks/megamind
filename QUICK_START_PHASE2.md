# 🚀 Quick Start - Phase 2 Features

**Updated**: December 1, 2025

---

## ⚡ TL;DR - What Changed?

1. **Security hardened** - Input sanitization + rate limiting
2. **Authentication added** - Users can register/login
3. **Backup enabled** - Export your data as JSON
4. **Offline ready** - IndexedDB utilities for offline support
5. **Performance boost** - MongoDB indexes

---

## 🔧 Quick Setup (New Installation)

```bash
# 1. Backend - Install new dependencies
pip install -r backend/requirements.txt

# 2. Create environment file
cp backend/.env.example backend/.env

# 3. IMPORTANT: Edit backend/.env and set JWT_SECRET_KEY
nano backend/.env  # Change JWT_SECRET_KEY!

# 4. Create MongoDB indexes (optional)
python3 backend/db/create_indexes.py

# 5. Start backend
python3 backend/app.py

# 6. Frontend - no changes needed
npm run dev
```

---

## 🆕 New Features You Can Use Right Now

### 1. User Registration

**Browser:**
- Go to `http://localhost:5173/login`
- Click "Register"
- Enter email, password, display name
- Done!

**API:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword",
    "displayName": "Your Name"
  }'
```

### 2. Login

**Browser:**
- Go to `/login`
- Enter credentials
- Your token is stored automatically

**API:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
# Save the token from response!
```

### 3. Export Your Data

```bash
# Replace with your token
TOKEN="your-jwt-token-here"

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/users/me/export > my-backup.json
```

### 4. Continue Without Login (Phase 1 Mode)

- Just visit `http://localhost:5173/` directly
- Click "Continue without login" on login page
- Everything works as before!

---

## 💻 For Developers

### Using Auth in Your Components

```tsx
import { useAuth } from "../auth/AuthContext";

function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth();
  
  // Check if logged in
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  // Use user data
  return <div>Hello, {user.displayName}!</div>;
}
```

### Making Authenticated API Calls

```typescript
import { useAuth } from "../auth/AuthContext";
import { apiClient } from "../api/client";

const { token } = useAuth();

// All API methods now accept optional token
const courses = await apiClient.getCourses(token);
const user = await apiClient.getCurrentUser(token);
```

### Using Offline Storage

```typescript
import { saveCourse, getCourses, isOnline } from "../utils/offlineStorage";

// Save for offline
await saveCourse(courseData);

// Retrieve offline data
const cachedCourses = await getCourses();

// Check if online
if (isOnline()) {
  // Sync with server
}
```

---

## 🔐 Security Features Now Active

### Input Sanitization
All text inputs are automatically cleaned:
- **Titles/Names**: HTML stripped
- **Notes**: Only safe HTML allowed
- **URLs**: Validated

### Rate Limiting
Default limits:
- **API**: 200/day, 50/hour
- **Register**: 10/hour
- **Login**: 20/hour

Exceeding limits returns `429 Too Many Requests`

### CORS Protection
Only configured origins can access the API.

---

## 🧪 Quick Test Commands

### Test Authentication Flow
```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Extract token from response and test
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/users/me
```

### Test Rate Limiting
```bash
# Hit endpoint 60 times quickly
for i in {1..60}; do
  curl http://localhost:8000/api/v1/health
  echo "Request $i"
done
# Should see rate limit after ~50 requests
```

### Test Input Sanitization
```bash
curl -X POST http://localhost:8000/api/v1/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "<script>alert(\"xss\")</script>Safe Course",
    "source": "https://example.com"
  }'
# Script tags will be stripped
```

---

## ⚙️ Configuration Quick Reference

### Environment Variables (`backend/.env`)

```env
# Must change in production!
JWT_SECRET_KEY=your-secret-key-here

# Optional - defaults shown
JWT_ACCESS_TOKEN_EXPIRES=3600
RATE_LIMIT=200 per day, 50 per hour
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
LOG_LEVEL=INFO
```

### Generate Secure JWT Secret

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🐛 Troubleshooting

### "Invalid or expired token"
- Token expired (1 hour default)
- JWT_SECRET_KEY changed
- **Solution**: Login again

### "Too Many Requests"
- Hit rate limit
- **Solution**: Wait or adjust RATE_LIMIT in .env

### CORS errors
- Frontend origin not in CORS_ORIGINS
- **Solution**: Add to backend/.env

### Authentication not working
- JWT_SECRET_KEY not set
- Backend not restarted after .env change
- **Solution**: Set secret and restart

---

## 📚 Full Documentation

For complete details, see:
- `docs/PHASE2_IMPLEMENTATION.md` - Full Phase 2 guide
- `docs/IMPLEMENTATION_COMPLETE.md` - Complete summary
- `docs/CODE_REVIEW.md` - Code review and improvements
- `SETUP.md` - Detailed setup instructions

---

## 🎯 What's Next?

### Ready to Use Now
✅ User authentication  
✅ Data backup  
✅ Offline storage utilities  
✅ Security hardening  

### Coming Soon (Phase 3)
- Assignment tracking UI improvements
- Flashcard system
- Spaced repetition
- Better offline sync

### For Production
- Change JWT_SECRET_KEY to strong random value
- Use Redis for rate limiting
- Enable HTTPS
- Add monitoring

---

## 💡 Pro Tips

1. **Always use environment variables** - Never hardcode secrets
2. **Test rate limits in dev** - Know your limits before production
3. **Export data regularly** - Use the backup endpoint
4. **Check logs** - backend/app.py logs everything
5. **Use Phase 1 mode** - Authentication is optional

---

## 🆘 Need Help?

**Quick checks:**
1. Is backend running? `curl http://localhost:8000/api/v1/health`
2. Is .env configured? `cat backend/.env`
3. Are dependencies installed? `pip list | grep flask-limiter`
4. Check logs for errors

**Still stuck?**
- Read full documentation in `docs/`
- Check code comments
- Review error messages carefully

---

**Everything works? Great! Now go build something amazing! 🎉**
