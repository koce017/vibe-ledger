Vibe Ledger — workspace configured
# Starter (Next.js + Clerk + Prisma + Neon)

A complete, working starter aligned with the workshop "starter" folder name.

## Quick Start
1. Copy `.env.example` to `.env` and fill in values.
2. Install deps and run:
   npm install
   npm run dev
3. Open http://localhost:3000

## Environment Variables
- NEXT_PUBLIC_BASE_URL=http://localhost:3000
- CLERK_PUBLISHABLE_KEY=pk_...
- CLERK_SECRET_KEY=sk_...
- DATABASE_URL="postgresql://...sslmode=require"

## Prisma (optional, when you add models)
- npx prisma db push
- npx prisma migrate dev

## Deploy to Vercel
- Push to GitHub
- Import repo in Vercel
- Add the same env vars in Project → Settings → Environment Variables
