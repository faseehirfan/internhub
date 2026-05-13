# InternHub Product Spec

InternHub is a mobile-first events board for Microsoft interns.

The goal is not to replace Instagram group chats. The goal is to create one place where interns can discover events, RSVP, and share event links back into Instagram chats.

## MVP Features

1. Events feed

- Show upcoming events sorted by start time.
- Group events by Today, Tomorrow, This Week, Later.
- Show event title, time, location, category, RSVP counts, and creator.

2. Create event

- Users can create an event with:
  - title
  - description
  - location
  - category
  - starts_at
  - ends_at optional
  - chat_link optional
  - capacity optional

3. Event detail page

- Show full event info.
- Show RSVP buttons: Going, Maybe, Not Going.
- Show attendee counts.
- Show comments.
- Include a button to copy share text.

4. RSVP

- One RSVP per user per event.
- User can update RSVP.

5. Comments

- Users can comment on an event.
- Comments are shown oldest to newest.

6. Auth

- Use Supabase Auth.
- For MVP, Google / Apple login is acceptable.
- Later, consider Microsoft login.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Postgres
- Supabase Auth
- Vercel

## Design Principles

- Mobile-first.
- Fast to post a plan.
- Casual wording.
- Not too formal.
- Instagram remains the social layer.
- InternHub is the coordination layer.

## Core tagline

Not another group chat. Just one place to see what’s happening.
