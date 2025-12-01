# Database Schema Design

## Overview
This document describes the MongoDB database schema for PocketSchool with separation of concerns between:
- **Generic course catalog data** (public)
- **User-specific data** (private, requires authentication)

## Collections

### 1. Users Collection

Stores user account information and authentication data.

**Collection Name:** `users`

**Schema:**
```json
{
  "_id": ObjectId,
  "id": "string (UUID)",           // Primary key
  "email": "string (unique)",      // User email (for authentication)
  "passwordHash": "string",        // Encrypted password
  "displayName": "string",         // User's display name
  "focusCourseId": "string|null",  // Current focus course (optional)
  "createdAt": "ISO 8601 string",  // Account creation timestamp
  "updatedAt": "ISO 8601 string"   // Last update timestamp
}
```

**Indexes:**
- `id` (unique)
- `email` (unique)

---

### 2. Courses Collection (Course Catalog)

Stores the catalog of all available courses. This is **public data** that anyone can browse.

**Collection Name:** `courses`

**Schema:**
```json
{
  "_id": ObjectId,
  "id": "string (UUID)",              // Primary key
  "title": "string",                  // Course title
  "description": "string",            // Course description
  "source": "string (URL)",           // Original course URL
  "tags": ["string"],                 // Course tags/categories
  "lectures": [                       // Array of lecture metadata
    {
      "id": "string (UUID)",          // Lecture primary key
      "order": "number",              // Lecture order in course
      "title": "string",              // Lecture title
      "videoUrl": "string (URL)",     // Video URL
      "durationMinutes": "number",    // Duration (optional)
      "createdAt": "ISO 8601 string",
      "updatedAt": "ISO 8601 string"
    }
  ],
  "assignments": [                    // Array of assignment metadata
    {
      "id": "string (UUID)",          // Assignment primary key
      "title": "string",              // Assignment title
      "link": "string (URL)",         // Assignment URL (optional)
      "createdAt": "ISO 8601 string",
      "updatedAt": "ISO 8601 string"
    }
  ],
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string"
}
```

**Notes:**
- Lectures and assignments in this collection contain only **generic metadata**
- No user-specific data (status, notes, progress) is stored here
- This data is publicly accessible for browsing

**Indexes:**
- `id` (unique)
- `tags` (for filtering)

---

### 3. UserCourseData Collection

Stores **user-specific** course data including progress, notes, and status.

**Collection Name:** `user_course_data`

**Schema:**
```json
{
  "_id": ObjectId,
  "id": "string (UUID)",              // Primary key
  "userId": "string (UUID)",          // Foreign key -> users.id
  "courseId": "string (UUID)",        // Foreign key -> courses.id
  "status": "string",                 // Course status: active|completed|parked
  "notes": "string",                  // User's course notes
  "lectures": [                       // User-specific lecture data
    {
      "lectureId": "string (UUID)",   // Foreign key -> courses.lectures[].id
      "status": "string",             // not_started|in_progress|completed
      "note": "string",               // User's lecture notes
      "updatedAt": "ISO 8601 string"
    }
  ],
  "assignments": [                    // User-specific assignment data
    {
      "assignmentId": "string (UUID)", // Foreign key -> courses.assignments[].id
      "status": "string",             // not_started|in_progress|submitted|skipped
      "dueDate": "ISO 8601 string",   // User's custom due date (optional)
      "note": "string",               // User's assignment notes
      "updatedAt": "ISO 8601 string"
    }
  ],
  "createdAt": "ISO 8601 string",     // When user enrolled in course
  "updatedAt": "ISO 8601 string"
}
```

**Notes:**
- One document per user per course
- Links to generic course/lecture/assignment data via IDs
- Only accessible by authenticated users
- Contains all user-specific progress and customizations

**Indexes:**
- `id` (unique)
- `userId` (for user queries)
- `courseId` (for course queries)
- `userId + courseId` (compound unique index)

---

## Data Access Patterns

### Public (Unauthenticated) Access
- **Browse courses catalog:** Read from `courses` collection
- **View course details:** Read specific course from `courses` collection
- **View lecture/assignment metadata:** Read from embedded arrays in `courses`

### Authenticated Access
- **User profile:** Read from `users` collection
- **User's enrolled courses:** Read from `user_course_data` filtered by `userId`
- **User's course progress:** Combine data from `courses` + `user_course_data`
- **Update progress:** Update specific document in `user_course_data`

---

## Migration from Current Schema

### Current State
- Courses have embedded user-specific data (status, notes on lectures/assignments)
- Single user mode with hardcoded user

### Migration Steps
1. Create new `user_course_data` collection
2. For each course in current `courses` collection:
   - Extract user-specific fields (status, notes)
   - Create corresponding document in `user_course_data`
   - Remove user-specific fields from `courses` collection
3. Clean up `courses` collection to only have catalog data

---

## Benefits of This Design

1. **Clear Separation:** Public catalog data vs. private user data
2. **Scalability:** Multiple users can have different progress on same course
3. **Efficiency:** Public data cached and served without authentication
4. **Flexibility:** Easy to add new courses without affecting user data
5. **Privacy:** User progress and notes are isolated per user
