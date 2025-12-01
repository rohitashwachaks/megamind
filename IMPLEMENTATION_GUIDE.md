# PocketSchool Authentication & Schema Redesign - Implementation Guide

## Overview

This document describes the comprehensive redesign of PocketSchool's authentication system and database schema, transitioning from a single-user application to a multi-user platform with public and private data separation.

## Table of Contents

1. [What Changed](#what-changed)
2. [New Database Schema](#new-database-schema)
3. [Backend Changes](#backend-changes)
4. [Frontend Changes](#frontend-changes)
5. [Setup Instructions](#setup-instructions)
6. [API Changes](#api-changes)
7. [Migration Guide](#migration-guide)

---

## What Changed

### High-Level Changes

**Before:**
- Single user application
- All data (courses, lectures, assignments) contained user-specific state
- No authentication required
- Dashboard as the landing page

**After:**
- Multi-user platform with authentication
- Separation of public catalog data and user-specific progress data
- Public landing page accessible to everyone
- User-specific dashboards for authenticated users
- Users can browse courses publicly, but need to login to track progress

### Key Benefits

1. **Scalability**: Multiple users can use the same course catalog
2. **Privacy**: User progress and notes are isolated per user
3. **Public Access**: Anyone can browse available courses
4. **Better UX**: Clear separation between public and personalized views

---

## New Database Schema

### Collections

#### 1. **users** Collection
Stores user account information.

```javascript
{
  id: "uuid",                    // Primary key
  email: "user@example.com",     // Unique, for authentication
  passwordHash: "hashed_pwd",    // Encrypted password
  displayName: "User Name",      // Display name
  focusCourseId: "course_id",    // Optional focus course
  createdAt: "ISO_8601",
  updatedAt: "ISO_8601"
}
```

#### 2. **courses** Collection (Public Catalog)
Stores course catalog - publicly accessible metadata only.

```javascript
{
  id: "uuid",
  title: "Course Title",
  description: "Course description",
  source: "https://...",         // Original course URL
  tags: ["tag1", "tag2"],
  lectures: [                    // Generic lecture metadata only
    {
      id: "uuid",
      order: 1,
      title: "Lecture Title",
      videoUrl: "https://...",
      durationMinutes: 60,
      createdAt: "ISO_8601",
      updatedAt: "ISO_8601"
    }
  ],
  assignments: [                 // Generic assignment metadata only
    {
      id: "uuid",
      title: "Assignment Title",
      link: "https://...",
      createdAt: "ISO_8601",
      updatedAt: "ISO_8601"
    }
  ],
  createdAt: "ISO_8601",
  updatedAt: "ISO_8601"
}
```

**Note:** No `status`, `notes`, or user-specific fields in courses collection.

#### 3. **user_course_data** Collection (User-Specific Data)
Stores user progress, notes, and customizations.

```javascript
{
  id: "uuid",                    // Primary key
  userId: "user_id",             // Foreign key -> users.id
  courseId: "course_id",         // Foreign key -> courses.id
  status: "active",              // active|completed|parked
  notes: "User's course notes",
  lectures: [                    // User-specific lecture data
    {
      lectureId: "lecture_id",   // Foreign key -> courses.lectures[].id
      status: "completed",       // not_started|in_progress|completed
      note: "User's notes",
      updatedAt: "ISO_8601"
    }
  ],
  assignments: [                 // User-specific assignment data
    {
      assignmentId: "assign_id", // Foreign key -> courses.assignments[].id
      status: "in_progress",     // not_started|in_progress|submitted|skipped
      dueDate: "2024-02-01",     // User's custom due date
      note: "User's notes",
      updatedAt: "ISO_8601"
    }
  ],
  createdAt: "ISO_8601",
  updatedAt: "ISO_8601"
}
```

**Unique Index:** `userId + courseId` (one record per user per course)

---

## Backend Changes

### New Files Created

1. **`backend/db/base.py`** - Updated with new methods:
   - `get_enriched_courses(user_id)` - Combines catalog + user data
   - `get_user_course_data(user_id, course_id)`
   - `create_user_course_data(data)`
   - `update_user_lecture_data(user_id, course_id, lecture_id, updates)`
   - `update_user_assignment_data(user_id, course_id, assignment_id, updates)`

2. **`backend/db/mongo.py`** - Implemented all UserCourseData methods

3. **`backend/user_course_routes.py`** - New routes for user-specific data:
   - `POST /api/v1/courses/<id>/enroll` - Enroll in course
   - `PATCH /api/v1/courses/<id>/user-data` - Update course status/notes
   - `PATCH /api/v1/courses/<id>/lectures/<lid>/user-data` - Update lecture progress
   - `PATCH /api/v1/courses/<id>/assignments/<aid>/user-data` - Update assignment progress

4. **`backend/db/seed_new_schema.py`** - Database seeding script for new schema

5. **`backend/db/create_indexes.py`** - Updated with user_course_data indexes

6. **`docs/DATABASE_SCHEMA.md`** - Comprehensive schema documentation

### Modified Files

1. **`backend/app.py`**:
   - Updated user endpoints to require authentication
   - Updated `GET /courses` to support optional authentication
   - Imported and registered user course routes

2. **`backend/auth.py`**: Already had authentication (no changes needed)

### API Endpoint Changes

#### Authentication Required (New Behavior)
- `GET /api/v1/users/me` - Now requires token
- `PATCH /api/v1/users/me` - Now requires token  
- `PATCH /api/v1/users/me/focus-course` - Now requires token
- `GET /api/v1/users/me/export` - Now requires token

#### Optional Authentication
- `GET /api/v1/courses` - Public catalog OR enriched with user data if authenticated

#### New Endpoints
- `POST /api/v1/courses/<id>/enroll` - Enroll in a course (creates UserCourseData)
- `PATCH /api/v1/courses/<id>/user-data` - Update user-specific course data
- `PATCH /api/v1/courses/<id>/lectures/<lid>/user-data` - Update lecture progress
- `PATCH /api/v1/courses/<id>/assignments/<aid>/user-data` - Update assignment data

---

## Frontend Changes

### New Files Created

1. **`src/pages/LandingPage.tsx`** - Public landing page:
   - Shows course catalog to everyone
   - Prompts login for personalized features
   - Redirects authenticated users to dashboard

2. **`src/pages/LandingPage.css`** - Styling for landing page

### Modified Files

1. **`src/App.tsx`**:
   - Changed root route (`/`) to `<LandingPage />`
   - Moved dashboard to `/dashboard`
   - Separated public and protected routes

2. **`src/components/AppShell.tsx`**:
   - Updated navigation links to point to `/dashboard`
   - Added logout button in header
   - Uses `useAuth` hook for user state

3. **`src/components/BottomNav.tsx`**:
   - Updated navigation to point to `/dashboard`

### Routing Structure

```
Public Routes (no AppShell):
  / - LandingPage
  /login - LoginPage

Protected Routes (with AppShell):
  /dashboard - DashboardPage
  /courses - CoursesPage
  /courses/:id - CourseDetailPage
  /courses/:id/lectures/:lid - LectureDetailPage
  /assignments - AssignmentsPage
```

---

## Setup Instructions

### 1. Install Dependencies

Backend requires no new dependencies (already has pymongo, werkzeug, etc.)

### 2. Set Up Database

#### Option A: Fresh Setup

```bash
cd backend

# Seed the database with new schema
python db/seed_new_schema.py

# Create indexes for performance
python db/create_indexes.py
```

This will create:
- 3 sample courses in the catalog
- 1 demo user (email: `demo@pocketschool.app`, password: `password123`)
- Sample user course data for the demo user

#### Option B: Migrate Existing Data

If you have existing data, you'll need to:

1. **Backup your current database**
2. **Extract user-specific data** from courses collection
3. **Clean courses collection** (remove status, notes fields)
4. **Create user_course_data** documents for each user-course combination

A migration script can be created if needed.

### 3. Start the Application

#### Backend
```bash
cd backend
python app.py
```

#### Frontend
```bash
npm run dev
```

### 4. Test the Flow

1. **Visit `/`** - See the public landing page
2. **Click "Login"** or **"Get Started"**
3. **Login with**: `demo@pocketschool.app` / `password123`
4. **You'll be redirected to `/dashboard`** - Your personalized dashboard
5. **Browse courses** - Now with your progress and notes

---

## API Changes

### GET /api/v1/courses

**Before:**
```javascript
// Always returned user-specific data
{
  data: [
    {
      id: "...",
      status: "active",        // User-specific
      notes: "My notes",       // User-specific
      lectures: [
        {
          status: "completed", // User-specific
          note: "..."          // User-specific
        }
      ]
    }
  ]
}
```

**After:**
```javascript
// Without auth token - public catalog
{
  data: [
    {
      id: "...",
      title: "...",
      lectures: [
        {
          id: "...",
          title: "...",
          videoUrl: "...",
          // No status, no notes
        }
      ]
    }
  ]
}

// With auth token - enriched with user data
{
  data: [
    {
      id: "...",
      status: "active",        // From user_course_data
      notes: "My notes",       // From user_course_data
      lectures: [
        {
          status: "completed", // From user_course_data
          note: "..."          // From user_course_data
        }
      ]
    }
  ]
}
```

### New: POST /api/v1/courses/:id/enroll

Enroll in a course (requires authentication).

**Request:**
```javascript
POST /api/v1/courses/mit-6006/enroll
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  data: {
    id: "...",
    userId: "user-123",
    courseId: "mit-6006",
    status: "active",
    notes: "",
    lectures: [],
    assignments: [],
    createdAt: "...",
    updatedAt: "..."
  }
}
```

### New: PATCH /api/v1/courses/:id/lectures/:lid/user-data

Update lecture progress (requires authentication, auto-enrolls if needed).

**Request:**
```javascript
PATCH /api/v1/courses/mit-6006/lectures/l1/user-data
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "note": "Great introduction to algorithms"
}
```

**Response:**
```javascript
{
  data: {
    // Updated user_course_data document
  }
}
```

---

## Migration Guide

### For Existing Users

If you have an existing database with the old schema:

1. **Backup your database**:
   ```bash
   mongodump --uri="mongodb://localhost:27017/megamind" --out=backup
   ```

2. **Run the new seed script** (this will clear and reseed):
   ```bash
   python backend/db/seed_new_schema.py
   ```

3. **Or create a custom migration** to preserve existing data:
   - Extract user data from courses
   - Create user records in `users` collection
   - Clean courses collection (remove user-specific fields)
   - Create `user_course_data` records

### Breaking Changes

1. **GET /courses** now returns different data based on authentication
2. **User endpoints** now require authentication tokens
3. **Dashboard route** moved from `/` to `/dashboard`
4. **Lecture/Assignment updates** now use separate endpoints for user data

---

## Testing Checklist

- [ ] Public landing page loads without authentication
- [ ] Can browse courses without logging in
- [ ] Login/Register flow works
- [ ] After login, redirected to dashboard
- [ ] Dashboard shows user-specific data
- [ ] Can enroll in a new course
- [ ] Can update lecture status and notes
- [ ] Can update assignment status and custom due dates
- [ ] Can set focus course
- [ ] Logout works and redirects to landing page
- [ ] Navigation links work correctly
- [ ] Mobile bottom navigation works

---

## Summary

This redesign successfully transforms PocketSchool from a single-user app to a multi-user platform while maintaining a clean separation between public catalog data and private user data. The new architecture is more scalable, privacy-conscious, and provides a better user experience with public browsing and personalized tracking.

**Key Files to Review:**
- `docs/DATABASE_SCHEMA.md` - Detailed schema documentation
- `backend/user_course_routes.py` - New user data endpoints
- `backend/db/mongo.py` - Database implementation
- `src/pages/LandingPage.tsx` - New public landing page
- `backend/db/seed_new_schema.py` - Database seeding

For questions or issues, refer to the inline code documentation.
