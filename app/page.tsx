import Link from "next/link";
import { Plus } from "lucide-react";

import { UserMenu } from "@/components/auth/user-menu";
import { HomeEventFeed } from "@/components/events/home-event-feed";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-foreground">
      <Navbar />

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-6 sm:px-6 md:py-10">
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-[#65705f]">
              Microsoft intern events
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-[#171717]">
              Find the plan before it disappears in the chat.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[#5f5a52]">
              Not another group chat. Just one place to see what&apos;s
              happening.
            </p>
          </div>
          <Button
            className="bg-[#1f3025] text-white hover:bg-[#2b4434]"
            size="lg"
            asChild
          >
            <Link href="/create">
              <Plus className="size-4" aria-hidden="true" />
              Post a plan
            </Link>
          </Button>
        </div>

        <HomeEventFeed />
      </section>
    </main>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e6ded3] bg-[#f7f4ef]/95 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-[#171717]">
          InternHub
        </Link>
        <UserMenu />
      </nav>
    </header>
  );
}
