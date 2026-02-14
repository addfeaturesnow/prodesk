# Dive Buddy Server (SQLite Backend)

Local Node.js + Express + SQLite backend for the Dive Buddy admin platform.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Initialize the database (creates tables automatically on startup):
```bash
npm run seed
```
This populates test divers into the database.

3. Start the server:
```bash
npm run dev
```

The server runs on `http://localhost:3000` by default.

## API Endpoints

### Groups
- `GET /api/groups` - List all groups with leader and members
- `POST /api/groups` - Create a group
  - Body: `{ name, leader_id?, description? }`
- `POST /api/groups/:groupId/members` - Add a member to a group
  - Body: `{ diver_id, role? }`
- `DELETE /api/groups/:groupId/members/:memberId` - Remove a member

### Divers
- `GET /api/divers` - List all divers
- `POST /api/divers` - Create a diver (for testing)
  - Body: `{ name, email }`

## Frontend Configuration

The frontend (Vite React app) connects to this server via the `VITE_API_URL` environment variable in `.env.local`:

```
VITE_API_URL=http://localhost:3000
```

When both the server and frontend are running, the Groups page will query the local SQLite database.

## Database

- SQLite database file: `server/db.sqlite`
- Tables: `divers`, `groups`, `group_members`
- No migrations needed—tables are created on server startup via `initDb()`

## Next Steps

- Add authentication (JWT tokens)
- Add more endpoints for other features (bookings, waivers, inventory, etc.)
- Seed initial data (divers, courses, boats, etc.)
