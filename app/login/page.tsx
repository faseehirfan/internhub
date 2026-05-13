"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { upsertProfile } from "@/src/lib/supabase/profile";
import { createSupabaseClient } from "@/src/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submitAuth(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    if (mode === "sign-up") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        await upsertProfile(supabase, data.user);
      }

      if (!data.session) {
        setMessage("Check your email to confirm your account, then sign in.");
        setMode("sign-in");
        setIsLoading(false);
        return;
      }

      router.push("/");
      return;
    }

    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      await upsertProfile(supabase, data.user);
    }

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-5 px-4 py-8 sm:px-6">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Link>
        </Button>

        <div className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm sm:p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[#171717]">
              {mode === "sign-in" ? "Log in" : "Create account"}
            </h1>
            <p className="text-sm leading-6 text-[#615b52]">
              {mode === "sign-in"
                ? "Use your email and password to see events, RSVP, and comment."
                : "Make a quick account so your plans and RSVPs have a name."}
            </p>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={submitAuth}>
            {mode === "sign-up" ? (
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#2d2a26]">
                  Name
                </span>
                <input
                  className={fieldClassName}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Avery Chen"
                  required
                  type="text"
                  value={name}
                />
              </label>
            ) : null}

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#2d2a26]">
                Email
              </span>
              <input
                className={fieldClassName}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#2d2a26]">
                Password
              </span>
              <input
                className={fieldClassName}
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>

            <Button
              className="mt-2 w-full bg-[#1f3025] text-white hover:bg-[#2b4434]"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {mode === "sign-in" ? "Log in" : "Create account"}
            </Button>
          </form>

          {message ? (
            <p className="mt-4 rounded-md border border-[#d8ccbd] bg-[#f8f6f2] px-3 py-2 text-sm text-[#4d4943]">
              {message}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            className="mt-5 text-sm font-medium text-[#1f3025] underline-offset-4 hover:underline"
            onClick={() => {
              setError(null);
              setMessage(null);
              setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            }}
            type="button"
          >
            {mode === "sign-in"
              ? "Need an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </section>
    </main>
  );
}

const fieldClassName =
  "h-10 w-full rounded-md border border-[#ddd3c6] bg-[#fffdfa] px-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#9a9186] focus:border-[#51624b] focus:ring-3 focus:ring-[#51624b]/15";
