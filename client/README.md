# AI-Driven React Component Generator — Frontend

This is the frontend for the AI-driven React component generator platform. It is built with Next.js (React), styled with Tailwind CSS, and communicates with the backend for authentication, session management, and AI-powered code generation.

---

## Features
- **Modern, dark-themed UI** with responsive design
- **Authentication** (sign up, sign in, JWT-based)
- **Session management** (create, list, resume sessions)
- **Chat-driven UI** for describing components and iterating
- **Live preview** of AI-generated JSX/CSS
- **Code export** (copy/download)
- **Logout and protected routes**
- **Auto-scroll and polished UX**

---

## Project Structure
- `/src/app` — Main Next.js app directory
  - `/components` — UI components (Chat, Preview, CodeTabs, Navbar, SessionList)
  - `/lib` — API utilities (axios, auth helpers)
  - `/dashboard` — Main app after login
  - `page.js` — Landing page
  - `(auth)/signin`, `(auth)/signup` — Auth pages
- `public/` — Static assets
- `globals.css` — Tailwind CSS global styles

---

## Setup
1. Install dependencies:
   ```sh
   cd client
   npm install
   ```
2. Create a `.env.local` if needed for frontend environment variables (API URL, etc.)
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Workflow
- User signs in or signs up (JWT stored in localStorage)
- User creates a new chat session or resumes an existing one
- User describes a component in chat; frontend calls backend `/api/chat/generate`
- Backend returns AI-generated JSX/CSS; frontend shows live preview and code tabs
- User can copy/download code, or iterate with further prompts
- All session data is persisted via backend (MongoDB + Redis cache)

---

## LLM & Caching
- **LLM:** OpenRouter API (supports GPT-4, Mixtral, etc.)
- **Session Cache:** Backend uses Redis (Render cloud) for fast session access

---

## Security & Best Practices
- No secrets or API keys stored in frontend repo
- `.env.local` and sensitive files are gitignored
- JWT stored in localStorage; logout clears token and redirects

---

## Deployment
- Deployable to Vercel, Netlify, or any Next.js-compatible host
- Set backend API URL and other env vars in your deployment dashboard

---

## Notes
- For best experience, run backend and frontend together
- All sensitive and build files are ignored via `.gitignore`
- See `/server/README.md` for backend setup
