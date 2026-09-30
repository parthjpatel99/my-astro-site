/**
 * Copy that shows up in more than one place (home hero, telemetry strip,
 * the route section and the About page). Edit here, not in the pages.
 */

export const LOCATION = {
  city: "Tucson, Arizona",
  coords: "32.2226° N, 110.9747° W",
  timezoneLabel: "MST",
};

export const NOW = {
  /** Shown in the floating card on the home hero */
  routing: "Fleet telemetry at Komatsu",
  stack: "Kotlin · Spring Boot",
  fleetValue: "$100K+ / hour",
  /** Telemetry strip */
  shippedTo: "200M+ Evernote users",
  currently: "An MCP server for fleet APIs",
};

export interface Stop {
  company: string;
  role: string;
  place: string;
  dates: string;
  current?: boolean;
  stat: string;
  statCaption: string;
  /** A few highlights for flavor — the resume has the full detail. May contain <strong>. */
  bullets: string[];
}

/** Oldest first — the route runs left to right. */
export const ROUTE: Stop[] = [
  {
    company: "ISRO · Space Applications Centre",
    role: "Research Intern",
    place: "Ahmedabad",
    dates: "Dec 2020 – Apr 2021",
    stat: "92%",
    statCaption:
      "detection accuracy teaching Mask R-CNN and YOLO to spot oceanic eddies in terabytes of satellite imagery.",
    bullets: [
      "Built a Python deep learning pipeline (Mask R-CNN, YOLO) that found oceanic eddies in raw satellite imagery with <strong>92%</strong> accuracy, batching terabytes of data without running out of memory.",
    ],
  },
  {
    company: "Evernote",
    role: "Software Engineer Intern",
    place: "Remote",
    dates: "Jun – Aug 2022",
    stat: "200M+",
    statCaption:
      "users got the task-filtering component I shipped across web, mobile and desktop, in TypeScript and GraphQL.",
    bullets: [
      "Shipped “Repeat After Completion” recurring tasks to <strong>50K+</strong> beta users — time-zone-aware recurrence logic in <strong>TypeScript/GraphQL</strong>.",
      "Built a reusable task-filtering component that reached <strong>200M+</strong> users across web, mobile and desktop.",
    ],
  },
  {
    company: "Komatsu",
    role: "Software Engineer II, autonomous haulage",
    place: "Tucson",
    dates: "Feb 2023 – now",
    current: true,
    stat: "2×",
    statCaption: "faster feature delivery after building an AI dev toolkit around a custom MCP server.",
    bullets: [
      "Own the <strong>Kotlin/Spring Boot</strong> data aggregation service that is the single source of truth for an autonomous haulage system — real-time telemetry from a fleet whose operations run <strong>$100K+/hour</strong>.",
      "Built an AI-augmented developer toolkit around a custom <strong>MCP server</strong> that lets coding agents search, call and validate our APIs, halving API verification time and doubling feature delivery.",
      "Cut developer onboarding by <strong>75%</strong> and serve as the technical liaison for partner teams building on the platform.",
    ],
  },
];

export const SUMMARY =
  "Backend Software Engineer owning the real-time data platform behind a production autonomous haulage system. Depth in distributed Kotlin/Spring Boot service design, AI-augmented developer tooling (MCP, LLM agent integration), and consumer-scale delivery to 200M+ users.";

export const GAME_URL = "https://game.parthjpatel.me";
