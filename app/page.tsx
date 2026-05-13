import Link from "next/link";
import {
  CalendarDays,
  Home,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

import { CategoryFilter } from "@/components/events/category-filter";
import { EventFeed } from "@/components/events/event-feed";
import { Button } from "@/components/ui/button";
import { categories, mockEvents } from "@/lib/mock-events";

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

          <CategoryFilter categories={categories} />
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

          <EventFeed events={mockEvents} />
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
