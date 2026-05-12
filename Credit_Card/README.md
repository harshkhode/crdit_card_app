# 💳 CardCompare — Credit Card Comparison Web App

A full-stack, production-ready web application for comparing credit cards from India's top banks.

## 🏦 Supported Banks
- HDFC Bank (3 cards)
- ICICI Bank (3 cards)
- Axis Bank (3 cards)
- IDFC First Bank (2 cards)
- HSBC Bank (3 cards)

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| State | Zustand |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| HTTP Client | Axios |

---

## 📁 Folder Structure

```
Credit_Card/
├── backend/
│   ├── config/         # DB config
│   ├── controllers/    # Auth, Card, User, Admin controllers
│   ├── data/           # Seed script (15 cards + 2 users)
│   ├── middleware/      # JWT auth + validator
│   ├── models/         # User & Card Mongoose schemas
│   ├── routes/         # REST API routes
│   ├── .env            # Environment variables
│   └── server.js       # Express entry point
└── frontend/
    └── src/
        ├── components/ # Navbar, CardItem, FilterPanel, CompareBar, etc.
        ├── pages/       # Login, Signup, Dashboard, CardDetail, Compare, etc.
        │   └── admin/  # AdminDashboard, ManageCards, ManageUsers
        ├── services/    # API calls (cardService, userService, api.js)
        ├── store/       # Zustand stores (authStore, compareStore)
        └── utils/       # helpers.js (formatCurrency, bank colors, etc.)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone & Setup

```bash
cd Credit_Card
```

### 2. Backend Setup

```bash
cd backend
# Copy and fill in .env (already created with defaults)
npm install
npm run seed      # Populate 15 cards + admin & user accounts
npm run dev       # Starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install --legacy-peer-deps
npm run dev       # Starts on http://localhost:5173
```

---

## 🔑 Environment Variables (backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/creditcarddb
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 👤 Demo Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@cardcompare.com | Admin@123 |
| User | john@example.com | User@123 |

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user (protected) |
| PUT | /api/auth/change-password | Change password (protected) |

### Cards
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/cards | List all cards (search, filter, sort, paginate) |
| GET | /api/cards/:id | Get card details |
| GET | /api/cards/compare?ids=id1,id2,id3 | Compare up to 4 cards |
| GET | /api/cards/recommended | Personalized recommendations (protected) |
| GET | /api/cards/banks | List all banks |
| POST | /api/cards | Create card (admin only) |
| PUT | /api/cards/:id | Update card (admin only) |
| DELETE | /api/cards/:id | Deactivate card (admin only) |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/users/profile | Get profile + favorites |
| PUT | /api/users/profile | Update profile |
| GET | /api/users/favorites | Get saved cards |
| POST | /api/users/favorites/:cardId | Toggle favorite |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/users | List all users |
| PUT | /api/admin/users/:id | Update user role/status |
| DELETE | /api/admin/users/:id | Deactivate user |

---

## 🎯 Sample API Requests

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cardcompare.com","password":"Admin@123"}'
```

### Get All Cards
```bash
curl http://localhost:5000/api/cards?bank=HDFC+Bank&sortBy=rating&order=desc
```

### Compare Cards
```bash
curl "http://localhost:5000/api/cards/compare?ids=ID1,ID2,ID3" \
  -H "Authorization: Bearer <token>"
```

---

## ✨ Features

- **Authentication** — JWT login/signup with password hashing (bcrypt)
- **Dashboard** — Cards grouped by bank with search, filters, sorting
- **Card Detail** — Full info: fees, rewards, cashback, lounge, eligibility, pros/cons
- **Compare** — Side-by-side comparison table (up to 4 cards)
- **Favorites** — Save/unsave cards, dedicated favorites page
- **Recommended** — Cards matched to user income/credit score profile
- **Admin Panel** — Manage cards (CRUD) and users (role, active status)
- **Responsive** — Mobile-first design, works on all screen sizes
- **Security** — Helmet, CORS, rate limiting, input validation

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy /dist folder to Vercel
```

### Backend → Render
1. Push backend folder to GitHub
2. Create new Web Service on Render
3. Set environment variables from .env
4. Build command: `npm install`
5. Start command: `npm start`

Update `MONGO_URI` to your MongoDB Atlas connection string and `FRONTEND_URL` to your Vercel domain.
