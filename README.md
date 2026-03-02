# ARC Joint Website (V1)

Launch-first ARC build using Next.js App Router + TypeScript + Tailwind + GSAP.

## What V1 Includes

- Cinematic homepage flow with Apple-inspired pacing
- Placeholder Explore overlay (`open/close` only)
- Placeholder knee and pain interaction sections (iterative foundation)
- ZIP proximity search API (`/api/providers/search`) using zippopotam.us + Haversine
- Static provider directory and provider detail pages
- Static library article pages

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Key Routes

- `/` experience flow
- `/providers` provider directory
- `/providers/[slug]` provider details
- `/library/[slug]` static content pages
- `/api/providers/search?zip=85251` ZIP ranking endpoint

## Deploy

Connect this repo to Vercel and deploy. No environment variables are required for V1.
