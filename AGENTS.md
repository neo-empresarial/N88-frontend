# AGENTS.md — N88 Frontend Codebase Guide

## Project Overview

Next.js 14 (App Router) frontend for MatrUFSC 2.0 — a university schedule management platform.
Stack: Next.js 14, React 18, TypeScript 5 (strict), Tailwind CSS v3, shadcn/ui, Radix UI, TanStack Query v5, Zod, react-hook-form, Axios, next-auth v4, sonner/react-toastify.

---

## Build & Dev Commands

```bash
# Development
npm run dev           # Start dev server at localhost:3000

# Build
npm run build         # Production build (standalone output for Docker)

# Lint
npm run lint          # ESLint via next lint

# Start production
npm run start         # Start production server
```

**No test suite exists** — there are no test files in this project. Skip any test-related steps.

**ESLint is disabled during builds** (`ignoreDuringBuilds: true` in `next.config.mjs`). Run `npm run lint` manually to check.

---

## Project Structure

```
app/                     # Next.js App Router
  api/                   # API route handlers + AxiosInstance
  auth/                  # Sign-in / sign-up pages
  feedback/              # Feedback feature
  groups/                # Groups & friends feature
  hooks/                 # Feature-level custom hooks (TanStack Query wrappers)
  profile/               # User profile pages
  schedule/              # Schedule builder (main feature)
    components/          # Schedule-specific UI components
    constants/           # Feature constants
    providers/           # React context providers (SubjectsProvider)
    types/               # Feature-specific TypeScript types
    utils/               # Feature utilities
  services/              # API service hooks (named `use*` hooks wrapping fetch)
  layout.tsx             # Root layout with Menubar, ThemeProvider, Providers
  providers.tsx          # TanStack Query QueryClientProvider wrapper
components/              # Shared UI components
  ui/                    # shadcn/ui primitives (auto-generated, avoid editing directly)
  *.tsx                  # Shared business components (dialogs, cards, buttons)
hooks/                   # Root-level shared hooks
lib/                     # Shared utilities and config
  api.ts                 # Direct fetch helpers (non-hook API calls)
  auth.ts                # Auth helpers
  constants.ts           # Global constants
  fetchWithAuth.ts       # Authenticated fetch wrapper with token refresh
  session.ts             # Session read/write helpers
  type.ts                # Global types, Zod schemas
  utils.ts               # cn() utility (clsx + tailwind-merge)
middleware.tsx            # JWT session verification (bypassed in development)
```

---

## Code Style Guidelines

### TypeScript

- **Strict mode is ON** (`"strict": true` in `tsconfig.json`). Never suppress errors with `as any`, `@ts-ignore`, or `@ts-expect-error`.
- Use `interface` for object shapes passed between components or returned from APIs. Use `type` for unions, aliases, and computed types.
- Prefix interfaces with `I` only for domain data models (e.g. `ICourse`). Component prop types do not need a prefix.
- Use explicit return types on exported functions; infer return types on local helpers where obvious.
- Import types with `import type { ... }` when importing only types.
- Path alias `@/*` maps to the project root. Always use `@/` for non-relative imports.

```ts
// ✅ Correct
import type { SavedSchedule } from "@/app/services/savedSchedulesService";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// ❌ Wrong
import { SavedSchedule } from "../../services/savedSchedulesService";
```

### Naming Conventions

| Construct | Convention | Example |
|---|---|---|
| React components | PascalCase | `MyGroupsCard`, `SearchSubject` |
| Component files | kebab-case or PascalCase matching export | `my-groups-card.tsx`, `SearchSubject.tsx` |
| Hooks | `use` prefix, camelCase | `useSavedSchedulesQuery`, `useMediaQuery` |
| Services (hook-style) | `use` prefix | `useSavedSchedules` (inside service files) |
| Types/interfaces | PascalCase | `SavedSchedule`, `SubjectsType`, `groupType` |
| Constants | camelCase (file-level) or SCREAMING_SNAKE_CASE (module-level) | `backendUrl`, `SESSION_SECRET_KEY` |
| Zod schemas | PascalCase + `Schema` suffix | `SignUpFormSchema`, `SignInFormSchema` |

