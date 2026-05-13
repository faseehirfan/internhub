"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { getProfileFields, upsertProfile } from "@/src/lib/supabase/profile";
import { createSupabaseClient } from "@/src/lib/supabase/client";

type UserProfile = {
  displayName: string;
  avatarUrl: string | null;
};

export function UserMenu() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      supabase.auth.getUser().then(async ({ data }) => {
        if (data.user) {
          await upsertProfile(supabase, data.user);
          setProfile(toUserProfile(data.user));
        }

        setIsLoading(false);
      });
    }, 0);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setProfile(user ? toUserProfile(user) : null);
      setIsLoading(false);
    });

    return () => {
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  if (isLoading) {
    return (
      <div className="hidden h-8 w-24 rounded-md bg-[#ede6dc] sm:block" />
    );
  }

  if (!profile) {
    return (
      <Button className="bg-[#1f3025] text-white hover:bg-[#2b4434]" size="sm" asChild>
        <Link href="/login">Log in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 sm:flex">
        {profile.avatarUrl ? (
          <Image
            alt=""
            className="size-8 rounded-full border border-[#ded6cb]"
            height={32}
            src={profile.avatarUrl}
            unoptimized
            width={32}
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-[#1f3025] text-xs font-semibold text-white">
            {profile.displayName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <span className="max-w-28 truncate text-sm font-medium text-[#2d2a26]">
          {profile.displayName}
        </span>
      </div>
      <Button
        aria-label="Sign out"
        onClick={signOut}
        size="icon"
        type="button"
        variant="ghost"
      >
        <LogOut className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

function toUserProfile(user: User): UserProfile {
  const profile = getProfileFields(user);

  return {
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url ?? null,
  };
}
