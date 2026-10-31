# Eslam Nagm — Backend Developer Portfolio

A modern, production-ready portfolio website with a secure admin dashboard. Built with Next.js App Router, TypeScript, Tailwind CSS, Shadcn UI, Prisma, PostgreSQL, and NextAuth.

## Features

### Public Website
- **Home** — Hero section, featured projects, CTAs
- **About** — Personal summary, education, career goals
- **Projects** — Search, filter by technology, pagination
- **Project Details** — Gallery, challenges, solutions, architecture
- **Skills** — Categorized skill bars (Backend, Database, Cloud, Tools, Soft Skills)
- **Certificates** — Verification codes and issuing organizations
- **Experience** — Timeline layout
- **Contact** — Validated contact form with social links

### Admin Dashboard (`/admin`)
- Dashboard overview with stats
- CRUD for Projects, Certificates, Skills, Experience
- Contact message management
- SEO and site settings
- Image upload support

### Extra
- Dark / Light mode
- SEO (sitemap, robots.txt, Open Graph, JSON-LD)
- Visitor tracking
- Loading skeletons, toast notifications, error boundaries
- Mobile-first responsive design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn UI |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 (Credentials) |
| Forms | React Hook Form + Zod |

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your database URL and generate an auth secret:

```bash
# Linux/macOS
openssl rand -base64 32

# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 3. Set up the database

```bash
npm run db:push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

- **Website:** [http://localhost:3000](http://localhost:3000)
- **Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default credentials:** `eslamnagm61@gmail.com` / `admin123`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── layout/            # Navbar, Footer, etc.
│   └── admin/             # Admin components
├── lib/                   # Utilities, auth, prisma
└── hooks/                 # Custom React hooks
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Seed data
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions (Vercel, Docker, VPS).

## License

MIT
