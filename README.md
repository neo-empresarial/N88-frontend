# N88-frontend — MatrUFSC

## Stack

| Layer         | Technology                                                                    |
|---------------|-------------------------------------------------------------------------------|
| Framework     | Next.js 14 (App Router)                                                       |
| Language      | TypeScript 5 (strict mode)                                                    |
| Styling       | Tailwind CSS v3 + shadcn/ui + Radix UI                                        |
| State         | TanStack Query v5 (server state), React Context (local feature state)         |
| Forms         | react-hook-form + Zod                                                         |
| Auth          | next-auth v4 + httpOnly cookie JWTs                                           |
| Animations    | Motion (Framer Motion v12) + GSAP                                             |
| Notifications | sonner                                                                        |
| Deployment    | Docker (standalone output) — see [DEPLOYMENT.md](DEPLOYMENT.md)              |

---

## Getting Started

### Prerequisites

- Node.js 18+
- The [N88-backend](../N88-backend) running at `http://localhost:8000`

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/
SESSION_SECRET_KEY=your_session_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional for local dev)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Run

```bash
npm run dev     # Dev server — http://localhost:3000
npm run build   # Production build (standalone Docker output → .next/standalone)
npm run start   # Start production server
npm run lint    # ESLint check (not run automatically during builds)
```

> **No test suite** — do not add test files or jest/vitest config.

---

## Features

### Schedule Builder (`/schedule`)
The core feature. Resizable three-panel layout:
- **Subject search** — search all UFSC subjects by name or code
- **Subjects table** — list of added subjects with activation toggles per class
- **Selected subject detail** — class schedule and professor info
- **Week calendar** — visual weekly timetable built from active subjects
- **Editable title** — inline-editable schedule name with keyboard support
- **Save status indicator** — real-time cloud/local save status badge
- **Save to account** — persist the current schedule to the logged-in user's profile
- **Saved schedules** — browse and restore previously saved schedules
- **Received shared schedules** — accept or decline schedules shared by group members
- **Unsaved changes warning** — browser beforeunload guard when there are pending changes

### Authentication (`/auth`)
- **Sign in** — email/password login + Google OAuth button
- **Sign up** — account registration form
- All forms use react-hook-form + Zod with Portuguese validation messages
- Sessions use httpOnly cookie JWTs; middleware protects routes in production

### Profile (`/profile`)
- Displays user avatar (initials fallback), name, and email from session
- Lists all groups the user belongs to
- Edit profile dialog for updating user info

### Groups (`/groups`)
- Create study groups
- Search for other users to add as friends or group members
- Accept / decline friend requests
- Add friends to groups
- View group members and share schedules within a group

### Feedback (`/feedback`)
- Simple form to submit platform feedback to the backend

### Landing Page (`/`)
- Animated marketing page showcasing platform features
- Per-faculty interactive text animation (CTC, CCS, CFH, etc.)
- Feature highlights: difficulty calculator (in development), saved schedules, customization, schedule sharing

---

## Project Structure

```
app/
  api/             # Axios instance + API route handlers
  auth/            # Sign-in and sign-up pages
  feedback/        # Feedback submission page
  groups/          # Groups and friends management page
  hooks/           # TanStack Query hooks (useSavedSchedules, useSession, etc.)
  profile/         # User profile page
  schedule/        # Schedule builder (main feature)
    components/    # Feature UI components
    constants/     # Feature-level constants
    providers/     # SubjectsProvider (React context for schedule state)
    types/         # TypeScript types for schedule data
    utils/         # Schedule utility functions
  services/        # API service layer (fetch wrappers for each resource)
  layout.tsx       # Root layout — ThemeProvider, Menubar, Providers
  providers.tsx    # QueryClientProvider wrapper
components/
  ui/              # shadcn/ui primitives (do not edit directly)
  *.tsx            # Shared business components (dialogs, cards, etc.)
hooks/             # Root-level shared hooks (useMediaQuery, etc.)
lib/
  api.ts           # Direct fetch helpers (unauthenticated)
  auth.ts          # Auth helpers
  constants.ts     # Global constants (backendUrl, etc.)
  fetchWithAuth.ts # Authenticated fetch with automatic token refresh
  session.ts       # Session read/write helpers
  type.ts          # Global TypeScript types and Zod schemas
  utils.ts         # cn() utility (clsx + tailwind-merge)
middleware.tsx      # JWT session verification (bypassed in development)
```

---

## Deployment

The build output is configured as `standalone` for Docker. See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions including environment variable setup on Vercel or a self-hosted container.
