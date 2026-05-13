import Link from "next/link";
import {
  CalendarDays,
  Home,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "Social",
  "Career",
  "Sports",
  "Food",
  "Study",
  "Outdoors",
];

const events = [
  {
    id: "lake-union-picnic",
    title: "Lake Union picnic after work",
    category: "Social",
    time: "Today, 6:30 PM",
    location: "Lake Union Park",
    host: "Maya Chen",
    rsvps: 38,
    maybe: 12,
    note: "Bring snacks, blankets, and anyone from your pod.",
  },
  {
    id: "resume-roast",
    title: "Resume roast and interview prep",
    category: "Career",
    time: "Tomorrow, 5:00 PM",
    location: "Building 92 Cafe",
    host: "Intern Council",
    rsvps: 24,
    maybe: 8,
    note: "Casual peer feedback before final manager chats.",
  },
  {
    id: "volleyball",
    title: "Beach volleyball pickup",
    category: "Sports",
    time: "Sat, 11:00 AM",
    location: "Golden Gardens",
    host: "Andre Patel",
    rsvps: 19,
    maybe: 6,
    note: "All skill levels. Teams made when people arrive.",
  },
  {
    id: "night-market",
    title: "International District night market run",
    category: "Food",
    time: "Sun, 7:15 PM",
    location: "Uwajimaya entrance",
    host: "Nora Ali",
    rsvps: 31,
    maybe: 14,
    note: "Meet at the entrance, split into small food groups.",
  },
];

const navItems = [
  { label: "Home", href: "/", icon: Home, active: true },
  { label: "Search", href: "/", icon: Search, active: false },
  { label: "Events", href: "/", icon: CalendarDays, active: false },
  { label: "Chats", href: "/", icon: MessageCircle, active: false },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pb-24 text-foreground md:pb-0">
      <Navbar />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 md:gap-8 md:py-10 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[1.02fr_0.98fr] md:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8ccbd] bg-white px-3 py-1 text-sm font-medium text-[#51624b]">
              <Sparkles className="size-4" aria-hidden="true" />
              Microsoft intern events
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-[#171717] sm:text-5xl">
                Find the plan before it disappears in the chat.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[#5f5a52] sm:text-lg">
                Not another group chat. Just one place to see what&apos;s
                happening.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#ded6cb] bg-white p-2 shadow-sm md:max-w-md md:justify-self-end">
            <Stat value="12" label="today" />
            <Stat value="84" label="going" />
            <Stat value="6" label="groups" />
          </div>
        </div>

        <section aria-labelledby="categories-heading" className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 id="categories-heading" className="text-sm font-semibold">
              Browse by category
            </h2>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              View calendar
            </Button>
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  category === "All"
                    ? "h-9 shrink-0 rounded-full bg-[#1f3025] px-4 text-sm font-medium text-white shadow-sm"
                    : "h-9 shrink-0 rounded-full border border-[#ddd3c6] bg-white px-4 text-sm font-medium text-[#48433d] transition-colors hover:bg-[#f0ebe3]"
                }
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="events-heading" className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#65705f]">Upcoming</p>
              <h2
                id="events-heading"
                className="text-2xl font-semibold text-[#171717]"
              >
                Plans worth showing up for
              </h2>
            </div>
            <Button className="hidden bg-[#1f3025] text-white hover:bg-[#2b4434] sm:inline-flex">
              <Plus className="size-4" aria-hidden="true" />
              Post event
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-lg border border-[#ded6cb] bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <span className="inline-flex rounded-full bg-[#e7f0df] px-2.5 py-1 text-xs font-semibold text-[#37522f]">
                      {event.category}
                    </span>
                    <h3 className="text-lg font-semibold leading-snug text-[#171717]">
                      {event.title}
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    aria-label={`Open ${event.title}`}
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </Button>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#615b52]">
                  {event.note}
                </p>

                <div className="mt-4 grid gap-2 text-sm text-[#4d4943]">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#84672c]" aria-hidden="true" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-[#2f6f77]" aria-hidden="true" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-[#6f4c89]" aria-hidden="true" />
                    <span>
                      {event.rsvps} going, {event.maybe} maybe
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#eee7de] pt-3 text-sm">
                  <span className="text-[#6b655d]">Hosted by {event.host}</span>
                  <Button variant="ghost" size="sm">
                    RSVP
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <BottomNav />
    </main>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e1d8cd] bg-[#f7f4ef]/95 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="InternHub home">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[#1f3025] text-sm font-bold text-white">
            IH
          </span>
          <span className="text-lg font-semibold text-[#171717]">InternHub</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.slice(0, 3).map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>

        <Button className="bg-[#1f3025] text-white hover:bg-[#2b4434]" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Post
        </Button>
      </nav>
    </header>
  );
}

function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#ded6cb] bg-white px-3 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(38,30,20,0.08)] md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.active
                  ? "flex flex-col items-center justify-center gap-1 text-xs font-semibold text-[#1f3025]"
                  : "flex flex-col items-center justify-center gap-1 text-xs font-medium text-[#7a7369]"
              }
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md bg-[#f8f6f2] px-3 py-4 text-center">
      <div className="text-2xl font-semibold text-[#171717]">{value}</div>
      <div className="text-xs font-medium uppercase text-[#756f66]">{label}</div>
    </div>
  );
}
