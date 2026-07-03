# Saylani Mass IT Hub

A production-ready full-stack campus portal for **Saylani Mass IT Training Program**, built with modern web technologies.

## Tech Stack

**Frontend:** Next.js 15, React 19, Bootstrap 5, Three.js, React Three Fiber, Framer Motion, GSAP, Recharts, Socket.IO Client
**Backend:** Node.js, Express.js, MongoDB (Atlas), Mongoose, JWT, Socket.IO, Cloudinary, Multer

## Features

- 3D Landing Page with Three.js & GLSL Shaders
- JWT Authentication (Register, Login, Logout)
- Role-Based Access (User / Admin)
- Interactive Dashboard with Charts & Analytics
- Lost & Found Management with Smart Matching
- Complaint Management System
- Volunteer Registration & Approval
- Real-time Notifications via Socket.IO
- Admin Panel (Manage Users, Complaints, Items, Volunteers)
- Dark Mode Support
- Glassmorphism UI Design
- Cloudinary Image Upload
- Responsive Design

## Project Structure

```
saylani-mass-it-hub/
├── client/          # Next.js Frontend
│   ├── app/         # Pages (App Router)
│   ├── components/  # Reusable components
│   ├── context/     # Auth context
│   ├── hooks/       # Custom hooks
│   ├── services/    # API layer
│   ├── shaders/     # GLSL shaders
│   ├── styles/      # Global styles
│   └── utils/       # Helper functions
└── server/          # Express Backend
    ├── config/      # Database & Cloudinary config
    ├── controllers/ # Route controllers
    ├── middleware/   # Auth, upload, error handling
    ├── models/      # Mongoose models
    ├── routes/      # API routes
    ├── socket/      # Socket.IO handler
    └── utils/       # Utilities
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository

```bash
git clone <repo-url>
cd saylani-mass-it-hub
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.xxxxx.mongodb.net/saylani-hub
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env.local` in `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the client:

```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Create Admin Account

- Register a user at `/signup`
- Set the user's role to `admin` in MongoDB directly, or use the API:

```bash
curl -X PUT http://localhost:5000/api/users/<user-id>/role \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}' \
  --cookie "token=<jwt-token>"
```

## Deployment

### Frontend (Vercel)

```bash
cd client
npx vercel
```

Set environment variable: `NEXT_PUBLIC_API_URL` = your Railway backend URL

### Backend (Railway)

```bash
cd server
# Connect to Railway and deploy
```

Set all environment variables from `.env` in Railway dashboard.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |
| GET | /api/users | [Admin] Get all users |
| DELETE | /api/users/:id | [Admin] Delete user |
| PUT | /api/users/:id/role | [Admin] Update role |
| POST | /api/complaints | Create complaint |
| GET | /api/complaints | Get complaints |
| PUT | /api/complaints/:id | Update complaint |
| PUT | /api/complaints/:id/status | [Admin] Update status |
| DELETE | /api/complaints/:id | Delete complaint |
| POST | /api/lost-found | Create item |
| GET | /api/lost-found | Get items |
| PUT | /api/lost-found/:id/status | [Admin] Update status |
| DELETE | /api/lost-found/:id | Delete item |
| POST | /api/volunteers | Register volunteer |
| GET | /api/volunteers | Get volunteers |
| PUT | /api/volunteers/:id/status | [Admin] Update status |
| GET | /api/notifications | Get notifications |
| PUT | /api/notifications/:id/read | Mark as read |
| PUT | /api/notifications/read-all | Mark all read |

## License

MIT


ASadasdasd