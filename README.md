# Producktivity

A friendly, gamified productivity app that helps you plan your days, track progress, and stay motivated with streaks and a friends leaderboard.

- **Frontend:** React + Vite + Tailwind :calendar, dashboard columns (Yesterday/Today/Tomorrow), weekly streak timeline, and task lists with fast inline editing.
- **Backend:** Node.js + Express + MongoDB: tasks CRUD, user auth/profile, follow system, and a simple leaderboard.

## Features

- **Calendar:** with quick-add for the selected day.
- **Tasks:** with priority, notes, due dates, and completion tracking.
- **Streaks:** see your weekly activity at a glance.
- **Friends leaderboard:** follow friends and compare recent productivity.
- **Dashboard:** statistics and completion rate, overdue/pending counts, and best/current streaks.
- **Responsive UI:** columns collapse into a swipeable/steppable carousel on small screens.

## Project Layout

```
/frontend   # React + Vite + Tailwind app
/backend    # Node + Express + MongoDB API
```

## Quickstart

Open two terminals:

**Backend**
```bash
cd backend
npm install
node index.js
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Visit the URL shown by Vite (typically `http://localhost:5173`).
