# RepliTube

RepliTube is a full-stack SaaS application that allows users to upload videos directly to their YouTube channel from a dashboard.

## Features
- Google OAuth 2.0 Authentication
- Direct video upload to YouTube via YouTube Data API v3
- MongoDB Atlas for data storage
- Node.js and Express backend

## Setup
1. Clone the repository.
2. Create a `.env` file based on `.env.sample`.
3. Run `npm install` in the backend directory.
4. Start the server with `node server.js`.
5. Access the app at `http://localhost:5000`.

## Endpoints
- `GET /auth/login` - Start Google OAuth
- `GET /auth/callback` - Handle token exchange
- `POST /upload/video/:userId` - Upload video