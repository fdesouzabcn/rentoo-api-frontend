# 🏠 Rentoo Frontend

A React frontend for Rentoo, a comprehensive rental property management system for the Spanish market. Built as an academic project for the Barcelona Activa Fullstack PHP Bootcamp.

Consumes the [Rentoo REST API](https://github.com/fdesouzabcn/rentoo-api) — a Laravel 12 backend secured with OAuth2.

---

## Project Description

**Rentoo** allows property owners to manage their rental properties and contracts through a clean, role-aware web interface. The frontend communicates exclusively with the Rentoo REST API and enforces role-based UI rendering for Admin and User roles.

The interface covers:
- OAuth2 authentication (register, login, logout)
- Property owner profile management
- Rental property CRUD with energy certificate tracking
- Rental contract CRUD with dual tenant support
- Financial summary dashboard with expiry alerts

---

## Tech Stack

- **Framework:** React 18 + Vite 8
- **Routing:** React Router DOM
- **HTTP Client:** Axios (with request/response interceptors)
- **Styling:** Tailwind CSS v3
- **Component Library:** shadcn/ui (Radix primitives)
- **Authentication:** OAuth2 Bearer Token (sessionStorage)
- **API:** Rentoo REST API — `http://127.0.0.1:8000/api/v1`

---

## Prerequisites

- Node.js v22+
- npm 10+
- Rentoo REST API running locally at `http://127.0.0.1:8000`

---

## Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/fdesouzabcn/rentoo-api-frontend.git
cd rentoo-api-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```

The default `.env` value points to the local Laravel backend:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

> **Note:** The `VITE_` prefix is required — Vite only exposes variables with this prefix to the browser bundle.

### 4. Start the development server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

> The Vite dev server proxies all `/api` requests to `http://127.0.0.1:8000`, eliminating CORS issues during local development.

---

## Test Accounts

These accounts are seeded by the Rentoo REST API backend:

| Email | Password | Role |
|-------|----------|------|
| `admin@rentoo.com` | `password` | Admin |
| `owner1@rentoo.com` | `password` | User |
| `owner2@rentoo.com` | `password` | User |

> `owner2` has a contract expiring within 45 days — use this account to test the expiry alert on the dashboard.

---

## Project Structure

```
src/
├── services/          # API layer — one file per resource
│   ├── api.js         # Axios instance + interceptors
│   ├── authService.js
│   ├── userService.js
│   ├── propertyService.js
│   ├── contractService.js
│   └── financialService.js
├── context/
│   └── AuthContext.jsx        # Token + user + role state
├── hooks/
│   ├── useAuth.js             # Consumes AuthContext
│   └── useApi.js              # Generic data/loading/error wrapper
├── router/
│   └── ProtectedRoute.jsx     # Redirects unauthenticated users
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── Dashboard.jsx          # Financial summary
│   ├── Properties/
│   ├── Contracts/
│   └── Admin/
├── components/
│   ├── ui/                    # shadcn/ui generated components
│   ├── custom/                # Rentoo-specific components
│   └── layout/                # Navbar + Layout wrapper
├── utils/
│   ├── formatters.js          # Currency, dates, surface area
│   └── validators.js          # DNI/NIE, cadastral ref, email
└── styles/
    └── index.css              # Tailwind directives only
```

---

## Authorization

| Role | Users | Properties | Contracts |
|------|-------|------------|-----------|
| **Admin** | Full access to all records | Full access to all records | Full access to all records |
| **User** | Own profile only | Own properties only | Own properties' contracts only |

> Frontend role checks are UX only — the backend 403 is the real security boundary.

---

## Authentication Flow

```
1. Register or Login  →  Receive Bearer token
2. Token stored in sessionStorage  →  Cleared on tab close
3. Axios interceptor injects token on every request
4. 401 response  →  Auto logout + redirect to /login
```

---

## Git Workflow

This project uses GitFlow:
- `main` — stable snapshots only
- `develop` — integration branch
- `feature/[session-name]` — one branch per development milestone

---

## Related Repository

**Rentoo REST API (Laravel backend):**
[https://github.com/fdesouzabcn/rentoo-api](https://github.com/fdesouzabcn/rentoo-api)

---

## Author

**Flavio de Souza**

## Acknowledgments

- Barcelona Activa Fullstack PHP Bootcamp (2025/2026)