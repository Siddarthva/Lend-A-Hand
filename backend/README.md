# Lend-A-Hand — Backend API

Production-grade REST API for the Lend-A-Hand home services marketplace.

## Tech Stack

| Layer          | Technology                     |
|----------------|--------------------------------|
| Runtime        | Node.js (ESM)                  |
| Framework      | Express.js 4                   |
| Database       | MongoDB + Mongoose 8           |
| Authentication | JWT (access + refresh tokens)  |
| Validation     | express-validator              |
| Security       | helmet, cors, express-rate-limit |

## Project Structure

```
backend/
├── src/
│   ├── config/          # DB connection, env, constants
│   ├── models/          # Mongoose schemas (8 models)
│   ├── routes/          # Express route definitions
│   ├── controllers/     # Request handlers (thin)
│   ├── services/        # Business logic layer
│   ├── middleware/      # Auth, RBAC, validation, errors
│   ├── validators/      # express-validator rule sets
│   ├── utils/           # Helpers, seed script
│   ├── jobs/            # Background job placeholders
│   ├── docs/            # API documentation
│   └── app.js           # Express app setup
├── server.js            # Entry point + graceful shutdown
├── package.json
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites

- **Node.js** v18+ (tested on v24)
- **MongoDB** running locally or a cloud URI

### Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets

# 3. Seed the database (optional)
npm run seed

# 4. Start the dev server
npm run dev
```

The server starts at **http://localhost:5000**.

### Health Check

```
GET http://localhost:5000/health
```

## Environment Variables

| Variable              | Default                              | Description                |
|-----------------------|--------------------------------------|----------------------------|
| PORT                  | 5000                                 | Server port                |
| NODE_ENV              | development                          | Environment                |
| MONGO_URI             | mongodb://127.0.0.1:27017/lendahand  | MongoDB connection string  |
| JWT_ACCESS_SECRET     | —                                    | Access token secret        |
| JWT_REFRESH_SECRET    | —                                    | Refresh token secret       |
| JWT_ACCESS_EXPIRES_IN | 15m                                  | Access token TTL           |
| JWT_REFRESH_EXPIRES_IN| 7d                                   | Refresh token TTL          |
| FRONTEND_URL          | http://localhost:5173                 | CORS origin                |

## Demo Accounts (after seeding)

| Email                  | Password    | Role     |
|------------------------|-------------|----------|
| admin@lendahand.com    | password123 | admin    |
| customer@demo.com      | password123 | customer |
| provider@demo.com      | password123 | provider |
| provider2@demo.com     | password123 | provider |

## API Documentation

See [`src/docs/API.md`](src/docs/API.md) for the full endpoint reference.

### Key Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
GET    /api/v1/services
POST   /api/v1/bookings
GET    /api/v1/bookings/me
GET    /api/v1/admin/analytics
```

## Architecture

```
Request → Route → Validator → Controller → Service → Model → MongoDB
                                    ↓
                              Error Handler
```

- **Controllers** are thin — they parse input and return responses
- **Services** contain all business logic, validation, and side effects
- **Models** define schemas and handle data-level concerns
- **Middleware** handles cross-cutting concerns (auth, RBAC, errors)

## Security

- Passwords hashed with **bcrypt** (12 rounds)
- JWT access + refresh token flow with **token rotation**
- Refresh tokens stored as **bcrypt hashes** in DB
- **Helmet** security headers
- **CORS** restricted to frontend origin
- **Rate limiting** on auth endpoints (20 req / 15 min)
- Global rate limit (200 req / 15 min)
- Input validation on all mutating endpoints
- Account status checks (active/suspended/banned)

## Scripts

| Script       | Command         | Description                  |
|--------------|-----------------|------------------------------|
| `npm run dev`  | `node --watch server.js` | Development with auto-reload |
| `npm start`    | `node server.js`         | Production                   |
| `npm run seed` | `node src/utils/seed.js` | Seed demo data               |

## License

MIT
