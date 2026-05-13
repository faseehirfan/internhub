import { Users } from "lucide-react";

import type { Event } from "@/lib/types";

type RSVPCountsProps = {
  counts: Event["rsvpCounts"];
};

export function RSVPCounts({ counts }: RSVPCountsProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#4d4943]">
      <Users className="size-4 text-[#6f4c89]" aria-hidden="true" />
      <span>
        {counts.going} going, {counts.maybe} maybe
      </span>
    </div>
  );
}
