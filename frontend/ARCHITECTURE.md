# Nepfluence Frontend Architecture

This frontend follows the architecture reference in `Nepfluence-Architecture.pdf` while keeping the current MVP preview screens intact.

## Structure

- `app/` owns Next.js routes and route-group layouts only.
- `features/` owns domain UI, hooks, and types.
- `components/ui/` owns reusable UI primitives with no business logic.
- `components/Layout/` owns public marketing layout pieces.
- `lib/` owns infrastructure helpers such as API, auth, WebSocket, uploads, and validators.
- `types/` owns cross-domain API and common types.
- `hooks/` is reserved for truly shared utility hooks.

## Domain Boundaries

Feature modules should not import from each other. If two features need the same type or helper, move it into `types/`, `lib/`, or `features/shared/`.

Current domains:

- `features/auth`
- `features/campaigns`
- `features/collaboration`
- `features/creator`
- `features/home`
- `features/notifications`
- `features/payments`
- `features/profile`
- `features/shared`
- `features/trust`

## Routing

Public auth routes live under `app/(auth)`. Role workspaces are currently:

- `/brand/dashboard`
- `/creator/dashboard`
- `/dashboard` as the brand dashboard compatibility route

When real auth middleware is connected, route protection should live in `middleware.ts` and role-specific shells should live in route-group `layout.tsx` files.
