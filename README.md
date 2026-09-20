# PeopleHub HRMS — B.Tech CSE Project

A simple full-stack Human Resource Management System designed for a final-year B.Tech CSE project.

## What it includes

- Admin demo login
- HR dashboard with workforce and attendance summary
- Employee CRUD: add, edit, search, delete
- Daily attendance: Present, Absent, Half Day, Work From Home
- Leave requests: create, approve, reject, filter
- SQLite database with Prisma ORM and relational models
- Responsive UI for desktop and mobile

## Tech stack

- Next.js 16.3 (App Router)
- React 19.3
- TypeScript 5.9
- Tailwind CSS 4
- Prisma ORM 7
- SQLite + better-sqlite3 driver adapter
- Lucide React icons

## Run locally

Requirements: Node.js 22+ is recommended.

```bash
npm install
npm run db:setup
npm run dev
```

Open `http://localhost:3000`.

### Demo login

Email: `admin@peoplehub.com`

Password: `admin123`

## Project structure

```text
app/
  api/
    attendance/             # attendance GET/POST API
    employees/              # employee GET/POST/PATCH/DELETE APIs
    leaves/                 # leave GET/POST + status update API
  dashboard/                # HR dashboard
  employees/                # employee management UI
  attendance/               # attendance UI
  leaves/                   # leave workflow UI
  login/                    # demo admin login
components/
  app-shell.tsx
  sidebar.tsx
  topbar.tsx
lib/
  prisma.ts                 # database client
  utils.ts                  # small formatting helpers
prisma/
  schema.prisma             # database design
  seed.ts                   # sample data
prisma7.config.ts
```

## Database design

`Employee` is the main table.

One employee can have many `Attendance` records and many `LeaveRequest` records. Attendance has a unique `(employeeId, date)` constraint so one employee cannot accidentally have two records for the same day.

## Good viva / presentation points

1. **Why Next.js?** It provides a React-based full-stack framework with routing and server-side capabilities in one project.
2. **Why TypeScript?** It adds static typing and catches common errors during development.
3. **Why Prisma?** It provides type-safe database queries and keeps the schema easy to explain.
4. **Why SQLite?** It is file-based, needs no separate database server, and is sufficient for a college project prototype.
5. **How does CRUD work?** Employee forms call Next.js Route Handlers, which validate data and use Prisma to create, read, update, or delete records.
6. **How is attendance stored?** Each employee gets one attendance record per date, enforced by a composite unique constraint.
7. **How are leave approvals handled?** A leave starts as `PENDING`; the admin can change it to `APPROVED` or `REJECTED`.

## HRMS-Portal

## Important project limitation

The login is intentionally a lightweight demo login using browser local storage. It is suitable for an academic prototype, not for production HR software. A production version would add proper server-side authentication, roles, password hashing, audit logs, and stronger security controls.
