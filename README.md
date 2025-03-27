# Hungarian Mythical Creatures Frontend

This is the **frontend** of my Hungarian Mythical Creatures project — a web application built using **Vue 3**, **TypeScript**, and **Vite**. It connects to a REST API backend allowing users to explore and manage mythical creatures from Hungarian folklore.

## Tech Stack

- **Framework**: Vue 3 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## Features

- Browse creatures from the backend
- Get (summon) random creature
- Add, edit, and delete creatures (requires login)
- User authentication (JWT-based)
- Responsive design with Tailwind
- Backend interaction via API calls

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## Live Demo

Frontend: [https://mythical-creatures-frontend.onrender.com/](https://mythical-creatures-frontend.onrender.com/)

Backend API Docs: [https://my-awesome-ments-api.onrender.com/api/docs/](https://my-awesome-ments-api.onrender.com/api/docs/)

## Note

Because the app is hosted on Render’s free tier, there may be a cold start delay (up to ~50 seconds) on the first interaction (e.g., when clicking the summon button), but subsequent requests are much faster.
