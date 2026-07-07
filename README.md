# Team Weekly Report System

A role-based weekly report management system built with Next.js 16. Team members submit structured weekly reports, managers review and comment, and admins manage the workspace.

## Tech Stack

- **Framework:** Next.js 16.2.10 (Turbopack)
- **Auth:** NextAuth v4 with credentials (JWT)
- **Database:** PostgreSQL with Prisma ORM
- **UI:** Tailwind CSS v4, Lucide icons, Recharts
- **AI:** NVIDIA Llama 3.1 70B via OpenAI SDK
- **Forms:** react-hook-form + Zod validation

## Roles

| Role | Permissions |
|------|------------|
| **ADMIN** | Full access — users, projects, all reports, analytics |
| **MANAGER** | View dashboards, review/submit reports, manage projects |
| **TEAM_MEMBER** | Submit weekly reports, view own dashboard |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running on `localhost:5432`

### Setup

```bash
# Install dependencies
npm install

# Set up environment
# Edit .env if needed (defaults work for local dev)

# Create database
npx prisma db push

# Seed with sample data
npm run seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | password123 |
| Manager | manager@company.com | password123 |
| Member | alice@company.com | password123 |

## Project Structure

```
app/
├── admin/dashboard/      # Admin overview with charts & user management
├── admin/users/          # User management (CRUD)
├── manager/dashboard/    # Manager summary with activity feed
├── manager/projects/     # Project CRUD
├── manager/reports/      # Review team reports
├── manager/analytics/    # Charts & team metrics
├── member/dashboard/     # Personal report summary
├── member/reports/       # Submit & view own reports
├── api/auth/             # NextAuth + registration
├── api/projects/         # Project CRUD API
├── api/reports/          # Report CRUD API
├── api/ai/chat/          # AI assistant chat
├── api/users/            # User management API
├── api/manager/          # Manager dashboard/reports API
├── api/admin/            # Admin dashboard API
├── login/                # Login page
└── register/             # Registration page
```

## Scripts

```bash
npm run dev          # Start dev with Turbopack
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:migrate   # Run Prisma migrations
```

## AI Assistant

Managers can ask natural-language questions about team reports via the AI chat widget. Powered by NVIDIA's Llama 3.1 70B model. Configured via `.env`:

- `AI_PROVIDER=nvidia`
- `NVIDIA_API_KEY=...`
- `NVIDIA_MODEL=meta/llama-3.1-70b-instruct`

## Database

The schema includes 5 models:

- **User** — accounts with role-based access
- **Project** — work categories with active/inactive status
- **ProjectMember** — user-project assignments
- **WeeklyReport** — weekly submissions with tasks, blockers, hours, status
- **ManagerComment** — comments on reports
- **ActivityLog** — audit trail of key actions
