# Deployment Guide

This guide covers deploying the Mohamed Fathi Portfolio to production.

## Environment Variables

Set these in your hosting platform:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Random 32+ character secret for NextAuth |
| `AUTH_URL` | Yes | Full site URL (e.g. `https://mohamedfathi.com`) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL for SEO/sitemap |

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

---

## Option 1: Vercel (Recommended)

### Steps

1. **Push code to GitHub**

2. **Create a PostgreSQL database**
   - [Neon](https://neon.tech) (free tier available)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)

3. **Import project in Vercel**
   - Connect your GitHub repository
   - Framework preset: **Next.js**

4. **Configure environment variables** in Vercel dashboard:
   ```
   DATABASE_URL=postgresql://...
   AUTH_SECRET=your-secret
   AUTH_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

5. **Deploy** — Vercel runs `npm run build` automatically.

6. **Run migrations and seed** (one-time, from local machine):
   ```bash
   DATABASE_URL="your-production-url" npx prisma db push
   DATABASE_URL="your-production-url" npm run db:seed
   ```

   Or add a build script in `package.json`:
   ```json
   "build": "prisma generate && prisma db push && next build"
   ```
   > Use `prisma migrate deploy` instead of `db push` for production migrations.

7. **Custom domain** — Add in Vercel → Settings → Domains. Update `AUTH_URL` and `NEXT_PUBLIC_SITE_URL`.

### Vercel Notes
- File uploads go to `public/uploads/` — use [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or S3 for persistent storage in production.
- Serverless functions have a 10MB body limit (configured in `next.config.ts`).

---

## Option 2: Docker

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  // ...existing config
};
```

### docker-compose.yml

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/portfolio
      AUTH_SECRET: your-secret-here
      AUTH_URL: http://localhost:3000
      NEXT_PUBLIC_SITE_URL: http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: portfolio
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

Run:

```bash
docker compose up -d
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed
```

---

## Option 3: VPS (Ubuntu)

### 1. Install dependencies

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql nginx
sudo npm install -g pm2
```

### 2. Set up PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE mohamed_portfolio;
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mohamed_portfolio TO portfolio_user;
\q
```

### 3. Deploy application

```bash
git clone <your-repo> /var/www/portfolio
cd /var/www/portfolio
cp .env.example .env
# Edit .env with production values
npm install
npm run db:push
npm run db:seed
npm run build
```

### 4. Run with PM2

```bash
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup
```

### 5. Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Post-Deployment Checklist

- [ ] Change default admin password (`mofathi2648@gmail.com` / `75907590opp`)
- [ ] Update site settings in Admin → Settings
- [ ] Upload resume to `public/resume.pdf`
- [ ] Add Open Graph image at `public/og-image.png` (1200×630px)
- [ ] Verify sitemap at `/sitemap.xml`
- [ ] Verify robots.txt at `/robots.txt`
- [ ] Test contact form submissions
- [ ] Enable HTTPS
- [ ] Set up database backups

---

## Database Migrations (Production)

For production, use Prisma Migrate instead of `db push`:

```bash
# Development
npm run db:migrate

# Production
npx prisma migrate deploy
```

Initial migration:

```bash
npx prisma migrate dev --name init
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Auth redirect loop | Ensure `AUTH_URL` matches your exact domain |
| Database connection failed | Check `DATABASE_URL`, SSL mode for cloud DBs (`?sslmode=require`) |
| Images not persisting on Vercel | Use cloud storage (S3, Cloudinary, Vercel Blob) |
| Build fails on Prisma | Ensure `postinstall: prisma generate` is in package.json |

---

## Security Recommendations

1. Use strong `AUTH_SECRET` (32+ random bytes)
2. Change default admin credentials immediately
3. Restrict `/admin` routes (already protected by NextAuth middleware)
4. Use SSL/TLS in production
5. Keep dependencies updated: `npm audit fix`
6. Never commit `.env` to version control
