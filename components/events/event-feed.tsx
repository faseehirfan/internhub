import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/events/empty-state";
import type { Event } from "@/lib/types";

type EventFeedProps = {
  events: Event[];
  groups?: {
    label: string;
    events: Event[];
  }[];
};

export function EventFeed({ events, groups }: EventFeedProps) {
  const hasEvents = groups
    ? groups.some((group) => group.events.length > 0)
    : events.length > 0;

  if (!hasEvents) {
    return <EmptyState />;
  }

  if (groups) {
    return (
      <div className="space-y-6">
        {groups.map((group) =>
          group.events.length > 0 ? (
            <section key={group.label} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase text-[#756f66]">
                {group.label}
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {group.events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ) : null,
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
