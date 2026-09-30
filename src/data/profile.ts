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
      "detection accuracy teaching Mask R-CNN and YOLO to spot oceanic eddies in raw satellite imagery.",
    bullets: [
      "Achieved <strong>92%</strong> detection accuracy on oceanic eddy identification using a Python deep learning pipeline (Mask R-CNN, YOLO).",
      "Transformed raw satellite imagery datasets into structured ML training inputs for ocean circulation classification.",
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
      "Shipped the “Repeat After Completion” recurring-task feature to <strong>50K+</strong> beta users using <strong>TypeScript/GraphQL</strong>.",
      "Deployed a reusable task-filtering component to <strong>200M+</strong> users across Web, Mobile, and Desktop.",
    ],
  },
  {
    company: "Komatsu",
    role: "Software Engineer, autonomous haulage",
    place: "Tucson",
    dates: "Feb 2023 – now",
    current: true,
    stat: "2×",
    statCaption: "faster feature delivery after building an AI dev toolkit around a custom MCP server.",
    bullets: [
      "Architected a <strong>Kotlin/Spring Boot</strong> data aggregation service for a mission-critical autonomous haulage system, processing real-time telemetry from an active mining fleet valued at <strong>$100K+/hour</strong>.",
      "Built an AI-augmented developer toolkit with a custom <strong>MCP server</strong>, cutting API verification time by <strong>50%</strong> and accelerating feature delivery by <strong>2x</strong>.",
      "Slashed developer onboarding time by <strong>75%</strong> and established an <strong>Azure CI/CD pipeline</strong> that unblocked cross-team delivery.",
      "Designed a Docker-based release pipeline achieving <strong>10x</strong> deployment velocity improvement.",
    ],
  },
];

export const GAME_URL = "https://game.parthjpatel.me";
