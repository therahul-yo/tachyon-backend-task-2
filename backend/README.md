# Task Manager Backend (Node.js + Express + SQLite)

## Setup

1. Install Node.js (v18+ recommended).
2. From this folder, install deps:
   ```
   cd backend
   npm install
   ```
3. Copy environment example:
   ```
   cp .env.example .env
   ```
4. Run the server:
   ```
   npm run dev
   ```
5. Server runs at http://localhost:4000 by default.

## API Endpoints

- `POST /api/tasks` - create a task. Body: { title, description, status, dueDate } (requires JWT)
- `GET /api/tasks` - list tasks. Query: page, limit, status
- `GET /api/tasks/:id` - get task
- `PUT /api/tasks/:id` - update task (requires JWT)
- `DELETE /api/tasks/:id` - delete task (requires JWT)

Auth:
- `POST /auth/register` { username, password } -> { token }
- `POST /auth/login` { username, password } -> { token }
- `GET /auth/github` -> GitHub OAuth start (requires client id/secret)
- `GET /auth/github/callback` -> OAuth callback

Socket.IO:
- Server is available on same host. Emit `join` and `message` events from client.
