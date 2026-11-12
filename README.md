# FinTech@Brown website

The official site for FinTech@Brown, Brown University's student club at the intersection of finance and technology. Live at **[fintech-at-brown-website.vercel.app](https://fintech-at-brown-website.vercel.app/)**.

I designed and built it as the club's Treasurer and web developer.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS · deployed on Vercel

## Features

- Typewriter-style animated hero text, written as a small React component with no animation library
- Industry partner grid (Moov, Barings, Wellington Management, QMA) with per-logo scaling so the marks look balanced
- Live events from the club's Google Calendar, embedded so officers update events in Calendar rather than in code
- E-board directory and a responsive navigation menu for mobile

## Running locally

```bash
npm install
npm run dev   # http://localhost:3000
```

Partners and e-board members are defined as arrays in `src/app/page.tsx`. To update them, edit those arrays and add images under `public/partners/` or `public/eboard/`.
