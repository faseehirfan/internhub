<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Agent Instructions

You are building InternHub, a mobile-first event coordination app.

## Technical preferences

- Use Next.js App Router.
- Use TypeScript.
- Use server components by default.
- Use client components only when needed for interactivity.
- Use Tailwind CSS and shadcn/ui.
- Keep components small and readable.
- Prefer feature-based organization.
- Avoid overengineering.

## Product preferences

- The app should feel casual, social, and lightweight.
- Do not make it feel like an enterprise calendar.
- Use phrases like:
  - "Post a plan"
  - "What's happening"
  - "Going"
  - "Maybe"
- Optimize for phone screens first.

## Code quality

- Use clear types.
- Avoid `any`.
- Add basic empty states.
- Add loading and error states where appropriate.
- Keep database logic isolated in `src/lib`.
- Do not introduce unnecessary packages.

## MVP scope

Build only:

- events feed
- create event
- event detail page
- RSVP
- comments
- auth
- share link/copy text

Do not build:

- native mobile app
- full chat system
- Instagram API integration
- push notifications
- friend system
- complex recommendation feed
