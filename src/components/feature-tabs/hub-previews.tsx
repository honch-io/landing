"use client"

import type { ReactNode } from "react"
import {
  ArrowsClockwise,
  ChartBar,
  ChartLine,
  Clock,
  Cpu,
  DeviceMobile,
  FunnelSimple,
  type Icon,
  Lightning,
  Path,
  PlayCircle,
  UsersThree,
} from "@phosphor-icons/react"
import { Heatmap, Sparkline } from "./shared"

/* -------------------------------------------------------------------------- */
/*  Hub feature previews — each hover opens one of these, a small live mock of */
/*  that product surface built from the same primitives the platform uses      */
/*  (StatCard, Table, funnel, retention curve, event stream, heatmap…). Every  */
/*  preview is tinted with its feature's own product colour. Colours are       */
/*  passed explicitly because the popups portal out of the --tab-accent scope. */
/* -------------------------------------------------------------------------- */

/** Titled frame shared by every preview. */
function Pv({
  label,
  sub,
  children,
}: {
  label: string
  sub?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-semibold text-foreground text-xs">{label}</span>
        {sub && (
          <span className="shrink-0 text-[10px] text-muted-foreground">{sub}</span>
        )}
      </div>
      {children}
    </div>
  )
}

function LiveDot({ color }: { color: string }) {
  return (
    <span className="relative flex size-1.5">
      <span
        className="absolute inline-flex size-full animate-ping rounded-full opacity-70"
        style={{ background: color }}
      />
      <span
        className="relative inline-flex size-1.5 rounded-full"
        style={{ background: color }}
      />
    </span>
  )
}

/* ---- 1 · Dashboards (purple) ---- */
function DashboardsPreview({ color }: { color: string }) {
  const tiles = [
    { l: "Active devices", v: "12,643", s: [8, 9, 9.6, 10.4, 11.2, 12, 12.6] },
    { l: "Sessions", v: "38.9k", s: [30, 33, 32, 35, 37, 38, 38.9] },
    { l: "Events / min", v: "1,284", s: [0.9, 1.05, 1.0, 1.18, 1.2, 1.28] },
    { l: "Crash-free", v: "99.6%", s: [99.1, 99.2, 99.3, 99.4, 99.5, 99.6] },
  ]
  return (
    <Pv label="Overview" sub="Last 7 days">
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((t) => (
          <div
            className="cursor-default rounded-lg border bg-card p-2 transition-colors hover:border-foreground/25 hover:bg-muted/30"
            key={t.l}
          >
            <div className="truncate text-[10px] text-muted-foreground">{t.l}</div>
            <div className="mt-0.5 flex items-end justify-between gap-1">
              <span className="font-bold text-foreground text-sm tabular-nums">
                {t.v}
              </span>
              <Sparkline className="h-4 w-9 shrink-0" stroke={color} values={t.s} />
            </div>
          </div>
        ))}
      </div>
    </Pv>
  )
}

/* ---- 2 · Cohorts (pink) ---- */
function CohortsPreview({ color }: { color: string }) {
  const rows = [
    { name: "Daily brewers", desc: "5+ brews/day", users: "4,182" },
    { name: "Eco-mode users", desc: "Power-saving on", users: "1,536" },
    { name: "Churn risk", desc: "No brew in 14d", users: "884" },
  ]
  return (
    <Pv label="Cohorts" sub="4 active">
      <div className="divide-y rounded-lg border">
        {rows.map((r) => (
          <div
            className="flex cursor-default items-center justify-between gap-3 px-2.5 py-2 transition-colors hover:bg-muted/50"
            key={r.name}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: color }}
              />
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground text-xs">
                  {r.name}
                </div>
                <div className="truncate text-[10px] text-muted-foreground">
                  {r.desc}
                </div>
              </div>
            </div>
            <span className="shrink-0 font-semibold text-foreground text-xs tabular-nums">
              {r.users}
            </span>
          </div>
        ))}
      </div>
    </Pv>
  )
}

