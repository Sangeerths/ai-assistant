Quick server for ai-assistant

This small Express + Mongoose server stores candidate results in MongoDB.

Prereqs
- Node.js (16+)
- MongoDB running locally or a MongoDB URI

Setup
1. cd server
2. cp .env.example .env and edit MONGODB_URI if needed
3. npm install
4. npm run dev

The server listens on the port specified in .env (default 4000).

API


The frontend will POST interview results to this server on finish. If the server is unavailable, the frontend falls back to storing the candidate in localStorage.