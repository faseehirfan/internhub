export const eventCategories = [
  "Social",
  "Career",
  "Sports",
  "Food",
  "Study",
  "Outdoors",
] as const;

export type Category = (typeof eventCategories)[number];

export type RSVPStatus = "going" | "maybe" | "not_going";

export type Event = {
  id: string;
  title: string;
  description: string;
  category: Category;
  startsAt: string;
  startsAtIso: string;
  location: string;
  creatorName: string;
  rsvpCounts: Record<RSVPStatus, number>;
};