### Imports Order

1. React and Next.js imports
2. Third-party libraries
3. Internal `@/lib/*`, `@/hooks/*`
4. Internal `@/components/*`
5. Local relative imports (`./`, `../`)
6. Type-only imports last (or alongside related imports)

### Components

- Client components require `"use client"` at the very top of the file.
- Server components do not need a directive — default in App Router.
- Place the `"use client"` directive on the first line, before any imports.
- Export one default component per file matching the filename.
- Inline prop types using destructuring, or define a local `type Props = {...}`.

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  groupId: number;
  onSuccess?: () => void;
};

export default function DeleteGroupDialog({ groupId, onSuccess }: Props) {
  // ...
}
```

### Styling

- Use **Tailwind CSS** utility classes exclusively — no raw CSS except in `globals.css`.
- Use the `cn()` helper from `@/lib/utils` to merge conditional classes:
  ```ts
  import { cn } from "@/lib/utils";
  className={cn("base-class", condition && "conditional-class")}
  ```
- Tailwind CSS has **CSS variables** for all theme colors (`hsl(var(--background))` etc.). Use semantic color names (`bg-background`, `text-foreground`, `text-muted-foreground`) rather than hardcoded Tailwind colors for theme-aware components.
- Dark mode is class-based (`dark:`). Always add dark variants for backgrounds and text.
- Custom height scale is extended (e.g., `h-100` = 25rem through `h-200` = 50rem).

### API & Data Fetching

- All authenticated HTTP calls go through **`fetchWithAuth`** from `@/lib/fetchWithAuth.ts` — never use bare `fetch` for authenticated routes.
- API service logic is organized in `app/services/` as hook-style functions (`useSavedSchedules`). They return async functions; do not call them directly outside their paired query hooks.
- Data fetching state is managed with **TanStack Query v5** (`useQuery`, `useMutation`). Keep all server state in Query — avoid duplicating it in `useState`.
- Query keys use string arrays: `["savedSchedules"]`, `["groups"]`, etc. Be consistent.
- After mutations, invalidate related queries via `queryClient.invalidateQueries({ queryKey: [...] })`.
- Backend URL is always from `process.env.NEXT_PUBLIC_BACKEND_URL`. Do not hardcode URLs.

### Error Handling

- In service functions: check `response.ok` and `throw new Error(...)` with a descriptive message on failure.
- In mutation `onError` callbacks: show a `toast.error(error.message || "fallback message")` using **sonner** (`import { toast } from "sonner"`).
- In mutation `onSuccess` callbacks: show a `toast.success(...)`.
- Log unexpected errors with `console.error(...)` before re-throwing or surfacing to the user.
- Never use empty catch blocks.

### Forms

- Use **react-hook-form** with **`@hookform/resolvers/zod`** for all forms.
- Define Zod schemas in `lib/type.ts` (global) or co-locate with the feature.
- Validation messages are in Brazilian Portuguese to match the existing codebase.

### State Management

- **No global client state library** — use TanStack Query for server state, React context for local feature state (e.g., `SubjectsProvider`).
- Context providers live in the feature's `providers/` subdirectory.
- Root-level providers (`QueryClientProvider`, `ThemeProvider`) are in `app/providers.tsx` and `app/layout.tsx`.

---

## Environment Variables

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL (must end with `/`) |
| `SESSION_SECRET_KEY` | JWT signing secret for session cookies |
| `NEXTAUTH_SECRET` | next-auth secret |

---

## Key Constraints

- **No test runner** — do not add test files or jest/vitest config unless explicitly requested.
- **Standalone output** — `next.config.mjs` sets `output: "standalone"` for Docker. Do not remove.
- **Middleware bypasses auth in development** — `process.env.NODE_ENV === "development"` always passes through. Expect no auth redirects locally.
- **shadcn/ui components** in `components/ui/` are generated and should not be manually edited unless patching a specific bug. Add new primitives via `npx shadcn-ui@latest add <component>`.
- **Fonts** are local (`GeistVF.woff`, `GeistMonoVF.woff`) loaded via `next/font/local` — do not add Google Fonts.
