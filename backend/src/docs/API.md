# Lend-A-Hand API Documentation

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### Auth
| Method | Path             | Auth | Description         |
|--------|------------------|------|---------------------|
| POST   | /auth/register   | No   | Register a new user |
| POST   | /auth/login      | No   | Login               |
| POST   | /auth/refresh    | No   | Refresh tokens      |
| POST   | /auth/logout     | Yes  | Logout              |

### Users
| Method | Path         | Auth  | Description            |
|--------|--------------|-------|------------------------|
| GET    | /users/me    | Yes   | Get current user       |
| PATCH  | /users/me    | Yes   | Update profile         |
| GET    | /users/:id   | Admin | Get user by ID         |

### Providers
| Method | Path              | Auth     | Description           |
|--------|-------------------|----------|-----------------------|
| GET    | /providers        | No       | List providers        |
| GET    | /providers/:id    | No       | Provider detail       |
| POST   | /providers/profile| Provider | Create profile        |
| PATCH  | /providers/profile| Provider | Update profile        |

### Services
| Method | Path           | Auth  | Description          |
|--------|----------------|-------|----------------------|
| GET    | /services      | No    | List services        |
| POST   | /services      | Admin | Create service       |
| PATCH  | /services/:id  | Admin | Update service       |

### Bookings
| Method | Path                  | Auth | Description         |
|--------|-----------------------|------|---------------------|
| POST   | /bookings             | Yes  | Create booking      |
| GET    | /bookings/me          | Yes  | My bookings         |
| PATCH  | /bookings/:id         | Yes  | Update status       |
| POST   | /bookings/:id/cancel  | Yes  | Cancel booking      |

### Payments
| Method | Path                     | Auth | Description         |
|--------|--------------------------|------|---------------------|
| POST   | /payments/initiate       | Yes  | Initiate payment    |
| POST   | /payments/refund         | Yes  | Process refund      |
| GET    | /payments/transactions/me| Yes  | My transactions     |

### Reviews
| Method | Path                          | Auth | Description         |
|--------|-------------------------------|------|---------------------|
| POST   | /reviews                      | Yes  | Submit review       |
| GET    | /reviews/providers/:id/reviews| No   | Provider reviews    |

### Messaging
| Method | Path                            | Auth | Description         |
|--------|---------------------------------|------|---------------------|
| GET    | /messages/threads               | Yes  | My threads          |
| POST   | /messages/threads               | Yes  | Create thread       |
| GET    | /messages/threads/:id/messages  | Yes  | Thread messages     |
| POST   | /messages                       | Yes  | Send message        |

### Notifications
| Method | Path                        | Auth | Description         |
|--------|-----------------------------|------|---------------------|
| GET    | /notifications              | Yes  | My notifications    |
| PATCH  | /notifications/:id/read     | Yes  | Mark read           |
| PATCH  | /notifications/read-all     | Yes  | Mark all read       |

### Admin
| Method | Path                        | Auth  | Description         |
|--------|-----------------------------|-------|---------------------|
| GET    | /admin/users                | Admin | List all users      |
| PATCH  | /admin/users/:id/status     | Admin | Update user status  |
| GET    | /admin/analytics            | Admin | Dashboard analytics |

---

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "pages": 4
  }
}
```

### Error
```json
{
  "message": "Error description"
}
```
