import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/events/empty-state";
import type { Event } from "@/lib/types";

type EventFeedProps = {
  events: Event[];
};

export function EventFeed({ events }: EventFeedProps) {
  if (events.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
