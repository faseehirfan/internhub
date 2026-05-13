import type { Category, Event } from "@/lib/types";

export const categories: Category[] = [
  "Social",
  "Career",
  "Sports",
  "Food",
  "Study",
  "Outdoors",
];

export const mockEvents: Event[] = [
  {
    id: "lake-union-picnic",
    title: "Lake Union picnic after work",
    description: "Bring snacks, blankets, and anyone from your pod.",
    category: "Social",
    startsAt: "Today, 6:30 PM",
    location: "Lake Union Park",
    creatorName: "Maya Chen",
    rsvpCounts: {
      going: 38,
      maybe: 12,
      not_going: 3,
    },
  },
  {
    id: "resume-roast",
    title: "Resume roast and interview prep",
    description: "Casual peer feedback before final manager chats.",
    category: "Career",
    startsAt: "Tomorrow, 5:00 PM",
    location: "Building 92 Cafe",
    creatorName: "Intern Council",
    rsvpCounts: {
      going: 24,
      maybe: 8,
      not_going: 1,
    },
  },
  {
    id: "volleyball",
    title: "Beach volleyball pickup",
    description: "All skill levels. Teams made when people arrive.",
    category: "Sports",
    startsAt: "Sat, 11:00 AM",
    location: "Golden Gardens",
    creatorName: "Andre Patel",
    rsvpCounts: {
      going: 19,
      maybe: 6,
      not_going: 2,
    },
  },
  {
    id: "night-market",
    title: "International District night market run",
    description: "Meet at the entrance, split into small food groups.",
    category: "Food",
    startsAt: "Sun, 7:15 PM",
    location: "Uwajimaya entrance",
    creatorName: "Nora Ali",
    rsvpCounts: {
      going: 31,
      maybe: 14,
      not_going: 4,
    },
  },
];
