import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";

type EventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-foreground">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-5 sm:px-6 md:py-10">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Home
          </Link>
        </Button>

        <div className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-lg bg-[#e7f0df] text-[#37522f]">
            <CalendarDays className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-5 text-sm font-medium text-[#65705f]">
            Event posted
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#171717]">
            Event detail page
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#615b52]">
            This page is ready for event ID <span className="font-mono">{id}</span>.
            Event detail data will be wired up next.
          </p>
        </div>
      </section>
    </main>
  );
}
