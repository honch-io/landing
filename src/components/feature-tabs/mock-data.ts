import {
  Coffee,
  House,
  Storefront,
  Trash,
  type Icon,
} from "@phosphor-icons/react"
import { VIZ, type LineSeries } from "./shared"

/* All numbers are internally consistent (e.g. 12,643 active devices is also the
   top of the activation funnel) and themed to the existing espresso-machine
   story: model X1 / S2, firmware v2.4.1, events like brew_started. */

/* ---- Tab 1 · Fleet analytics ---- */

export const fleetMetrics: {
  label: string
  value: string
  delta?: string
  spark?: number[]
  down?: boolean
}[] = [
  {
    label: "Active devices",
    value: "12,643",
    delta: "+4.2%",
    spark: [8, 8.4, 8.9, 9.3, 9.6, 10.4, 11.2, 11.8, 12.3, 12.6],
  },
  {
    label: "Sessions today",
    value: "38,920",
    delta: "+2.1%",
    spark: [30, 31, 33, 32, 35, 34, 37, 38, 38.9],
  },
  {
    label: "Events / min",
    value: "1,284",
    delta: "+8.0%",
    spark: [0.9, 1.0, 0.95, 1.12, 1.05, 1.18, 1.2, 1.26, 1.28],
  },
  {
    label: "Crash-free",
    value: "99.6%",
    delta: "+0.3%",
    spark: [99.1, 99.2, 99.0, 99.3, 99.4, 99.5, 99.5, 99.6],
  },
]

/** Retention by firmware — newest (accent) holds users far better than the rest. */
export const fleetRetention: { xLabels: string[]; series: LineSeries[] } = {
  xLabels: ["Day 1", "Day 7", "Day 14", "Day 30", "Day 60", "Day 90"],
  series: [
    { name: "v2.4.1", values: [100, 84, 73, 64, 58, 54], color: VIZ.blue },
    { name: "v2.3.0", values: [100, 76, 61, 49, 41, 36], color: VIZ.green },
    { name: "v2.2.0", values: [100, 69, 52, 39, 30, 24], color: VIZ.orange },
  ],
}

/* ---- Tab 2 · Cohorts & funnels ---- */

export const funnelSteps: { label: string; pct: number; users: string }[] = [
  { label: "Powered on", pct: 100, users: "12,643" },
  { label: "First brew", pct: 76.3, users: "9,642" },
  { label: "5th brew", pct: 41.3, users: "5,221" },
  { label: "Daily habit", pct: 18.8, users: "2,382" },
]

export const cohorts: {
  name: string
  description: string
  users: string
  createdBy: string
  lastCalculated: string
}[] = [
  {
    name: "Daily brewers",
    description: "5+ brews/day, last 14 days",
    users: "4,182",
    createdBy: "System",
    lastCalculated: "6m ago",
  },
  {
    name: "Eco-mode users",
    description: "Enabled power-saving",
    users: "1,536",
    createdBy: "System",
    lastCalculated: "6m ago",
  },
  {
    name: "Espresso drinkers",
    description: "Espresso as default drink",
    users: "312",
    createdBy: "System",
    lastCalculated: "8m ago",
  },
  {
    name: "Churn risk",
    description: "No brew in 14 days",
    users: "884",
    createdBy: "System",
    lastCalculated: "6m ago",
  },
]

/* ---- Tab 3 · Insights from users ----
   The Insights tab plays a self-driving loop: a question is "typed" into a
   prompt bar, the matching chart generates, and an insight is surfaced. Each
   query below pairs a question with its viz data + the generated insight.
   Numbers stay consistent with the rest of the espresso-machine story (eco at
   12% adoption, churn around the day-14 descale alert, 38,920 sessions). */

/** Eco-mode discovery funnel — owners drop off before they ever find it. */
export const ecoFunnel: { label: string; count: number }[] = [
  { label: "Opened settings", count: 4820 },
  { label: "Reached power menu", count: 1977 },
  { label: "Found Eco mode", count: 916 },
  { label: "Enabled it", count: 578 },
]

/** Retention curve — a churn cliff opens up right after day 14. */
export const churnRetention: { xLabels: string[]; series: LineSeries[] } = {
  xLabels: ["Day 1", "Day 7", "Day 14", "Day 21", "Day 30", "Day 45"],
  series: [
    {
      name: "Owners still brewing",
      values: [100, 91, 79, 52, 44, 41],
      color: "var(--tab-accent)",
    },
  ],
}

