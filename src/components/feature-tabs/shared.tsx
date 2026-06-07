"use client"

import type { ComponentProps, ReactNode } from "react"
import { CaretDown, CaretUp } from "@phosphor-icons/react"
import { motion, type Variants } from "motion/react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Data-viz palette — matches the product UI guide / dashboard reference:     */
/*  blue is the primary data colour, green + orange are supporting series,     */
/*  gray is a baseline, and KPI sparklines are near-black. Every chart pulls    */
/*  from here so the four tabs read as ONE product, not four themed widgets.   */
/* -------------------------------------------------------------------------- */

export const VIZ = {
  blue: "#2563eb",
  green: "#22c55e",
  orange: "#e95a24",
  gray: "#cbd5e1",
  ink: "var(--foreground)",
} as const

/**
 * Design-token accent colours (UI guide §1.1 Colors, ~600 shade). Each tab
 * claims one so the four panels read as distinct sections of one system —
 * Primary / Success / Warning / Danger, cool → warm down the tab bar.
 */
export const TOKENS = {
  primary: "#2563eb", // Primary 600 — blue
  success: "#16a34a", // Success 600 — green
  warning: "#ea580c", // Warning 600 — orange
  danger: "#dc2626", // Danger 600 — red
} as const

/* -------------------------------------------------------------------------- */
/*  Motion variants for in-panel content (stagger + rise).                    */
/*  The panel itself is animated with explicit objects in FeatureTabs — NOT   */
/*  variant labels — so its exit never propagates to these children (which    */
/*  would deadlock AnimatePresence mode="wait"). These groups self-drive on    */
/*  mount. Reduced motion is handled globally by <MotionConfig                 */
/*  reducedMotion="user"> in FeatureTabs.                                      */
/* -------------------------------------------------------------------------- */

const staggerGroup: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
}

const riseItem: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.1, duration: 0.45 },
  },
}

