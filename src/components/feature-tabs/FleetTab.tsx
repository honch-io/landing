"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Card } from "@/components/ui/card"
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/components/ui/preview-card"
import { cn } from "@/lib/utils"
import { type HubFeature, LEFT_FEATURES, RIGHT_FEATURES } from "./hub-previews"

type Col = "left" | "right"

/* Flattened scatter — the array index is the stable id the auto-open scheduler
   tracks (0–4 left column, 5–9 right column). */
const SCATTER: { f: HubFeature; col: Col }[] = [
  ...LEFT_FEATURES.map((f) => ({ f, col: "left" as const })),
  ...RIGHT_FEATURES.map((f) => ({ f, col: "right" as const })),
]

const topOf = (i: number) => Number.parseFloat(SCATTER[i].f.pos.top)
const rand = (min: number, max: number) => min + Math.random() * (max - min)

/* The vertical span (% of the hub) a popup roughly occupies. Side popups open
   level with their trigger; top-row popups open downward, so they reach twice
   as far below. Two same-column popups whose spans intersect would collide. */
const POPUP_REACH = 22

function band(i: number): [number, number] {
  const top = topOf(i)
  return top < 24
    ? [top, top + POPUP_REACH * 2]
    : [top - POPUP_REACH, top + POPUP_REACH]
}

function overlaps(candidate: number, open: Set<number>) {
  const [aLo, aHi] = band(candidate)
  for (const i of open) {
    if (SCATTER[i].col !== SCATTER[candidate].col) continue
    const [bLo, bHi] = band(i)
    if (aLo < bHi && bLo < aHi) return true
  }
  return false
}

/** Most popups allowed open at the same time. */
const MAX_OPEN = 3
/** How long a popup lingers before it's dismissed. */
const DWELL_MS = [2600, 4200] as const
/** Pause between open attempts. */
const GAP_MS = [650, 1500] as const

function FeatureLink({
  f,
  side = "bottom",
  align = "center",
  open,
  onOpenChange,
}: {
  f: HubFeature
  side?: "left" | "right" | "top" | "bottom"
  align?: "start" | "center" | "end"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <PreviewCard onOpenChange={onOpenChange} open={open}>
      <PreviewCardTrigger
        className="group inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        delay={0}
        render={<button type="button" />}
      >
        <f.icon
          aria-hidden
          className={cn("size-5 shrink-0", f.iconClass)}
          weight="duotone"
        />
        <span className="whitespace-nowrap font-medium text-foreground text-lg underline decoration-1 decoration-foreground/15 underline-offset-4 transition-colors group-hover:decoration-foreground/50">
          {f.label}
        </span>
      </PreviewCardTrigger>
      {/* The positioner/popup just handles the portal + scale-in; the Card
          inside is the visible surface, matching the hero card (border, rounded,
          shadow) on a #FFFEFE background. */}
      <PreviewCardPopup
        align={align}
        className="border-0 bg-transparent p-0 shadow-none before:hidden"
        side={side}
        sideOffset={10}
      >
        <Card className={cn(f.width, "bg-[#FFFEFE] p-2.5")}>
          <f.Preview color={f.hex} />
        </Card>
      </PreviewCardPopup>
    </PreviewCard>
  )
}

