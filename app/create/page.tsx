"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarDays, Loader2, MapPin, PartyPopper } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/src/lib/supabase/client";

const categories = ["Social", "Career", "Sports", "Food", "Study", "Outdoors"] as const;

const createEventSchema = z
  .object({
    title: z.string().trim().min(1, "Add a title so people know the plan."),
    description: z.string().trim().optional(),
    location: z.string().trim().min(1, "Add where people should meet."),
    category: z.enum(categories, {
      error: "Pick a category.",
    }),
    starts_at: z.string().min(1, "Add when it starts."),
    ends_at: z.string().optional(),
    chat_link: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || z.url().safeParse(value).success, {
        message: "Use a full link, like https://...",
      }),
    capacity: z
      .string()
      .optional()
      .refine((value) => !value || Number.isInteger(Number(value)), {
        message: "Use a whole number.",
      })
      .refine((value) => !value || Number(value) > 0, {
        message: "Capacity should be at least 1.",
      }),
  })
  .refine(
    (values) => {
      if (!values.ends_at) {
        return true;
      }

      return new Date(values.ends_at) >= new Date(values.starts_at);
    },
    {
      message: "End time should be after the start.",
      path: ["ends_at"],
    },
  );

type CreateEventValues = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      category: "Social",
      description: "",
      chat_link: "",
      capacity: "",
    },
  });

  async function onSubmit(values: CreateEventValues) {
    setSubmitError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      // TODO: Redirect to login once auth screens are in place.
      setSubmitError("You need to be signed in before posting an event.");
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .insert({
        title: values.title,
        description: values.description || null,
        location: values.location,
        category: values.category,
        starts_at: new Date(values.starts_at).toISOString(),
        ends_at: values.ends_at ? new Date(values.ends_at).toISOString() : null,
        chat_link: values.chat_link || null,
        capacity: values.capacity ? Number(values.capacity) : null,
        creator_id: user.id,
      })
      .select("id")
      .single();

    if (error) {
      setSubmitError(error.message);
      return;
    }

    router.push(`/events/${data.id}`);
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-foreground">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-5 sm:px-6 md:py-10">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Home
          </Link>
        </Button>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8ccbd] bg-white px-3 py-1 text-sm font-medium text-[#51624b]">
            <PartyPopper className="size-4" aria-hidden="true" />
            Post a plan
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold leading-tight text-[#171717] sm:text-4xl">
              What&apos;s happening?
            </h1>
            <p className="max-w-xl text-sm leading-6 text-[#615b52] sm:text-base">
              Keep it casual. InternHub just needs enough detail for people to
              show up.
            </p>
          </div>
        </div>

        <form
          className="rounded-lg border border-[#ded6cb] bg-white p-4 shadow-sm sm:p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-5">
            <Field label="What's the plan?" error={errors.title?.message}>
              <input
                className={fieldClassName}
                placeholder="Lake Union picnic after work"
                type="text"
                {...register("title")}
              />
            </Field>

            <Field label="Add a few details" error={errors.description?.message}>
              <textarea
                className={`${fieldClassName} min-h-28 resize-y py-2`}
                placeholder="What should people bring? Who is this for?"
                {...register("description")}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Where?" error={errors.location?.message}>
                <div className="relative">
                  <MapPin
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#756f66]"
                    aria-hidden="true"
                  />
                  <input
                    className={`${fieldClassName} pl-9`}
                    placeholder="Lake Union Park"
                    type="text"
                    {...register("location")}
                  />
                </div>
              </Field>

              <Field label="What kind of plan?" error={errors.category?.message}>
                <select className={fieldClassName} {...register("category")}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="When?" error={errors.starts_at?.message}>
                <div className="relative">
                  <CalendarDays
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#756f66]"
                    aria-hidden="true"
                  />
                  <input
                    className={`${fieldClassName} pl-9`}
                    type="datetime-local"
                    {...register("starts_at")}
                  />
                </div>
              </Field>

              <Field label="Ends when?" error={errors.ends_at?.message}>
                <input
                  className={fieldClassName}
                  type="datetime-local"
                  {...register("ends_at")}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Drop the chat link" error={errors.chat_link?.message}>
                <input
                  className={fieldClassName}
                  placeholder="https://..."
                  type="url"
                  {...register("chat_link")}
                />
              </Field>

              <Field label="Cap it at" error={errors.capacity?.message}>
                <input
                  className={fieldClassName}
                  inputMode="numeric"
                  min={1}
                  placeholder="No limit"
                  type="number"
                  {...register("capacity")}
                />
              </Field>
            </div>

            {submitError ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button variant="outline" type="button" asChild>
                <Link href="/">Cancel</Link>
              </Button>
              <Button
                className="bg-[#1f3025] text-white hover:bg-[#2b4434]"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                Post event
              </Button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

const fieldClassName =
  "h-10 w-full rounded-md border border-[#ddd3c6] bg-[#fffdfa] px-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#9a9186] focus:border-[#51624b] focus:ring-3 focus:ring-[#51624b]/15";

function Field({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#2d2a26]">{label}</span>
      {children}
      {error ? <span className="text-sm text-red-700">{error}</span> : null}
    </label>
  );
}
