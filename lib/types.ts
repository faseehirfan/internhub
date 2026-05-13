export type Category =
  | "Social"
  | "Career"
  | "Sports"
  | "Food"
  | "Study"
  | "Outdoors";

export type RSVPStatus = "going" | "maybe" | "not_going";

export type Event = {
  id: string;
  title: string;
  description: string;
  category: Category;
  startsAt: string;
  location: string;
  creatorName: string;
  rsvpCounts: Record<RSVPStatus, number>;
};
