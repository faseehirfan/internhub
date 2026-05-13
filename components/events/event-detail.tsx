"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Copy,
  Loader2,
  MapPin,
  MessageCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Category, RSVPStatus } from "@/lib/types";
import { upsertProfile } from "@/src/lib/supabase/profile";
import { createSupabaseClient } from "@/src/lib/supabase/client";

type EventRow = {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  location: string;
  category: Category;
  starts_at: string;
  ends_at: string | null;
  chat_link: string | null;
  capacity: number | null;
};

type ProfileRow = {
  id: string;
  display_name: string;
};

type RSVPRow = {
  event_id: string;
  user_id: string;
  status: RSVPStatus;
};

type CommentRow = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
};

type CommentWithAuthor = CommentRow & {
  authorName: string;
};

type RSVPCounts = Record<RSVPStatus, number>;

export function EventDetail({ eventId }: { eventId: string }) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [event, setEvent] = useState<EventRow | null>(null);
  const [creatorName, setCreatorName] = useState("Someone");
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [counts, setCounts] = useState<RSVPCounts>({
    going: 0,
    maybe: 0,
    not_going: 0,
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentRSVP, setCurrentRSVP] = useState<RSVPStatus | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy share text");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingRSVP, setIsSavingRSVP] = useState(false);
  const [isSavingComment, setIsSavingComment] = useState(false);

  const handleLoadError = useCallback((unknownError: unknown) => {
    setError(
      unknownError instanceof Error
        ? unknownError.message
        : "Could not load event.",
    );
    setIsLoading(false);
  }, []);

  const loadEvent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    await upsertProfile(supabase, user);
    setCurrentUserId(user.id);

    const { data: eventRow, error: eventError } = await supabase
      .from("events")
      .select(
        "id, creator_id, title, description, location, category, starts_at, ends_at, chat_link, capacity",
      )
      .eq("id", eventId)
      .single();

    if (eventError) {
      setError(eventError.message);
      setIsLoading(false);
      return;
    }

    const typedEvent = eventRow as EventRow;
    const [
      { data: profileRows },
      { data: rsvpRows, error: rsvpsError },
      { data: commentRows, error: commentsError },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, display_name")
        .eq("id", typedEvent.creator_id),
      supabase
        .from("rsvps")
        .select("event_id, user_id, status")
        .eq("event_id", eventId),
      supabase
        .from("comments")
        .select("id, user_id, body, created_at")
        .eq("event_id", eventId)
        .order("created_at", { ascending: true }),
    ]);

    if (rsvpsError || commentsError) {
      setError(
        rsvpsError?.message ?? commentsError?.message ?? "Could not load event.",
      );
      setIsLoading(false);
      return;
    }

    const typedRsvps = (rsvpRows ?? []) as RSVPRow[];
    const typedComments = (commentRows ?? []) as CommentRow[];
    const commentAuthorIds = [
      ...new Set(typedComments.map((comment) => comment.user_id)),
    ];

    const { data: commentProfiles } =
      commentAuthorIds.length > 0
        ? await supabase
            .from("profiles")
            .select("id, display_name")
            .in("id", commentAuthorIds)
        : { data: [] };

    setEvent(typedEvent);
    setCreatorName(
      ((profileRows ?? []) as ProfileRow[])[0]?.display_name ?? "Someone",
    );
    setCounts(countRSVPs(typedRsvps));
    setCurrentRSVP(
      typedRsvps.find((rsvp) => rsvp.user_id === user.id)?.status ?? null,
    );
    setComments(mapComments(typedComments, commentProfiles ?? []));
    setIsLoading(false);
  }, [eventId, router, supabase]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadEvent().catch(handleLoadError);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [handleLoadError, loadEvent]);

  async function saveRSVP(status: RSVPStatus) {
    if (!currentUserId) {
      router.push("/login");
      return;
    }

    setIsSavingRSVP(true);
    setError(null);

    const { error: rsvpError } = await supabase.from("rsvps").upsert(
      {
        event_id: eventId,
        user_id: currentUserId,
        status,
      },
      { onConflict: "event_id,user_id" },
    );

    if (rsvpError) {
      setError(rsvpError.message);
      setIsSavingRSVP(false);
      return;
    }

    await loadEvent().catch(handleLoadError);
    setIsSavingRSVP(false);
  }

  async function saveComment(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (!currentUserId) {
      router.push("/login");
      return;
    }

    const body = commentBody.trim();

    if (!body) {
      return;
    }

    setIsSavingComment(true);
    setError(null);

    const { error: commentError } = await supabase.from("comments").insert({
      event_id: eventId,
      user_id: currentUserId,
      body,
    });

    if (commentError) {
      setError(commentError.message);
      setIsSavingComment(false);
      return;
    }

    setCommentBody("");
    await loadEvent().catch(handleLoadError);
    setIsSavingComment(false);
  }

  async function copyShareText() {
    if (!event) {
      return;
    }

    const url = window.location.href;
    const message = `${event.title} at ${event.location} on ${formatEventDate(
      event.starts_at,
    )}. RSVP here: ${url}`;

    await navigator.clipboard.writeText(message);
    setCopyLabel("Copied");
    window.setTimeout(() => setCopyLabel("Copy share text"), 1500);
  }

  if (isLoading) {
    return (
      <DetailShell>
        <div className="rounded-lg border border-[#ded6cb] bg-white p-5 text-sm text-[#615b52] shadow-sm">
          <div className="flex items-center gap-2">
            <Loader2
              className="size-4 animate-spin text-[#51624b]"
              aria-hidden="true"
            />
            Loading event...
          </div>
        </div>
      </DetailShell>
    );
  }

  if (!event) {
    return (
      <DetailShell>
        <ErrorCard message={error ?? "Event not found."} />
      </DetailShell>
    );
  }

  return (
    <DetailShell>
      <article className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-[#e7f0df] px-2.5 py-1 text-xs font-semibold text-[#37522f]">
              {event.category}
            </span>
            <div>
              <h1 className="text-3xl font-semibold leading-tight text-[#171717]">
                {event.title}
              </h1>
              <p className="mt-2 text-sm text-[#6b655d]">
                Hosted by {creatorName}
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={copyShareText} type="button">
            <Copy className="size-4" aria-hidden="true" />
            {copyLabel}
          </Button>
        </div>

        {event.description ? (
          <p className="mt-5 text-sm leading-6 text-[#615b52]">
            {event.description}
          </p>
        ) : null}

        <div className="mt-5 grid gap-3 text-sm text-[#4d4943] sm:grid-cols-2">
          <DetailLine icon={CalendarDays} text={formatEventRange(event)} />
          <DetailLine icon={MapPin} text={event.location} />
          {event.capacity ? (
            <DetailLine icon={Users} text={`${event.capacity} spots`} />
          ) : null}
          {event.chat_link ? (
            <a
              className="font-medium text-[#1f3025] underline-offset-4 hover:underline"
              href={event.chat_link}
              rel="noreferrer"
              target="_blank"
            >
              Open chat link
            </a>
          ) : null}
        </div>
      </article>

      <section className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#65705f]">RSVPs</p>
            <h2 className="text-xl font-semibold text-[#171717]">
              Who&apos;s in?
            </h2>
          </div>
          <div className="text-right text-sm text-[#615b52]">
            <p>{counts.going} going</p>
            <p>{counts.maybe} maybe</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {(["going", "maybe", "not_going"] as RSVPStatus[]).map((status) => (
            <Button
              key={status}
              className={
                currentRSVP === status
                  ? "bg-[#1f3025] text-white hover:bg-[#2b4434]"
                  : ""
              }
              disabled={isSavingRSVP}
              onClick={() => saveRSVP(status)}
              type="button"
              variant={currentRSVP === status ? "default" : "outline"}
            >
              {formatRSVPStatus(status)}
            </Button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="size-5 text-[#51624b]" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-[#171717]">Comments</h2>
        </div>

        <form className="mt-4 grid gap-3" onSubmit={saveComment}>
          <textarea
            className="min-h-24 w-full resize-y rounded-md border border-[#ddd3c6] bg-[#fffdfa] px-3 py-2 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#9a9186] focus:border-[#51624b] focus:ring-3 focus:ring-[#51624b]/15"
            onChange={(commentEvent) => setCommentBody(commentEvent.target.value)}
            placeholder="Add a quick note..."
            value={commentBody}
          />
          <Button
            className="justify-self-end bg-[#1f3025] text-white hover:bg-[#2b4434]"
            disabled={isSavingComment || !commentBody.trim()}
            type="submit"
          >
            {isSavingComment ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Post comment
          </Button>
        </form>

        <div className="mt-5 space-y-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-md border border-[#eee7de] bg-[#fffdfa] p-3"
              >
                <div className="flex items-center justify-between gap-3 text-xs text-[#756f66]">
                  <span className="font-semibold text-[#3c3934]">
                    {comment.authorName}
                  </span>
                  <time dateTime={comment.created_at}>
                    {formatEventDate(comment.created_at)}
                  </time>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#4d4943]">
                  {comment.body}
                </p>
              </article>
            ))
          ) : (
            <p className="rounded-md border border-dashed border-[#d8ccbd] bg-[#fffdfa] p-4 text-sm text-[#615b52]">
              No comments yet.
            </p>
          )}
        </div>
      </section>

      {error ? <ErrorCard message={error} /> : null}
    </DetailShell>
  );
}

function DetailShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-foreground">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-5 sm:px-6 md:py-10">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Link>
        </Button>
        {children}
      </section>
    </main>
  );
}

function DetailLine({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-[#84672c]" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-1 leading-6">{message}</p>
    </div>
  );
}

function countRSVPs(rsvps: RSVPRow[]): RSVPCounts {
  return rsvps.reduce<RSVPCounts>(
    (nextCounts, rsvp) => {
      nextCounts[rsvp.status] += 1;
      return nextCounts;
    },
    { going: 0, maybe: 0, not_going: 0 },
  );
}

function mapComments(
  comments: CommentRow[],
  profiles: ProfileRow[],
): CommentWithAuthor[] {
  const profilesById = new Map(
    profiles.map((profile) => [profile.id, profile.display_name]),
  );

  return comments.map((comment) => ({
    ...comment,
    authorName: profilesById.get(comment.user_id) ?? "Someone",
  }));
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatEventRange(event: EventRow) {
  const startsAt = formatEventDate(event.starts_at);

  if (!event.ends_at) {
    return startsAt;
  }

  return `${startsAt} to ${formatEventDate(event.ends_at)}`;
}

function formatRSVPStatus(status: RSVPStatus) {
  if (status === "not_going") {
    return "Not going";
  }

  return status[0].toUpperCase() + status.slice(1);
}
