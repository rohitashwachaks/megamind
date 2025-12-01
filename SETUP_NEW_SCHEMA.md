# Quick Setup Guide - New Authentication & Schema

## 🚀 Quick Start (5 minutes)

### Prerequisites
- MongoDB running locally or accessible via connection string
- Python 3.8+ with required dependencies installed
- Node.js and npm installed

### Step 1: Seed the Database

```bash
cd backend
python db/seed_new_schema.py
```

This creates:
- ✅ 3 sample courses (MIT OpenCourseWare)
- ✅ Demo user account
- ✅ Sample user progress data

**Demo Account:**
- **Email:** `demo@pocketschool.app`
- **Password:** `password123`

### Step 2: Create Database Indexes

```bash
python db/create_indexes.py
```

This optimizes queries for:
- Users (by id, email)
- Courses (by id, tags)
- UserCourseData (by userId, courseId)

### Step 3: Start the Backend

```bash
# Make sure you're in the backend directory
python app.py
```

Backend will start on `http://localhost:8000`

### Step 4: Start the Frontend

```bash
# From the project root
npm run dev
```

Frontend will start on `http://localhost:5173` (or your configured port)

### Step 5: Test the Application

1. **Visit the landing page**: `http://localhost:5173/`
   - You should see the public landing page
   - Browse courses without logging in

2. **Click "Get Started" or "Login"**
   - Use the demo credentials above
   - You'll be redirected to `/dashboard`

3. **Test user-specific features**:
   - View your enrolled courses
   - Update lecture status
   - Add notes to lectures
   - Set a focus course

---

## 📋 What's New?

### Database Schema
- **3 collections**: `users`, `courses` (public catalog), `user_course_data` (private)
- **Separation of concerns**: Public data vs. user-specific data
- **See**: `docs/DATABASE_SCHEMA.md` for details

### Frontend
- **New Landing Page**: Public route at `/`
- **Dashboard**: Moved to `/dashboard` (requires auth)
- **Logout**: Available in the app header

### Backend
- **New Routes**: 
  - `POST /courses/:id/enroll` - Enroll in a course
  - `PATCH /courses/:id/user-data` - Update user course data
  - `PATCH /courses/:id/lectures/:lid/user-data` - Update lecture progress
  - `PATCH /courses/:id/assignments/:aid/user-data` - Update assignment data
- **Optional Auth**: `GET /courses` works with or without authentication

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in the backend directory:

```bash
# MongoDB
MONGO_URI=mongodb://localhost:27017/
MONGO_DB_NAME=megamind

# JWT
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRES=3600

# Flask
FLASK_PORT=8000
FLASK_ENV=development

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🧪 Testing the Flow

### Test Public Access
```bash
# Without authentication - get public catalog
curl http://localhost:8000/api/v1/courses
```

### Test Authentication
```bash
# Register new user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test User Enrollment
```bash
# Enroll in a course (requires token from login)
curl -X POST http://localhost:8000/api/v1/courses/mit-6006/enroll \
  -H "Authorization: Bearer <your-token>"

# Update lecture progress
curl -X PATCH http://localhost:8000/api/v1/courses/mit-6006/lectures/l1/user-data \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "note": "Great lecture!"
  }'
```

---

## 📚 Additional Documentation

- **`IMPLEMENTATION_GUIDE.md`** - Comprehensive implementation details
- **`docs/DATABASE_SCHEMA.md`** - Database schema documentation
- **`docs/PHASE2_IMPLEMENTATION.md`** - Original Phase 2 documentation

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Port Already in Use
```bash
# Change backend port in .env
FLASK_PORT=8001

# Change frontend port in vite.config.ts
server: { port: 5174 }
```

### Database Already Seeded
The seed script clears existing data. To preserve data:
1. Comment out the `delete_many` lines in `seed_new_schema.py`
2. Or manually insert data using mongosh

---

## ✅ Verification Checklist

After setup, verify:

- [ ] MongoDB is running and accessible
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Landing page loads at `/`
- [ ] Can browse courses without login
- [ ] Can login with demo account
- [ ] Dashboard loads at `/dashboard` after login
- [ ] Can see enrolled courses with progress
- [ ] Can update lecture status
- [ ] Can logout

---

## 🎉 Success!

If all checks pass, you're ready to use the new multi-user PocketSchool!

**Next Steps:**
- Create your own account
- Browse and enroll in courses
- Start tracking your learning progress
- Add personal notes to lectures

For detailed information about the changes, see `IMPLEMENTATION_GUIDE.md`.
