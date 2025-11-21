# Producktivity — Frontend
React + Vite + Tailwind CSS

## Tech Stack
- React (Vite)
- Tailwind CSS
- Responsive UI with a calendar, dashboard, and weekly streaks
- Reusable components and small utilities in `src/lib`

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

Important aspects and structures of the frontend. Not all are included.
```
frontend/
|-- index.html
|-- tailwind.config.*
|-- postcss.config.*
|--src/
   |-- main.jsx              # App entry + route definitions
   |-- App.jsx               # Landing/unauthenticated page
   |-- pages/                # Feature pages
   |  |-- Calendar.jsx
   |  |-- Dashboard.jsx
   |  |-- Login.jsx
   |  |-- Profile.jsx
   |  |-- ToDo.jsx
   |-- components/           # Reusable UI components
   |  |-- Header.jsx
   |  |-- Nav.jsx
   |  |-- TaskModal.jsx
   |  |-- TaskColumn.jsx
   |  |-- TaskRow.jsx
   |  |-- PaginatedTaskBox.jsx
   |  |-- WeeklyStreak.jsx
   |-- lib/                  # Client helpers & utilities
      |-- api.js             # REST calls (uses VITE_API_URL)
      |-- streakUtils.js     # Streak calculation helpers
      |-- utils.js           # Date & UI helpers
```

## Routing & Auth Flow

- `src/main.jsx` defines routes for the app.
- `src/App.jsx` acts as the landing page for users who are not logged in.
- When the user clicks **Login** / **Sign up**, the app routes to the `Login` page.
- After login, the main authenticated paths are **Dashboard**, **Calendar**, **Profile**, and **ToDo**.


## Available Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`

## Styling

- Tailwind is already configured. Use utility classes in JSX.
- Prefer responsive classes (e.g., `sm:`, `md:`, `lg:`) for layouts like the Dashboard columns and Calendar.