/** A self-driving stagger container — its children (Reveal) cascade in on mount. */
export function RevealGroup({
  className,
  children,
  ...rest
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      variants={staggerGroup}
      initial="initial"
      animate="animate"
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** A single staggered child. Rises + fades in; inherits timing from RevealGroup. */
export function Reveal({
  className,
  children,
  ...rest
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div variants={riseItem} className={className} {...rest}>
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Mock product primitives — faithful rebuilds of the platform's StatCard /   */
/*  SummaryItem and the in-kit Metric/KPI card, so the landing visuals read    */
/*  like the shipped product (no cross-repo imports).                          */
/* -------------------------------------------------------------------------- */

/** Plain stat — label over a big value, with optional sub. */
export function MockStatCard({
  label,
  value,
  sub,
  subAccent = false,
}: {
  label: string
  value: ReactNode
  sub?: string
  subAccent?: boolean
}) {
  return (
    <Card className="p-5">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="mt-2 truncate font-bold text-3xl text-foreground tabular-nums">
        {value}
      </span>
      {sub && (
        <span
          className={cn(
            "mt-1 text-xs",
            subAccent
              ? "font-medium text-[var(--tab-accent)]"
              : "text-muted-foreground",
          )}
        >
          {sub}
        </span>
      )}
    </Card>
  )
}

/** Mirrors platform `components/ui/summary-item.tsx`. */
export function MockSummaryItem({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="min-w-0 text-foreground text-sm">{children}</div>
    </div>
  )
}

/**
 * Metric / KPI card — the kit's signature tile: label, big value, then a
 * footer pairing a trend pill with an inline sparkline. `delta` like "+4.2%";
 * a leading "−"/"-" flips the arrow direction, and `down` recolours it red.
 */
export function MetricCard({
  label,
  value,
  delta,
  spark,
  down = false,
}: {
  label: string
  value: string
  delta?: string
  spark?: number[]
  down?: boolean
}) {
  const isUp = !/^[−-]/.test(delta?.trim() ?? "")
  return (
    <Card className="p-4">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="mt-1 font-bold text-2xl text-foreground tabular-nums">
        {value}
      </span>
      <div className="mt-2.5 flex items-end justify-between gap-2">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium text-xs tabular-nums",
              down ? "text-red-600" : "text-emerald-600",
            )}
          >
            {isUp ? (
              <CaretUp className="size-3" weight="bold" />
            ) : (
              <CaretDown className="size-3" weight="bold" />
            )}
            {delta}
          </span>
        )}
        {spark && (
          <Sparkline
            values={spark}
            className="h-6 w-16 shrink-0"
            stroke={VIZ.ink}
          />
        )}
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*  SVG chart primitives — accent-aware (consume --tab-accent from FeatureTabs)*/
/* -------------------------------------------------------------------------- */

/** A tiny inline trend line, optional soft area fill. Scales to its box. */
export function Sparkline({
  values,
  stroke = "var(--tab-accent)",
  area = false,
  className,
}: {
  values: number[]
  stroke?: string
  area?: boolean
  className?: string
}) {
  const W = 72
  const H = 26
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W
    const y = H - 2 - ((v - min) / range) * (H - 4)
    return [x, y] as const
  })
  const line = pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ")
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox={`0 0 ${W} ${H}`}
    >
      {area && (
        <path
          d={`${line} L${W} ${H} L0 ${H} Z`}
          fill={stroke}
          opacity={0.12}
          stroke="none"
        />
      )}
      <path
        d={line}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export interface LineSeries {
  name: string
  /** Values on a 0–100 scale. */
  values: number[]
  /** Any CSS colour. */
  color: string
}

/**
 * Multi-series line chart that FILLS its flex container's height — the SVG uses
 * a 0–100 viewBox with `preserveAspectRatio="none"` and non-scaling strokes, so
 * it stretches to any box without distorting line weight. Axis labels are HTML
 * (so they never stretch), and the first series gets an emphasised endpoint dot.
 * Mirrors the kit's "Line Chart" tile.
 */
export function LineChart({
  series,
  xLabels,
  className,
}: {
  series: LineSeries[]
  xLabels: string[]
  className?: string
}) {
  const grid = [100, 75, 50, 25, 0]

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Legend */}
      <div className="mb-3 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1.5">
        {series.map((s) => (
          <span
            className="inline-flex items-center gap-1.5 text-muted-foreground text-xs"
            key={s.name}
          >
            <span
              className="size-2.5 rounded-[3px]"
              style={{ background: s.color }}
            />
            <span className="font-medium text-foreground">{s.name}</span>
          </span>
        ))}
      </div>

      {/* Plot */}
      <div className="flex min-h-0 flex-1 gap-2">
        <div className="flex flex-col justify-between py-px text-[10px] text-muted-foreground tabular-nums">
          {grid.map((g) => (
            <span key={g}>{g}%</span>
          ))}
        </div>

        <div className="relative min-h-0 flex-1">
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {grid.map((g) => (
              <line
                key={g}
                stroke="var(--border)"
                strokeDasharray={g === 0 ? undefined : "2 3"}
                vectorEffect="non-scaling-stroke"
                x1={0}
                x2={100}
                y1={100 - g}
                y2={100 - g}
              />
            ))}
            {series.map((s) => {
              const n = s.values.length
              const d = s.values
                .map(
                  (v, i) =>
                    `${i ? "L" : "M"}${((i / (n - 1)) * 100).toFixed(2)} ${(100 - v).toFixed(2)}`,
                )
                .join(" ")
              return (
                <path
                  d={d}
                  fill="none"
                  key={s.name}
                  stroke={s.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </svg>

          {/* Round data-point dots (HTML so they stay circular) */}
          {series.map((s) => {
            const n = s.values.length
            return s.values.map((v, i) => (
              <span
                className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-card"
                key={`${s.name}-${i}`}
                style={{
                  left: `${(i / (n - 1)) * 100}%`,
                  top: `${100 - v}%`,
                  background: s.color,
                }}
              />
            ))
          })}
        </div>
      </div>

      {/* X axis */}
      <div className="mt-1.5 flex shrink-0 justify-between pl-[26px] text-[11px] text-muted-foreground">
        {xLabels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  )
}

export interface HeatRow {
  label: string
  values: number[]
}

/**
 * Adoption heatmap — feature rows × version columns, cells tinted by value.
 * Mirrors the kit's "Heatmap Table" with a gradient legend underneath.
 */
export function Heatmap({
  columns,
  rows,
  className,
  color = "var(--tab-accent)",
  legend = true,
}: {
  columns: string[]
  rows: HeatRow[]
  className?: string
  /** Accent colour for the cells; pass an explicit hex inside portals. */
  color?: string
  legend?: boolean
}) {
  const cols = `minmax(0,1.3fr) repeat(${columns.length}, minmax(0,1fr))`
  return (
    <div className={className}>
      <div className="grid gap-1" style={{ gridTemplateColumns: cols }}>
        {/* Header */}
        <span />
        {columns.map((c) => (
          <span
            key={c}
            className="pb-1 text-center font-medium text-[11px] text-muted-foreground"
          >
            {c}
          </span>
        ))}

        {/* Rows */}
        {rows.map((r) => (
          <Reveal className="contents" key={r.label}>
            <span className="flex items-center truncate pr-2 font-medium text-foreground text-xs">
              {r.label}
            </span>
            {r.values.map((v, i) => {
              const alpha = 8 + (v / 100) * 84
              return (
                <span
                  className="flex h-7 cursor-default items-center justify-center rounded-md font-medium text-[11px] tabular-nums transition-[filter] duration-150 hover:brightness-95"
                  key={i}
                  style={{
                    background: `color-mix(in srgb, ${color} ${alpha}%, var(--card))`,
                    color:
                      v >= 52
                        ? "var(--card)"
                        : `color-mix(in srgb, var(--foreground) 75%, ${color})`,
                  }}
                >
                  {v}%
                </span>
              )
            })}
          </Reveal>
        ))}
      </div>

      {/* Legend */}
      {legend && (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>0</span>
          <span
            className="h-1.5 flex-1 rounded-full"
            style={{
              background: `linear-gradient(to right, color-mix(in srgb, ${color} 8%, var(--card)), ${color})`,
            }}
          />
          <span>100% adoption</span>
        </div>
      )}
    </div>
  )
}

/**
 * Static segmented control (decorative product chrome). Highlights the active
 * segment; the live one shows a pulse dot, matching the kit's control.
 */
export function SegmentedControl({
  options,
  active,
}: {
  options: string[]
  active: string
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
      {options.map((o) => {
        const selected = o === active
        const live = o.toLowerCase() === "live"
        return (
          <span
            key={o}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium text-xs transition-colors",
              selected
                ? "bg-card text-foreground shadow-xs/5"
                : "text-muted-foreground",
            )}
          >
            {live && (
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
            )}
            {o}
          </span>
        )
      })}
    </div>
  )
}
