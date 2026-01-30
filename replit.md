# Zero App

## Overview
A Next.js 16 application with React 19, TypeScript, and Tailwind CSS 4. This appears to be a screening/interrogation-style questionnaire application.

## Project Structure
```
src/
├── app/           # Next.js App Router pages
│   ├── layout.tsx # Root layout
│   ├── page.tsx   # Main page
│   ├── globals.css
│   └── favicon.ico
├── components/    # React components
└── lib/           # Utility functions and types
    ├── ideas.ts
    ├── mike.ts
    ├── store.ts
    └── types.ts
```

## Tech Stack
- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

## Development
Run the development server:
```bash
npm run dev
```
The app runs on port 5000 at `http://0.0.0.0:5000`

## Production
Build and start:
```bash
npm run build
npm run start
```

## Recent Changes
- 2026-01-30: Configured for Replit environment (port 5000, allowed dev origins)
