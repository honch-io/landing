/* -------------------------------------------------------------------------- */
/*  Deterministic time helpers for the vendored platform UI.                   */
/*                                                                             */
/*  The real platform formats timestamps with date-fns / date-fns-tz against   */
/*  the live clock. On a server-rendered landing page that would (a) add deps  */
/*  and (b) drift between server and client render → hydration mismatch.       */
/*  Instead we anchor everything to a FIXED `NOW` constant and format in UTC   */
/*  with a fixed locale, so server and client always agree.                    */
/* -------------------------------------------------------------------------- */

/** Fixed "current time" the whole demo is relative to. Parsed from a literal */
/** so it never reads the runtime clock (keeps SSR + hydration deterministic). */
export const NOW = Date.parse("2026-06-02T20:05:00Z")

/** ISO string for `seconds` before NOW — used to seed mock timestamps. */
export function isoAgo(seconds: number): string {
  return new Date(NOW - seconds * 1000).toISOString()
}

/** ISO string for the anchored NOW — used when a streamed row "just arrived". */
export function isoNow(): string {
  return new Date(NOW).toISOString()
}

/** Compact "x ago" relative time, anchored to NOW. Replaces date-fns. */
export function relativeTime(iso: string): string {
  const diffMs = NOW - Date.parse(iso)
  const s = Math.max(0, Math.floor(diffMs / 1000))
  if (s < 5) return "just now"
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  const w = Math.floor(d / 7)
  if (d < 30) return `${w}w ago`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(mo / 12)}y ago`
}

const absoluteFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
})

/** Absolute timestamp, e.g. "Jun 2, 2026, 8:05:00 PM UTC". Replaces date-fns-tz. */
export function formatAbsolute(iso: string): string {
  return `${absoluteFmt.format(new Date(iso))} UTC`
}

/** "6m 12s" / "1m 4s" / "48s" — mirrors the platform's session formatDuration. */
export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}
