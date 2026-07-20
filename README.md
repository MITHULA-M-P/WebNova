# WebCraft Studio — Customer-Centric Web Planner & Estimator

WebCraft Studio is a production-quality full-stack SaaS platform designed for users to estimate, plan, design, and schedule custom website builds.

## Features
- **Cost Estimator**: Calculate real-time build costs dynamically based on website categories, page count, and feature integrations.
- **Planner Wizard**: Step-by-step 4-stage onboarding form capturing business details, color schemes, logos, and target goals.
- **Website Blueprint**: Personalized summary page rendering custom recommendations, and estimating total cost and delivery time.
- **Discovery Call Scheduler**: Book consultations linked directly to active client profiles.
- **Work Gallery & Testimonials**: Dynamic feeds powered by Node.js/Express API.

---

## Project Structure

```text
webcraft-studio/
├── frontend/             # React + Vite Frontend (TypeScript, CSS-only)
│   ├── src/
│   │   ├── components/   # Modular page components
│   │   ├── css/          # Dedicated page stylesheets
│   │   ├── pages/        # Route page views (Home, Templates, Pricing, Reviews, etc.)
│   │   └── services/     # api.ts fetch methods integration
│   └── package.json
│
├── backend/              # Node.js + Express Backend
│   ├── prisma/           # schema.prisma PostgreSQL schema
│   ├── src/
│   │   ├── config/       # db connection clients
│   │   ├── controllers/  # API route logic (Zod validation, database inputs)
│   │   ├── middleware/   # Zod body validation middleware
│   │   ├── routes/       # Express route handlers
│   │   └── app.js / server.js
│   ├── package.json
│   └── .env
```

---

## Setup & Running Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database Instance (make sure local or online database is running)

### Step 1: Database Setup
Create a PostgreSQL database and copy the connection URL.

### Step 2: Configure Environment Variables
Create a `.env` file in the `backend/` directory (you can copy `backend/.env.example` as a template):
```bash
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/webcraft_studio?schema=public"
```

### Step 3: Install Dependencies
Install dependencies for both folders:
```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### Step 4: Run Prisma Database Migrations
Initialize database tables using Prisma ORM:
```bash
cd backend
npx prisma migrate dev --name init
```

### Step 5: Start Servers
Run the development servers:

```bash
# In the backend directory
npm run dev

# In the frontend directory
npm run dev
```

The frontend will run on `http://localhost:5173` and requests directed to `/api` will be proxied automatically to the backend on port `5000`.

---

## API Documentation

### Planner
- `POST /api/planner` — Create a new Website Plan and Customer record.
- `GET /api/planner` — Get list of all website plans.
- `GET /api/planner/:id` — Get plan details by database ID.
- `PUT /api/planner/:id` — Update plan options.
- `DELETE /api/planner/:id` — Delete a plan.

### Bookings
- `POST /api/bookings` — Request a consultation call.
- `GET /api/bookings` — Get list of bookings.
- `GET /api/bookings/:id` — Get booking by ID.
- `PUT /api/bookings/:id` — Update status or slot.
- `DELETE /api/bookings/:id` — Cancel / delete booking.

### Static Resources
- `GET /api/templates` — Get custom website template items.
- `GET /api/portfolio` — Get build gallery list.
- `GET /api/reviews` — Get test testimonial profiles.
