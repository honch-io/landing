// Single source of truth for the pricing page.
//
// Everything tunable lives here — base fees, allotments, the graduated
// per-event rate card, the feature-comparison matrix, and the FAQ — so prices
// and limits are trivial to edit later without touching layout code.
//
// All numbers are placeholders intended to be easy to change.

export type PlanId = "developer" | "team" | "business" | "enterprise";

/** A cell in the comparison matrix: a checkmark, a dash, or per-cell text. */
export type Cell = boolean | string;

export interface Plan {
  id: PlanId;
  name: string;
  /** One-line positioning shown under the plan name on the tier card. */
  tagline: string;
  /** Monthly base fee in USD. `null` means custom / contact sales. */
  monthlyPrice: number | null;
  /** Allotments surfaced on the tier card and in the comparison header. */
  includedEvents: string;
  overage: string;
  retention: string;
  seats: string;
  projects: string;
  dashboards: string;
  cta: { label: string; href: string };
  mostPopular?: boolean;
}

// Annual billing gives "2 months free" — pay for 10 months, get 12.
export const ANNUAL_MONTHS_PAID = 10;

/** Effective per-month price when billed annually (Developer stays free). */
export function annualMonthly(monthlyPrice: number): number {
  return Math.round((monthlyPrice * ANNUAL_MONTHS_PAID) / 12);
}

export const PLANS: Plan[] = [
  {
    id: "developer",
    name: "Developer",
    tagline: "Wire up the SDK and explore your first device data.",
    monthlyPrice: 0,
    includedEvents: "1M / mo",
    overage: "Upgrade to exceed",
    retention: "30 days",
    seats: "2",
    projects: "1",
    dashboards: "1",
    cta: { label: "Start free", href: "https://app.honch.io/register" },
  },
  {
    id: "team",
    name: "Team",
    tagline: "For a hardware team shipping its first connected product.",
    monthlyPrice: 99,
    includedEvents: "10M / mo",
    overage: "Graduated curve",
    retention: "90 days",
    seats: "10",
    projects: "3",
    dashboards: "10",
    cta: { label: "Start trial", href: "https://app.honch.io/register?plan=team" },
  },
  {
    id: "business",
    name: "Business",
    tagline: "For a fleet in the field across multiple SKUs and revisions.",
    monthlyPrice: 499,
    includedEvents: "50M / mo",
    overage: "Discounted curve",
    retention: "180 days",
    seats: "Unlimited",
    projects: "Unlimited",
    dashboards: "Unlimited",
    cta: { label: "Start trial", href: "https://app.honch.io/register?plan=business" },
    mostPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Committed volume, residency, and security for global fleets.",
    monthlyPrice: null,
    includedEvents: "250M+ negotiated",
    overage: "Committed volume",
    retention: "1 yr+ / custom",
    seats: "Unlimited + SCIM",
    projects: "Unlimited",
    dashboards: "Unlimited",
    cta: { label: "Contact sales", href: "https://cal.com/honch/30min" },
  },
];

export const PLAN_ORDER: PlanId[] = ["developer", "team", "business", "enterprise"];

// ---------------------------------------------------------------------------
// Graduated per-event pricing (display copy for the usage section).
// The live estimator in PricingCalculator.tsx carries the matching numeric
// bands; keep the two in sync if you re-tune the curve.
// ---------------------------------------------------------------------------

export interface RateRow {
  range: string;
  rate: string;
}

export const RATE_TABLE: RateRow[] = [
  { range: "First 1,000", rate: "Free" },
  { range: "1K – 2M", rate: "$0.0000300" },
  { range: "2M – 15M", rate: "$0.0000206" },
  { range: "15M – 50M", rate: "$0.0000177" },
  { range: "50M – 100M", rate: "$0.0000131" },
  { range: "100M – 250M", rate: "$0.0000090" },
  { range: "250M+", rate: "$0.0000054" },
];

// ---------------------------------------------------------------------------
// Feature-comparison matrix.
// ---------------------------------------------------------------------------

export interface FeatureRow {
  label: string;
  /** One-line explanation surfaced via an info tooltip. */
  tooltip?: string;
  /** Roadmap items get a "Coming soon" badge. */
  comingSoon?: boolean;
  values: Record<PlanId, Cell>;
}

export interface FeatureSection {
  title: string;
  /** Optional lead-in shown under the section subheader. */
  note?: string;
  rows: FeatureRow[];
}

// Volume rows are derived from PLANS so the comparison header can never drift
// from the tier cards.
const planValue = (pick: (p: Plan) => string): Record<PlanId, Cell> =>
  Object.fromEntries(PLANS.map((p) => [p.id, pick(p)])) as Record<PlanId, Cell>;

