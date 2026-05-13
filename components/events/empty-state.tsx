import { CalendarX } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "No events yet",
  description = "When someone posts a plan, it will show up here.",
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-[#d8ccbd] bg-white px-5 py-10 text-center shadow-sm">
      <div className="mx-auto flex size-11 items-center justify-center rounded-lg bg-[#f0ebe3] text-[#51624b]">
        <CalendarX className="size-5" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#171717]">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#615b52]">
        {description}
      </p>
      <Button className="mt-5 bg-[#1f3025] text-white hover:bg-[#2b4434]">
        Post the first event
      </Button>
    </div>
  );
}