/* ---- 3 · Funnels (green) ---- */
function FunnelsPreview({ color }: { color: string }) {
  const steps = [
    { p: 100, l: "On" },
    { p: 76, l: "Brew" },
    { p: 41, l: "5th" },
    { p: 19, l: "Daily" },
  ]
  return (
    <Pv label="Activation funnel" sub="Last 30 days">
      <div className="flex h-20 items-stretch gap-2">
        {steps.map((s) => (
          <div
            className="group/bar flex flex-1 cursor-pointer flex-col items-center gap-1"
            key={s.l}
          >
            <span className="font-semibold text-[10px] text-muted-foreground tabular-nums transition-colors group-hover/bar:text-foreground">
              {s.p}%
            </span>
            <div className="flex min-h-0 w-full flex-1 items-end">
              <div
                className="w-full origin-bottom rounded-t-sm transition-[transform,filter] duration-150 group-hover/bar:scale-y-[1.04] group-hover/bar:brightness-110"
                style={{ height: `${s.p}%`, background: color }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground">{s.l}</span>
          </div>
        ))}
      </div>
    </Pv>
  )
}

/* ---- 4 · Retention (teal) ---- */
function RetentionPreview({ color }: { color: string }) {
  const vals = [100, 71, 54, 44, 38, 34]
  const labels = ["D1", "D7", "D14", "D30", "D60", "D90"]
  const W = 224
  const H = 60
  const pad = 5
  const x = (i: number) => pad + (i / (vals.length - 1)) * (W - 2 * pad)
  const y = (v: number) => pad + (1 - v / 100) * (H - 2 * pad)
  const d = vals.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ")
  return (
    <Pv label="Retention" sub="Brewed again">
      <svg
        aria-hidden
        className="w-full"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        width={W}
      >
        <path
          d={`${d} L${x(vals.length - 1)} ${H - pad} L${x(0)} ${H - pad} Z`}
          fill={color}
          opacity={0.1}
        />
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
        {vals.map((v, i) => (
          <g className="group/pt" key={i}>
            {/* generous transparent hit target */}
            <circle cx={x(i)} cy={y(v)} fill="transparent" r={9} />
            <circle
              className="origin-center cursor-pointer transition-transform duration-150 [transform-box:fill-box] group-hover/pt:scale-[1.9]"
              cx={x(i)}
              cy={y(v)}
              fill={color}
              r={2.5}
              stroke="var(--card)"
              strokeWidth={1}
            />
          </g>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </Pv>
  )
}

/* ---- 5 · Sessions (orange) ---- */
function SessionsPreview({ color }: { color: string }) {
  const rows = [
    { id: "device_8f3a2c", dur: "3m 12s", ev: "42" },
    { id: "device_b71e09", dur: "1m 48s", ev: "23" },
    { id: "device_4c9d2a", dur: "5m 04s", ev: "61" },
  ]
  return (
    <Pv label="Recent sessions">
      <div className="divide-y rounded-lg border">
        {rows.map((r) => (
          <div
            className="flex cursor-default items-center gap-2 px-2.5 py-2 transition-colors hover:bg-muted/50"
            key={r.id}
          >
            <PlayCircle
              className="size-4 shrink-0"
              style={{ color }}
              weight="fill"
            />
            <span className="flex-1 truncate font-mono text-[11px] text-foreground">
              {r.id}
            </span>
            <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
              {r.dur}
            </span>
            <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
              {r.ev} ev
            </span>
          </div>
        ))}
      </div>
    </Pv>
  )
}

/* ---- 6 · Trends (rose) ---- */
function TrendsPreview({ color }: { color: string }) {
  return (
    <Pv label="Events / min" sub="Today">
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-2xl text-foreground tabular-nums">
          1,284
        </span>
        <span className="font-medium text-emerald-600 text-xs">+8.0%</span>
      </div>
      <Sparkline
        area
        className="mt-2 h-12 w-full"
        stroke={color}
        values={[0.9, 1.0, 0.95, 1.12, 1.05, 1.2, 1.16, 1.28, 1.22, 1.3]}
      />
    </Pv>
  )
}

/* ---- 7 · Events (amber) ---- */
function EventsPreview({ color }: { color: string }) {
  const rows = [
    { t: "10:41:21", e: "brew_started", d: "X1" },
    { t: "10:41:19", e: "bean_refill", d: "X1" },
    { t: "10:41:18", e: "descale_run", d: "S2" },
    { t: "10:41:16", e: "power_on", d: "X1" },
  ]
  return (
    <Pv
      label="Live event stream"
      sub={
        <span className="inline-flex items-center gap-1">
          <LiveDot color={color} /> Live
        </span>
      }
    >
      <div className="divide-y rounded-lg border">
        {rows.map((r) => (
          <div
            className="flex cursor-default items-center gap-2 px-2.5 py-1.5 transition-colors hover:bg-muted/50"
            key={r.t}
          >
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums">
              {r.t}
            </span>
            <span className="flex flex-1 items-center gap-1.5 truncate">
              <Lightning className="size-3 shrink-0" style={{ color }} weight="fill" />
              <span className="truncate font-mono text-[11px] text-foreground">
                {r.e}
              </span>
            </span>
            <span className="shrink-0 text-[10px] text-muted-foreground">{r.d}</span>
          </div>
        ))}
      </div>
    </Pv>
  )
}

/* ---- 8 · Firmware adoption (blue) ---- */
function FirmwarePreview({ color }: { color: string }) {
  return (
    <Pv label="Feature adoption" sub="by firmware">
      <Heatmap
        color={color}
        columns={["v2.4", "v2.3", "v2.2"]}
        legend={false}
        rows={[
          { label: "Auto-brew", values: [96, 93, 88] },
          { label: "Recipes", values: [67, 54, 41] },
          { label: "Eco mode", values: [18, 9, 5] },
        ]}
      />
    </Pv>
  )
}

/* ---- 9 · Devices (violet) ---- */
function DevicesPreview({ color }: { color: string }) {
  const rows = [
    { id: "device_8f3a2c", model: "X1", on: true },
    { id: "device_b71e09", model: "X1", on: true },
    { id: "device_4c9d2a", model: "S2", on: false },
  ]
  return (
    <Pv label="Devices" sub="12,643 active">
      <div className="divide-y rounded-lg border">
        {rows.map((r) => (
          <div
            className="flex cursor-default items-center gap-2 px-2.5 py-2 transition-colors hover:bg-muted/50"
            key={r.id}
          >
            <DeviceMobile
              className="size-4 shrink-0"
              style={{ color }}
              weight="duotone"
            />
            <span className="flex-1 truncate font-mono text-[11px] text-foreground">
              {r.id}
            </span>
            <span className="rounded border px-1.5 py-0.5 text-[9px] text-muted-foreground">
              {r.model}
            </span>
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ background: r.on ? "#22c55e" : "var(--border)" }}
            />
          </div>
        ))}
      </div>
    </Pv>
  )
}

/* ---- 10 · Paths (indigo) ---- */
function PathsPreview({ color }: { color: string }) {
  const steps = [
    { l: "Power on", pct: null as string | null },
    { l: "First brew", pct: "76%" },
    { l: "Daily use", pct: "54%" },
  ]
  return (
    <Pv label="User paths">
      <div className="flex flex-col">
        {steps.map((s, i) => (
          <div key={s.l}>
            {i > 0 && (
              <div className="flex items-center gap-2 py-0.5 pl-[3px]">
                <span
                  className="h-4 w-px"
                  style={{ background: color, opacity: 0.45 }}
                />
                <span
                  className="font-medium text-[10px] tabular-nums"
                  style={{ color }}
                >
                  {s.pct} continue
                </span>
              </div>
            )}
            <div className="group/step flex cursor-pointer items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full border-2 border-card transition-transform group-hover/step:scale-125"
                style={{ background: color }}
              />
              <span className="text-foreground text-xs">{s.l}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground">
        46% never form a daily habit.
      </div>
    </Pv>
  )
}

/* -------------------------------------------------------------------------- */
/*  Feature registry — order is the vertical order within each side.          */
/* -------------------------------------------------------------------------- */

export interface HubFeature {
  label: string
  icon: Icon
  /** Tailwind text-colour class for the icon. */
  iconClass: string
  /** Hex of the same colour, for the preview viz. */
  hex: string
  /** Popup width class. */
  width: string
  /** Scatter position (centre of the link) as % of the hub area. */
  pos: { left: string; top: string }
  Preview: (props: { color: string }) => ReactNode
}

export const LEFT_FEATURES: HubFeature[] = [
  { label: "Dashboards", icon: ChartBar, iconClass: "text-purple-500", hex: "#a855f7", width: "w-60", pos: { left: "17%", top: "12%" }, Preview: DashboardsPreview },
  { label: "Cohorts", icon: UsersThree, iconClass: "text-pink-500", hex: "#ec4899", width: "w-56", pos: { left: "6%", top: "38%" }, Preview: CohortsPreview },
  { label: "Funnels", icon: FunnelSimple, iconClass: "text-green-500", hex: "#22c55e", width: "w-48", pos: { left: "21%", top: "58%" }, Preview: FunnelsPreview },
  { label: "Retention", icon: ArrowsClockwise, iconClass: "text-teal-500", hex: "#14b8a6", width: "w-52", pos: { left: "8%", top: "80%" }, Preview: RetentionPreview },
  { label: "Sessions", icon: Clock, iconClass: "text-orange-500", hex: "#f97316", width: "w-56", pos: { left: "26%", top: "90%" }, Preview: SessionsPreview },
]

export const RIGHT_FEATURES: HubFeature[] = [
  { label: "Trends", icon: ChartLine, iconClass: "text-rose-500", hex: "#f43f5e", width: "w-44", pos: { left: "71%", top: "10%" }, Preview: TrendsPreview },
  { label: "Live events", icon: Lightning, iconClass: "text-amber-500", hex: "#f59e0b", width: "w-56", pos: { left: "83%", top: "34%" }, Preview: EventsPreview },
  { label: "Firmware", icon: Cpu, iconClass: "text-blue-500", hex: "#3b82f6", width: "w-52", pos: { left: "68%", top: "56%" }, Preview: FirmwarePreview },
  { label: "Devices", icon: DeviceMobile, iconClass: "text-violet-500", hex: "#8b5cf6", width: "w-56", pos: { left: "85%", top: "78%" }, Preview: DevicesPreview },
  { label: "User paths", icon: Path, iconClass: "text-indigo-500", hex: "#6366f1", width: "w-48", pos: { left: "72%", top: "90%" }, Preview: PathsPreview },
]
