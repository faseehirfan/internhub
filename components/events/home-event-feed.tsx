"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { CategoryFilter } from "@/components/events/category-filter";
import { EmptyState } from "@/components/events/empty-state";
import { EventFeed } from "@/components/events/event-feed";
import { Button } from "@/components/ui/button";
import {
  eventCategories,
  type Category,
  type Event,
  type RSVPStatus,
} from "@/lib/types";
import { createSupabaseClient } from "@/src/lib/supabase/client";

type EventRow = {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  location: string;
  category: Category;
  starts_at: string;
};

type RSVPRow = {
  event_id: string;
  status: RSVPStatus;
};

type ProfileRow = {
  id: string;
  display_name: string;
};

type EventGroup = {
  label: string;
  events: Event[];
};

export function HomeEventFeed() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All",
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchEvents() {
      setIsLoading(true);
      setError(null);

      const supabase = createSupabaseClient();
      const now = new Date().toISOString();

      const { data: eventRows, error: eventsError } = await supabase
        .from("events")
        .select("id, creator_id, title, description, location, category, starts_at")
        .gte("starts_at", now)
        .order("starts_at", { ascending: true });

      if (!isMounted) {
        return;
      }

      if (eventsError) {
        setError(eventsError.message);
        setIsLoading(false);
        return;
      }

      const rows = (eventRows ?? []) as EventRow[];

      if (rows.length === 0) {
        setEvents([]);
        setIsLoading(false);
        return;
      }

      const eventIds = rows.map((event) => event.id);
      const creatorIds = [...new Set(rows.map((event) => event.creator_id))];

      const [{ data: rsvpRows, error: rsvpsError }, { data: profileRows }] =
        await Promise.all([
          supabase
            .from("rsvps")
            .select("event_id, status")
            .in("event_id", eventIds)
            .in("status", ["going", "maybe"]),
          supabase
            .from("profiles")
            .select("id, display_name")
            .in("id", creatorIds),
        ]);

      if (!isMounted) {
        return;
      }

      if (rsvpsError) {
        setError(rsvpsError.message);
        setIsLoading(false);
        return;
      }

      setEvents(mapEvents(rows, (rsvpRows ?? []) as RSVPRow[], profileRows ?? []));
      setIsLoading(false);
    }

    fetchEvents().catch((unknownError: unknown) => {
      if (!isMounted) {
        return;
      }

      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Could not load events.",
      );
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === "All") {
      return events;
    }

    return events.filter((event) => event.category === selectedCategory);
  }, [events, selectedCategory]);

  const groupedEvents = useMemo(
    () => groupEvents(filteredEvents),
    [filteredEvents],
  );

  return (
    <>
      <section aria-labelledby="categories-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="categories-heading" className="text-sm font-semibold">
            Browse by category
          </h2>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            View calendar
          </Button>
        </div>

        <CategoryFilter
          categories={[...eventCategories]}
          onSelectCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
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
            Post event
          </Button>
        </div>

        {isLoading ? <EventFeedLoading /> : null}
        {error ? <EventFeedError message={error} /> : null}
        {!isLoading && !error ? (
          filteredEvents.length > 0 ? (
            <EventFeed events={filteredEvents} groups={groupedEvents} />
          ) : (
            <EmptyState
              title="No matching events"
              description="Try another category, or post the plan everyone keeps asking about."
            />
          )
        ) : null}
      </section>
    </>
  );
}

function mapEvents(
  eventRows: EventRow[],
  rsvpRows: RSVPRow[],
  profileRows: ProfileRow[],
): Event[] {
  const profilesById = new Map(
    profileRows.map((profile) => [profile.id, profile.display_name]),
  );
  const countsByEventId = new Map<string, Pick<Event["rsvpCounts"], "going" | "maybe">>();

  for (const event of eventRows) {
    countsByEventId.set(event.id, { going: 0, maybe: 0 });
  }

  for (const rsvp of rsvpRows) {
    const counts = countsByEventId.get(rsvp.event_id);

    if (!counts) {
      continue;
    }

    if (rsvp.status === "going" || rsvp.status === "maybe") {
      counts[rsvp.status] += 1;
    }
  }

  return eventRows.map((event) => {
    const counts = countsByEventId.get(event.id) ?? { going: 0, maybe: 0 };

    return {
      id: event.id,
      title: event.title,
      description: event.description ?? "Details coming soon.",
      category: event.category,
      startsAt: formatEventTime(event.starts_at),
      startsAtIso: event.starts_at,
      location: event.location,
      creatorName: profilesById.get(event.creator_id) ?? "Someone",
      rsvpCounts: {
        going: counts.going,
        maybe: counts.maybe,
        not_going: 0,
      },
    };
  });
}

function groupEvents(events: Event[]): EventGroup[] {
  const groups: EventGroup[] = [
    { label: "Today", events: [] },
    { label: "Tomorrow", events: [] },
    { label: "This Week", events: [] },
    { label: "Later", events: [] },
  ];

  for (const event of events) {
    const startsAt = new Date(event.startsAtIso);
    const dayOffset = getDayOffset(startsAt);

    if (dayOffset === 0) {
      groups[0].events.push(event);
    } else if (dayOffset === 1) {
      groups[1].events.push(event);
    } else if (dayOffset <= 7) {
      groups[2].events.push(event);
    } else {
      groups[3].events.push(event);
    }
  }

  return groups;
}

function getDayOffset(date: Date) {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  return Math.floor(
    (startOfDate.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000),
  );
}

function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function EventFeedLoading() {
  return (
    <div className="rounded-lg border border-[#ded6cb] bg-white p-5 text-sm text-[#615b52] shadow-sm">
      <div className="flex items-center gap-2">
        <Loader2 className="size-4 animate-spin text-[#51624b]" aria-hidden="true" />
        Loading plans...
      </div>
    </div>
  );
}

function EventFeedError({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4" aria-hidden="true" />
        <div>
          <p className="font-semibold">Could not load events</p>
          <p className="mt-1 leading-6">{message}</p>
        </div>
      </div>
    </div>
  );
}