function Scattered({
  f,
  col,
  idx,
  open,
  setOpen,
}: {
  f: HubFeature
  col: Col
  idx: number
  open: boolean
  setOpen: (idx: number, open: boolean) => void
}) {
  const top = Number.parseFloat(f.pos.top)
  // Top rows drop down; everything else opens outward, away from the logo.
  const side = top < 24 ? "bottom" : col
  const align =
    side === "bottom" ? "center" : top > 68 ? "end" : top < 40 ? "start" : "center"
  return (
    <div
      className="-translate-y-1/2 absolute"
      style={{ left: f.pos.left, top: f.pos.top }}
    >
      {/* Ambient float — barely-there, staggered, freezes while its preview is
          open so the popup stays anchored. Disabled under prefers-reduced-motion
          by the MotionConfig in FeatureTabs. */}
      <motion.div
        animate={open ? { y: 0 } : { y: [0, -3.5, 0] }}
        transition={
          open
            ? { duration: 0.3, ease: "easeOut" }
            : {
                duration: 3.4 + (idx % 5) * 0.45,
                delay: (idx % 5) * 0.22 + (idx >= 5 ? 0.3 : 0),
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
        }
      >
        <FeatureLink
          align={align}
          f={f}
          onOpenChange={(o) => setOpen(idx, o)}
          open={open}
          side={side}
        />
      </motion.div>
    </div>
  )
}

export default function FleetTab() {
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set())
  const prefersReducedMotion = useReducedMotion()

  // Hover (or any base-ui open request) flips a card on/off; the scheduler owns
  // the rest. Both funnel through the same set, so they never fight.
  const setOpen = useCallback((idx: number, next: boolean) => {
    setOpenSet((prev) => {
      if (prev.has(idx) === next) return prev
      const out = new Set(prev)
      if (next) out.add(idx)
      else out.delete(idx)
      return out
    })
  }, [])

  // Auto-show: every so often pop a random card that won't collide with the
  // ones already open, let it linger, then dismiss it. Multiple stay open at
  // once. Desktop only — the mobile layout is a static grid.
  useEffect(() => {
    if (prefersReducedMotion) return
    if (typeof window === "undefined") return
    if (!window.matchMedia("(min-width: 1024px)").matches) return

    let tick: ReturnType<typeof setTimeout>
    const closers = new Set<ReturnType<typeof setTimeout>>()

    const loop = () => {
      tick = setTimeout(() => {
        setOpenSet((prev) => {
          if (prev.size >= MAX_OPEN) return prev
          const candidates = SCATTER.reduce<number[]>((acc, _, i) => {
            if (!prev.has(i) && !overlaps(i, prev)) acc.push(i)
            return acc
          }, [])
          if (!candidates.length) return prev
          const pick = candidates[Math.floor(Math.random() * candidates.length)]
          const close = setTimeout(() => {
            setOpenSet((p) => {
              if (!p.has(pick)) return p
              const out = new Set(p)
              out.delete(pick)
              return out
            })
            closers.delete(close)
          }, rand(DWELL_MS[0], DWELL_MS[1]))
          closers.add(close)
          const next = new Set(prev)
          next.add(pick)
          return next
        })
        loop()
      }, rand(GAP_MS[0], GAP_MS[1]))
    }
    loop()

    return () => {
      clearTimeout(tick)
      closers.forEach(clearTimeout)
    }
  }, [prefersReducedMotion])

  return (
    <div className="h-full">
      {/* Desktop — logo centred, features scattered to fill the space */}
      <div className="relative hidden h-full lg:block">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex flex-col items-center gap-2.5 text-center">
          <img alt="Honch" className="size-16" src="/icon.svg" />
          <p className="max-w-[13rem] text-balance font-medium text-muted-foreground text-sm leading-snug">
            One platform for everything your hardware does.
          </p>
        </div>
        {SCATTER.map(({ f, col }, i) => (
          <Scattered
            col={col}
            f={f}
            idx={i}
            key={f.label}
            open={openSet.has(i)}
            setOpen={setOpen}
          />
        ))}
      </div>

      {/* Mobile / tablet — logo over a grid of feature links */}
      <div className="flex flex-col items-center gap-7 py-2 lg:hidden">
        <img alt="Honch" className="size-14" src="/icon.svg" />
        <p className="-mt-3 max-w-[16rem] text-center font-medium text-muted-foreground text-sm">
          One platform for everything your hardware does.
        </p>
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          {[...LEFT_FEATURES, ...RIGHT_FEATURES].map((f) => (
            <FeatureLink f={f} key={f.label} />
          ))}
        </div>
      </div>
    </div>
  )
}
