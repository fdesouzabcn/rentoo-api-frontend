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
- Admin views with full cross-owner visibility

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Routing | React Router DOM |
| HTTP Client | Axios (request/response interceptors) |
| Styling | Tailwind CSS v3 |
| Component Library | shadcn/ui (Radix primitives) |
| Authentication | OAuth2 Bearer Token (sessionStorage) |
| API | Rentoo REST API — Laravel 12 + Passport |

---

## Prerequisites

- Node.js v22+
- npm 10+
- Rentoo REST API running locally at `http://127.0.0.1:8000`

> The frontend makes no API calls at build time, but the dev server must be able to reach the backend for any page that fetches data to render correctly.

---

## Related Repository

**Rentoo REST API (Laravel 12 backend):**
[https://github.com/fdesouzabcn/rentoo-api](https://github.com/fdesouzabcn/rentoo-api)

The backend README contains full setup instructions including database creation, migrations, seeding, and Passport key generation. Start there before running the frontend.

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

> **Note:** The `VITE_` prefix is required — Vite only exposes variables with this prefix to the browser bundle. Any variable without it is silently `undefined` at runtime.

### 4. Start the development server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

> The Vite dev server proxies all `/api` requests to `http://127.0.0.1:8000`, eliminating CORS issues during local development without any changes to the Laravel backend.

---

## Test Accounts

These accounts are created by the backend seeder (`php artisan db:seed`):

| Email | Password | Role |
|-------|----------|------|
| `admin@rentoo.com` | `password` | Admin |
| `owner1@rentoo.com` | `password` | User |
| `owner2@rentoo.com` | `password` | User |

- **owner1** has two properties: one with an active contract and one with a finalized contract.
- **owner2** has a contract expiring within 45 days — use this account to verify the expiry alert on the dashboard and the amber border on the contract card.

---

## Authorization

| Role | Users | Properties | Contracts |
|------|-------|------------|-----------|
| **Admin** | Full access to all records | Full access to all records | Full access to all records |
| **User** | Own profile only | Own properties only | Own properties' contracts only |

Frontend role checks are UX only — they prevent wasted network requests and surface friendly error states. The backend 403 is the real security boundary and fires regardless of what the frontend renders.

---

## Authentication Flow

```
1. Register or Login  →  Receive Bearer token
2. Token stored in sessionStorage  →  Cleared automatically on tab close
3. Axios interceptor injects Authorization: Bearer {token} on every request
4. 401 response  →  Auto logout + redirect to /login
```

All requests also include `Accept: application/json` by default. Without this header, Laravel returns an HTML error page instead of JSON for 4xx responses.

---

## Project Structure

```
src/
├── services/              # API layer — one file per resource
│   ├── api.js             # Axios instance + interceptors
│   ├── authService.js
│   ├── userService.js
│   ├── propertyService.js
│   ├── contractService.js
│   └── financialService.js
├── context/
│   └── AuthContext.jsx    # Token + user + role state
├── hooks/
│   ├── useAuth.js         # Consumes AuthContext
│   └── useApi.js          # Generic data/loading/error wrapper
├── router/
│   └── ProtectedRoute.jsx # Redirects unauthenticated users to /login
├── pages/
│   ├── Welcome.jsx        # Public landing page
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── Dashboard.jsx      # Financial summary
│   ├── Properties/
│   │   ├── PropertiesList.jsx
│   │   ├── PropertyDetail.jsx
│   │   ├── PropertyCreate.jsx
│   │   └── PropertyEdit.jsx
│   ├── Contracts/
│   │   ├── ContractsList.jsx
│   │   ├── ContractDetail.jsx
│   │   ├── ContractCreate.jsx
│   │   └── ContractEdit.jsx
│   └── Admin/
│       └── UsersList.jsx  # Admin only
├── components/
│   ├── ui/                # shadcn/ui generated source files
│   ├── custom/            # Rentoo-specific components
│   │   ├── StatusBadge.jsx
│   │   ├── EnergyBadge.jsx
│   │   ├── ContractCard.jsx
│   │   ├── ExpiryAlert.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── LoadingSpinner.jsx
│   ├── forms/
│   │   ├── PropertyForm.jsx   # Shared controlled form (create + edit)
│   │   └── ContractForm.jsx   # Shared controlled form (create + edit)
│   ├── icons/
│   │   └── index.jsx          # All SVG icon components
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Layout.jsx         # Authenticated page shell
│   │   └── PublicLayout.jsx   # Unauthenticated page shell (Login, Register)
│   └── router/
│       └── RoleRoute.jsx      # Admin-only route guard (UX only)
├── utils/
│   ├── formatters.js      # Currency (€ ES locale), dates, surface area
│   └── validators.js      # DNI/NIE, cadastral reference, email, dates
└── styles/
    └── index.css          # Tailwind directives only
```

---

## Known Limitations

- **Remember me checkbox (Login page):** The checkbox is visible in the UI but currently inert. The token is always stored in `sessionStorage` regardless of whether it is checked, meaning sessions always clear on tab close. Implementing true persistent login would require a deliberate decision to use `localStorage`, which carries security tradeoffs for a financial application.

- **Welcome page navbar:** The Welcome page (`/`) uses simplified local navbar variants (`PublicNavbar` / `AuthNavbar`) rather than the full application `Navbar` component. The full Navbar is coupled to the authenticated Layout wrapper, so the bell icon and avatar dropdown are not present on the Welcome page for authenticated users.

---

## Git Workflow

This project uses GitFlow:
- `main` — stable snapshots only (tutor-shareable)
- `develop` — integration branch
- `feature/[session-name]` — one branch per development milestone

---

## Author

**Flavio de Souza**

---

## Acknowledgments

- Barcelona Activa Fullstack PHP Bootcamp (2025/2026)