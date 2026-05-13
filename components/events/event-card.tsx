import Link from "next/link";
import { CalendarDays, MapPin, Plus } from "lucide-react";

import { RSVPCounts } from "@/components/events/rsvp-counts";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/types";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="rounded-lg border border-[#ded6cb] bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5">
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
          asChild
        >
          <Link href={`/events/${event.id}`}>
            <Plus className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#615b52]">
        {event.description}
      </p>

      <div className="mt-4 grid gap-2 text-sm text-[#4d4943]">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-[#84672c]" aria-hidden="true" />
          <span>{event.startsAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-[#2f6f77]" aria-hidden="true" />
          <span>{event.location}</span>
        </div>
        <RSVPCounts counts={event.rsvpCounts} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#eee7de] pt-3 text-sm">
        <span className="text-[#6b655d]">Hosted by {event.creatorName}</span>
        <Button variant="ghost" size="sm">
          RSVP
        </Button>
      </div>
    </article>
  );
}
