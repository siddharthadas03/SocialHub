# SocialHub

A full-stack MERN social feed app with JWT authentication, image uploads, likes, and comments.

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Add your MongoDB Atlas URI and JWT secret to `backend/.env`.

4. Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`
