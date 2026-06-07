import {
  ChartLineUp,
  FunnelSimple,
  Lightbulb,
  Recycle,
  type Icon,
} from "@phosphor-icons/react"
import { TOKENS } from "./shared"

export type TabId = "fleet" | "cohorts" | "insights" | "lifecycle"

export interface TabDef {
  id: TabId
  /** Short label shown in the tab bar. */
  label: string
  /** Dominant headline inside the panel. */
  headline: string
  /** One-line value prop under the headline. */
  subhead: string
  /** Accent hex — drives the active tab, panel border, and in-panel accents.
   *  Each tab takes a distinct design-token colour (TOKENS); multi-series
   *  chart colours still come from the VIZ palette. */
  accent: string
  icon: Icon
}

export const TABS: TabDef[] = [
  {
    id: "cohorts",
    label: "Understand product usage",
    headline: "See how it's really used",
    subhead:
      "Build cohorts, trace funnels, and replay sessions to find exactly where users stick — and where they drop off.",
    accent: TOKENS.success,
    icon: FunnelSimple,
  },
  {
    id: "fleet",
    label: "Fleetwide analytics",
    headline: "Understand your entire fleet",
    subhead:
      "Engagement, retention, and feature adoption for every unit you've shipped — sliced by model, firmware, or region.",
    accent: TOKENS.primary,
    icon: ChartLineUp,
  },
  {
    id: "insights",
    label: "Insights from users",
    headline: "Never guess what to build next",
    subhead:
      "Honch surfaces how your hardware actually gets used, so your next version is the one customers were already asking for.",
    accent: TOKENS.warning,
    icon: Lightbulb,
  },
  {
    id: "lifecycle",
    label: "Track device lifecycle",
    headline: "Track every device, cradle to grave",
    subhead:
      "Follow each unit from checkout to daily use to resale to retirement — the whole life of your hardware on one timeline.",
    accent: TOKENS.danger,
    icon: Recycle,
  },
]
