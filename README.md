# Timer App

A Cursor-branded countdown timer built with Next.js. Set a duration, pick a clock animation, and run a fullscreen-friendly countdown with pause, resume, and a summary when time is up.

## Features

- **Two-step setup** — name your timer, set hours/minutes/seconds, then choose an animation style
- **Clock animations** — card (default), flip, slide, and fade styles
- **Live countdown** — progress bar, end time, pause/resume, and cancel
- **Fullscreen mode** — expand the countdown for presentations or shared screens
- **Persistent state** — timer progress is saved in `localStorage` and survives page refreshes
- **Time's up screen** — confetti celebration with a summary of start, end, and duration

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Build for production     |
| `npm run start`| Run production build     |
| `npm run lint` | Run ESLint               |

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [canvas-confetti](https://github.com/catdad/canvas-confetti) for the celebration effect

## Project Structure

```
app/
├── components/
│   ├── TimerApp.tsx       # Main app shell and state management
│   ├── SetupForm.tsx      # Timer configuration flow
│   ├── CountdownScreen.tsx# Running/paused countdown view
│   ├── TimesUp.tsx        # Completion screen and summary
│   ├── CardClock.tsx      # Default card-style digits
│   ├── FlipClock.tsx      # Flip-clock animation
│   └── timer.ts           # Shared types and utilities
├── layout.tsx
├── page.tsx
└── globals.css
```
