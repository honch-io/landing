import {
  ClockCountdown,
  DeviceMobile,
  FunnelSimple,
  type Icon,
  Pulse,
} from "@phosphor-icons/react"
import { TOKENS } from "@/components/feature-tabs/shared"

export type WalkthroughId = "events" | "cohorts" | "sessions" | "devices"

export interface WalkthroughDef {
  id: WalkthroughId
  eyebrow: string
  heading: string
  subtitles: string[]
  /** Which side the real-UI panel sits on at lg+ (alternates down the page). */
  side: "left" | "right"
  /** Accent token, exposed to the section as --wt-accent. */
  accent: string
  icon: Icon
}

export const WALKTHROUGH: WalkthroughDef[] = [
  {
    id: "events",
    eyebrow: "Live events",
    heading: "Watch your fleet think, in real time",
    subtitles: [
      "Every button press, mode switch, and error streams in from the field the moment it happens.",
      "No warehouse, no nightly batch — events land in seconds, straight from firmware.",
    ],
    side: "left",
    accent: TOKENS.primary,
    icon: Pulse,
  },
  {
    id: "cohorts",
    eyebrow: "Cohorts & funnels",
    heading: "See where users stick — and where they drop",
    subtitles: [
      "Group devices by model, firmware, or behavior, then trace the path from unboxing to daily habit.",
      "Spot the step that loses people, and the feature that keeps them coming back.",
    ],
    side: "right",
    accent: TOKENS.success,
    icon: FunnelSimple,
  },
  {
    id: "sessions",
    eyebrow: "Sessions",
    heading: "Sessions that understand hardware",
    subtitles: [
      "Honch stitches power cycles, sleep, and reconnects into real usage sessions — not web pageviews.",
      "Follow a single unit through one sitting, from wake to idle to shutdown.",
    ],
    side: "left",
    accent: TOKENS.warning,
    icon: ClockCountdown,
  },
  {
    id: "devices",
    eyebrow: "Per-device analytics",
    heading: "Drill down to a single serial number",
    subtitles: [
      "Open any device to see its firmware, environment, and health at a glance.",
      "Reproduce the field issue your support team is staring at — without a debugger on a bench.",
    ],
    side: "right",
    accent: TOKENS.danger,
    icon: DeviceMobile,
  },
]
