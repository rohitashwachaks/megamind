# PocketSchool – REST API Common Schemas

Single source of truth for the shared request/response shapes across endpoints. Keep payloads stable and additive; avoid one-off shapes per route.

## Conventions

- Base path: `/api/v1`. JSON only. Field names are `camelCase`.
- IDs: UUID v4 strings; generated server-side unless noted.
- Timestamps: ISO-8601 UTC strings (`createdAt`, `updatedAt`).
- Auth: access token in `Authorization: Bearer <token>`; refresh token via HTTP-only cookie or refresh endpoint body.
- Enums: `courseStatus = active|completed|parked`, `lectureStatus = not_started|in_progress|completed`, `assignmentStatus = not_started|in_progress|submitted|skipped`.

## Response Envelope

- Success: `{ "data": <payload>, "meta": { "traceId": "uuid", "pagination?": {...} } }`
- Error: `{ "error": { "code": "string", "message": "human readable", "fields?": { "<field>": "reason" } }, "meta": { "traceId": "uuid" } }`
- Pagination meta (for list endpoints): `{ "page": 1, "pageSize": 50, "total": 120, "hasNext": true }`

## Core Resource Schemas

### User

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "displayName": "Learner",
  "focusCourseId": "uuid|null",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Course

```json
{
  "id": "uuid",
  "title": "6.006 Introduction to Algorithms",
  "description": "Design and analysis of algorithms.",
  "source": "https://ocw.mit.edu/...",
  "status": "active",
  "tags": ["algorithms", "mit-ocw"],
  "notes": "Optional longform notes",
  "lectures": [/* Lecture */],
  "assignments": [/* Assignment */],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T12:00:00Z"
}
```

### Lecture

```json
{
  "id": "uuid",
  "courseId": "uuid",
  "order": 1,
  "title": "Lecture 1 – Algorithmic Thinking",
  "videoUrl": "https://ocw.mit.edu/...",
  "durationMinutes": 50,
  "status": "in_progress",
  "note": "Quick reflection",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T12:00:00Z"
}
```

### Assignment

```json
{
  "id": "uuid",
  "courseId": "uuid",
  "title": "Problem Set 1 – Divide & Conquer",
  "status": "not_started",
  "dueDate": "2024-02-01",
  "link": "https://ocw.mit.edu/...",
  "note": "Submission link or reflection",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T12:00:00Z"
}
```

## Request Payloads (By Intent)

- Register: `{ "email": "user@example.com", "password": "min 8 chars", "displayName": "Learner" }`
- Login: `{ "email": "user@example.com", "password": "string" }`
- Refresh: `{ "refreshToken": "string" }` (or HTTP-only cookie)
- Update profile: `{ "displayName": "New Name" }`
- Set focus course: `{ "courseId": "uuid|null" }`

- Create course: `{ "title": "...", "source": "https://...", "description?": "...", "tags?": ["..."] }`
- Update course: `{ "title?": "...", "description?": "...", "source?": "...", "status?": "active|completed|parked", "notes?": "...", "tags?": ["..."] }`

- Create lecture: `{ "title": "...", "order": 1, "videoUrl": "https://...", "durationMinutes?": 50, "note?": "..." }`
- Update lecture: `{ "title?": "...", "order?": 2, "videoUrl?": "https://...", "durationMinutes?": 45, "status?": "completed", "note?": "..." }`

- Create assignment: `{ "title": "...", "link?": "https://...", "dueDate?": "YYYY-MM-DD", "note?": "..." }`
- Update assignment: `{ "title?": "...", "status?": "in_progress|submitted|skipped|not_started", "link?": "https://...", "dueDate?": "YYYY-MM-DD", "note?": "..." }`

## Validation Rules (Shared)

- `title`, `email`, `source`, `videoUrl` are required where shown; URLs must be valid HTTP/HTTPS.
- `order` ≥ 1; `durationMinutes` ≥ 1 when provided.
- `dueDate` uses `YYYY-MM-DD`.
- Enforce enum membership for all status fields; reject unknown values with `400` and `fields` map.
- All create/update write operations return the canonical resource in `data` to keep client state in sync.