export const FEATURE_SECTIONS: FeatureSection[] = [
  {
    title: "Volume & limits",
    rows: [
      { label: "Included events / mo", values: planValue((p) => p.includedEvents) },
      {
        label: "Overage pricing",
        tooltip:
          "Paid plans bill events beyond your allotment on a graduated curve — the rate drops as volume grows. Developer is a hard cap.",
        values: planValue((p) => p.overage),
      },
      {
        label: "Data retention",
        tooltip:
          "How long raw events stay queryable. Trends and saved insights persist regardless; retention governs ad-hoc exploration over historical data.",
        values: planValue((p) => p.retention),
      },
      { label: "Seats", values: planValue((p) => p.seats) },
      { label: "Projects", values: planValue((p) => p.projects) },
      { label: "Dashboards", values: planValue((p) => p.dashboards) },
    ],
  },
  {
    title: "Analytics",
    note: "Every plan includes the full hardware analytics suite. You scale on volume, not on unlocking features.",
    rows: [
      {
        label: "Events, devices, persons, sessions, lexicon",
        values: { developer: true, team: true, business: true, enterprise: true },
      },
      {
        label: "Trends",
        values: { developer: true, team: true, business: true, enterprise: true },
      },
      {
        label: "Funnels, Retention, Lifecycle, Stickiness",
        tooltip:
          "Funnels by firmware version, retention by hardware revision, lifecycle across a device's lifetime — the analyses hardware teams actually need.",
        values: {
          developer: "Trends only",
          team: true,
          business: true,
          enterprise: true,
        },
      },
      {
        label: "Cohorts",
        values: { developer: "1", team: true, business: true, enterprise: true },
      },
      {
        label: "Property breakdowns / segmentation",
        values: { developer: false, team: true, business: true, enterprise: true },
      },
      {
        label: "Saved views & shared dashboards",
        values: { developer: false, team: true, business: true, enterprise: true },
      },
    ],
  },
  {
    title: "Collaboration & governance",
    rows: [
      {
        label: "Role-based access control",
        values: {
          developer: "Owner / member",
          team: "Default roles",
          business: "Custom roles",
          enterprise: "Custom roles",
        },
      },
      {
        label: "Audit / activity log",
        values: {
          developer: false,
          team: "7-day",
          business: "Full",
          enterprise: "Full + export",
        },
      },
    ],
  },
  {
    title: "Integrations & access",
    rows: [
      {
        label: "API keys + MCP (AI) access",
        tooltip:
          "Query your hardware analytics from agents and assistants over the Model Context Protocol. Limits scale with your plan.",
        values: {
          developer: "Rate-limited",
          team: true,
          business: "Higher limits",
          enterprise: "Dedicated",
        },
      },
      {
        label: "Alerts / Webhooks",
        comingSoon: true,
        values: { developer: false, team: "Basic", business: true, enterprise: true },
      },
      {
        label: "Batch export to S3 / GCS",
        comingSoon: true,
        values: { developer: false, team: false, business: true, enterprise: true },
      },
      {
        label: "SSO / SAML / SCIM",
        comingSoon: true,
        values: {
          developer: false,
          team: false,
          business: "SSO",
          enterprise: "SAML + SCIM",
        },
      },
    ],
  },
  {
    title: "Support",
    rows: [
      {
        label: "Support",
        values: {
          developer: "Community",
          team: "Email",
          business: "Priority",
          enterprise: "Dedicated + SLA",
        },
      },
      {
        label: "Region / residency, custom DPA, on-prem",
        tooltip:
          "Data residency by region, a negotiated DPA, and self-hosted / on-prem deployment for regulated fleets.",
        values: { developer: false, team: false, business: false, enterprise: true },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "What counts as an event?",
    answer:
      "An event is a single thing a device or person does that you send to Honch — a button press, a mode change, a session start, a sync, a firmware update, a crash. You instrument what matters for your product; we count each one once it reaches us.",
  },
  {
    question: "Do errors and crashes cost extra?",
    answer:
      "No. There is no separate “errors” SKU. Honch is product analytics, not error tracking — a crash or error is just another event on the same meter. You will never get a surprise line item for the things going wrong in the field.",
  },
  {
    question: "What happens when I hit my included limit?",
    answer:
      "On paid plans, events beyond your monthly allotment bill on a graduated curve where the per-event rate drops as volume grows — nothing breaks, and you keep collecting. The Developer plan is a hard cap: ingestion pauses for the rest of the month, and you upgrade to keep going.",
  },
  {
    question: "Can I change plans at any time?",
    answer:
      "Yes. Upgrade or downgrade whenever you like. Upgrades take effect immediately; downgrades apply at the start of your next billing cycle so you keep what you are paying for.",
  },
  {
    question: "How does data retention work?",
    answer:
      "Retention sets how long raw events stay queryable for ad-hoc exploration — 30 days on Developer up to a year or more on Enterprise. Saved insights, trends, and dashboards persist beyond the raw-data window; retention only governs how far back you can run fresh queries.",
  },
  {
    question: "Is there an annual billing discount?",
    answer:
      "Yes. Switch any paid plan to annual billing and you pay for ten months instead of twelve — effectively two months free. Usage-based overage is still metered monthly at your plan's curve.",
  },
  {
    question: "Do you offer enterprise or volume discounts?",
    answer:
      "Yes. Above roughly 250M events a month we move to committed-volume pricing with a discounted curve, plus residency, SSO/SAML/SCIM, a custom DPA, and on-prem options. Talk to sales and we'll size it to your fleet.",
  },
];