/** Share of all brews by drink — ranked high → low (sums to 100). */
export const coffeeTypes: { label: string; pct: number }[] = [
  { label: "Latte", pct: 38 },
  { label: "Espresso", pct: 22 },
  { label: "Cappuccino", pct: 16 },
  { label: "Americano", pct: 14 },
  { label: "Cold brew", pct: 10 },
]

/** Behavioural personas — the four kinds of coffee drinker (sums to 100). */
export const drinkerSegments: { label: string; pct: number; color: string }[] = [
  { label: "Daily ritualists", pct: 41, color: VIZ.orange },
  { label: "Weekend brewers", pct: 27, color: VIZ.blue },
  { label: "Espresso purists", pct: 19, color: VIZ.green },
  { label: "Tinkerers", pct: 13, color: VIZ.gray },
]

export type InsightQueryId = "eco" | "churn" | "popular" | "drinkers"

/** Source of truth for the typing loop: question → status copy → result card. */
export const insightQueries: {
  id: InsightQueryId
  question: string
  analyzing: string
  vizTitle: string
  vizWindow: string
  insight: string
}[] = [
  {
    id: "eco",
    question: "Why aren't users pressing the eco button?",
    analyzing: "4,820 settings sessions",
    vizTitle: "Eco mode discovery",
    vizWindow: "Last 30 days",
    insight:
      "Eco mode is buried 3 menus deep — 88% never reach it. Surfacing it on the home screen projects +18% adoption.",
  },
  {
    id: "churn",
    question: "When do people churn?",
    analyzing: "12,643 device timelines",
    vizTitle: "Retention by day",
    vizWindow: "First 45 days",
    insight:
      "Most churn hits around day 14 — exactly when the first descale alert fires. Owners quit instead of cleaning.",
  },
  {
    id: "popular",
    question: "What's the most popular coffee type?",
    analyzing: "38,920 sessions",
    vizTitle: "Brews by drink",
    vizWindow: "Last 7 days",
    insight:
      "Lattes are 38% of all brews — nearly 2× espresso. Milk-frother reliability drives satisfaction most.",
  },
  {
    id: "drinkers",
    question: "What are the different types of coffee drinkers?",
    analyzing: "12,643 owners",
    vizTitle: "Drinker personas",
    vizWindow: "All time",
    insight:
      "Four clear personas. 'Daily ritualists' are 41% of users and 2.3× likelier to buy a bean subscription.",
  },
]

/* ---- Tab 4 · Device lifecycle ----
   One physical device (serial CM-X1-0473) followed cradle-to-grave across every
   owner and environment it passes through. The tab cross-fades a scene per stage
   on the left while a timeline advances in lock-step on the right — the serial
   never changes, which is the whole point: checkout attribution lets you track
   the same unit from the store, through resale, to retirement. */

export const lifecycleDevice = { id: "CM-X1-0473", model: "X1" } as const

export const lifecycleJourney: {
  /** Timeline marker + scene icon. */
  icon: Icon
  /** Full-bleed scene for this stage (public/). */
  img: string
  /** Short timeline label. */
  stage: string
  /** Who has the unit now. */
  owner: string
  /** Where it lives now. */
  env: string
  /** Expanded detail — usage so far. */
  metric: string
  /** Expanded detail — time held. */
  duration: string
  /** Final stage → device is offline (gray status). */
  retired?: boolean
}[] = [
  {
    icon: Storefront,
    img: "/lifecycle-1-store.jpg",
    stage: "In store",
    owner: "Retail floor",
    env: "Retail",
    metric: "Registered at checkout",
    duration: "Awaiting first power-on",
  },
  {
    icon: Coffee,
    img: "/lifecycle-2-cafe.jpg",
    stage: "Coffee shop",
    owner: "Brew & Co.",
    env: "Commercial",
    metric: "1,284 brews logged",
    duration: "Owned 14 months",
  },
  {
    icon: House,
    img: "/lifecycle-3-home-a.jpg",
    stage: "Home — Maria R.",
    owner: "Maria R.",
    env: "Residential",
    metric: "First resale · 412 brews",
    duration: "Owned 9 months",
  },
  {
    icon: House,
    img: "/lifecycle-4-home-b.jpg",
    stage: "Home — James T.",
    owner: "James T.",
    env: "Residential",
    metric: "Second resale · 188 brews",
    duration: "Owned 7 months",
  },
  {
    icon: Trash,
    img: "/lifecycle-5-retired.jpg",
    stage: "Retired",
    owner: "Decommissioned",
    env: "—",
    metric: "3.1 yr total lifespan",
    duration: "Device offline",
    retired: true,
  },
]
