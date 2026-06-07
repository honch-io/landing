"use client"

import { motion, useReducedMotion } from "motion/react"

/* -------------------------------------------------------------------------- */
/*  Compact result visuals for the Insights tab.                               */
/*                                                                            */
/*  Each chart fills its flex box, animates in on mount (the parent keys these */
/*  by question index, so a fresh chart "generates" every cycle), and snaps    */
/*  to its end state under reduced motion. They consume --tab-accent so the    */
/*  Insights tab reads as one themed section. The churn question reuses the     */
/*  shared LineChart directly, so there's no line chart here.                   */
/* -------------------------------------------------------------------------- */

const nf = new Intl.NumberFormat("en-US")

/** Standard reveal easing — matches platform-ui/Funnel. */
const EASE = [0.22, 1, 0.36, 1] as const

const accent = "var(--tab-accent)"
const accentSoft = "color-mix(in srgb, var(--tab-accent) 28%, var(--card))"

/* -------------------------------------------------------------------------- */
/*  Skeleton — shown while the question types + "analyzes". Mirrors the result  */
/*  layout (a chart block + two insight lines) so the card height never jumps.  */
/*                                                                            */
/*  The "generating" feel is two layers: the bars assemble once (staggered     */
/*  bottom-origin rise), then a soft accent highlight sweeps across on a slow   */
/*  loop — reads as scanning/computing, not a generic opacity throb. Both are    */
/*  transform/opacity only and fully removed under reduced motion.              */
/* -------------------------------------------------------------------------- */

const skeletonBase = "color-mix(in srgb, var(--tab-accent) 11%, var(--card))"

export function InsightSkeleton({ active = true }: { active?: boolean }) {
  const reduced = useReducedMotion()
  // Only the "loading" state — after the prompt is actually sent — assembles and
  // scans. Before the press the card holds a dimmed, static placeholder: the work
  // visibly begins on submit, not while the question is still being typed.
  const animateIn = !reduced && active
  const heights = [42, 70, 54, 88, 64]
  return (
    <div
      className="relative flex h-full flex-col gap-3 overflow-hidden"
      style={{ opacity: active ? 1 : 0.4 }}
    >
      {/* Bars assemble from the bottom */}
      <div className="flex min-h-0 flex-1 items-end gap-2.5">
        {heights.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-md"
            style={{ height: `${h}%`, background: skeletonBase, transformOrigin: "bottom" }}
            initial={animateIn ? { scaleY: 0.78, opacity: 0 } : false}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={
              animateIn ? { duration: 0.45, delay: i * 0.06, ease: EASE } : { duration: 0 }
            }
          />
        ))}
      </div>

      {/* Insight placeholder lines */}
      <motion.div
        className="shrink-0 space-y-1.5"
        initial={animateIn ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={animateIn ? { duration: 0.4, delay: 0.3 } : { duration: 0 }}
      >
        <div className="h-2.5 w-full rounded-full" style={{ background: skeletonBase }} />
        <div className="h-2.5 w-2/3 rounded-full" style={{ background: skeletonBase }} />
      </motion.div>

      {/* Slow highlight sweep — the "scanning / generating" signal (loading only) */}
      {animateIn && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, transparent 38%, color-mix(in srgb, var(--tab-accent) 16%, transparent) 50%, transparent 62%)",
          }}
          initial={{ x: "-135%" }}
          animate={{ x: "135%" }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 0.5,
          }}
        />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Discovery funnel — vertical bars, bottom-origin, staggered grow-up.        */
/* -------------------------------------------------------------------------- */

export function DiscoveryFunnel({
  steps,
}: {
  steps: { label: string; count: number }[]
}) {
  const reduced = useReducedMotion()
  const top = steps[0]?.count ?? 1
  return (
    <div className="flex h-full flex-col gap-2">
      {/* Step labels */}
      <div className="flex shrink-0 gap-2">
        {steps.map((s) => (
          <span
            key={s.label}
            className="flex-1 truncate text-center font-medium text-[11px] text-foreground"
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* Bars */}
      <div className="flex min-h-0 flex-1 items-end gap-2">
        {steps.map((s, i) => (
          <div key={s.label} className="relative h-full flex-1">
            <div className="absolute inset-0 rounded-t-md bg-muted/50" />
            <motion.div
              className="absolute inset-x-0 bottom-0 rounded-t-md"
              style={{
                height: `${(s.count / top) * 100}%`,
                background: accent,
                transformOrigin: "bottom",
              }}
              initial={{ scaleY: reduced ? 1 : 0 }}
              animate={{ scaleY: 1 }}
              transition={
                reduced ? { duration: 0 } : { duration: 0.5, delay: i * 0.08, ease: EASE }
              }
            />
          </div>
        ))}
      </div>

      {/* Counts + conversion */}
      <div className="flex shrink-0 gap-2">
        {steps.map((s, i) => {
          const pctTop = Math.round((s.count / top) * 100)
          return (
            <motion.div
              key={s.label}
              className="flex flex-1 flex-col items-center gap-0.5 text-center"
              initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduced ? { duration: 0 } : { duration: 0.4, delay: 0.25 + i * 0.08 }
              }
            >
              <span className="font-bold text-foreground text-xs tabular-nums">
                {nf.format(s.count)}
              </span>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {pctTop}%
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Ranked bars — horizontal, grow-from-left, top bar emphasised.              */
/* -------------------------------------------------------------------------- */

export function RankedBars({
  items,
}: {
  items: { label: string; pct: number }[]
}) {
  const reduced = useReducedMotion()
  const max = Math.max(...items.map((i) => i.pct), 1)
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      {items.map((it, i) => (
        <div key={it.label} className="flex items-center gap-3">
          <span className="w-20 shrink-0 truncate font-medium text-foreground text-xs">
            {it.label}
          </span>
          <div className="relative h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${(it.pct / max) * 100}%`,
                background: i === 0 ? accent : accentSoft,
                transformOrigin: "left",
              }}
              initial={{ scaleX: reduced ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={
                reduced ? { duration: 0 } : { duration: 0.5, delay: i * 0.07, ease: EASE }
              }
            />
          </div>
          <span className="w-9 shrink-0 text-right font-semibold text-foreground text-xs tabular-nums">
            {it.pct}%
          </span>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Segment bar — one stacked proportion bar + a two-column legend.            */
/* -------------------------------------------------------------------------- */

export function SegmentBar({
  segments,
}: {
  segments: { label: string; pct: number; color: string }[]
}) {
  const reduced = useReducedMotion()
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <motion.div
        className="flex h-3.5 w-full gap-0.5 overflow-hidden rounded-full"
        style={{ transformOrigin: "left" }}
        initial={{ scaleX: reduced ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE }}
      >
        {segments.map((s) => (
          <span
            key={s.label}
            style={{ flexBasis: `${s.pct}%`, background: s.color }}
          />
        ))}
      </motion.div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
        {segments.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex items-center gap-2 text-xs"
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.35, delay: 0.2 + i * 0.06 }
            }
          >
            <span
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ background: s.color }}
            />
            <span className="truncate font-medium text-foreground">{s.label}</span>
            <span className="ml-auto font-semibold text-muted-foreground tabular-nums">
              {s.pct}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
