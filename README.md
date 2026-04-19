# TravelAI - AI-Powered Indian Travel Planner

A Next.js web application that generates personalized travel itineraries for Indian destinations using Google Gemini AI.

## Features

- 🛕 Browse destinations by category (Religious, Historical, Beaches, Mountains, Cities)
- ✈️ Customize trips by travelers, duration, budget, travel style, and language
- 🤖 AI-generated day-by-day itineraries powered by Google Gemini 1.5 Flash
- 📥 Export itinerary as a PDF

## Getting Started

1. Copy `.env.example` to `.env.local` and add your Gemini API key:

```bash
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY
```

2. Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Tech Stack

- [Next.js 16](https://nextjs.org) with App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Google Gemini AI](https://ai.google.dev/) via `@google/generative-ai`
- [jsPDF](https://github.com/parallax/jsPDF) for PDF export
