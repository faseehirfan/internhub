"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { upsertProfile } from "@/src/lib/supabase/profile";
import { createSupabaseClient } from "@/src/lib/supabase/client";

export default function AuthCallbackPage() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      handleCallback();
    }, 0);

    return () => window.clearTimeout(timeoutId);

    async function handleCallback() {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(userError?.message ?? "Could not finish login.");
        return;
      }

      const { error: profileError } = await upsertProfile(supabase, user);

      if (profileError) {
        setError(profileError.message);
        return;
      }

      window.location.assign("/");
    }
  }, [supabase]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8 sm:px-6">
        <div className="rounded-lg border border-[#ded6cb] bg-white p-5 text-center shadow-sm sm:p-6">
          {error ? (
            <>
              <h1 className="text-xl font-semibold text-[#171717]">
                Login did not finish
              </h1>
              <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
              <Button className="mt-5" asChild>
                <Link href="/login">Try again</Link>
              </Button>
            </>
          ) : (
            <>
              <Loader2
                className="mx-auto size-5 animate-spin text-[#51624b]"
                aria-hidden="true"
              />
              <h1 className="mt-4 text-xl font-semibold text-[#171717]">
                Finishing login
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#615b52]">
                Setting up your InternHub profile.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
