"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Coffee } from "@phosphor-icons/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { cohorts } from "./mock-data"
import { Reveal, RevealGroup, TOKENS } from "./shared"

/* -------------------------------------------------------------------------- */
/*  Animated "Cohorts & funnels" scene                                         */
/*                                                                            */
/*  A simulated user (a cursor) interacts with the smart machine, and each     */
/*  action feeds the matching cohort on the right — the row highlights and its  */
/*  count ticks up. Each cohort has its own gesture:                           */
/*    • Daily brewers     → press BREW                                          */
/*    • Eco-mode users    → press the eco button (right side of the screen)     */
/*    • Espresso drinkers → tap "Espresso" in the menu                          */
/*    • Churn risk        → the cursor turns red and shakes "no" (no brew)      */
/*  Driven by a tiny state machine; freezes off-screen / under reduced motion. */
/*  Remounts (keyed by tab) reset counts to canonical values.                  */
/* -------------------------------------------------------------------------- */

type Step = "idle" | "moving" | "press" | "fly" | "land" | "reset"
type Action = "brew" | "eco" | "espresso" | "churn"

/** Per-step dwell, ms. Totals ~3.6s so the key beat completes within a visit. */
const STEP_DUR: Record<Step, number> = {
  idle: 900,
  moving: 700,
  press: 320,
  fly: 720,
  land: 560,
  reset: 400,
}

const NEXT_STEP: Record<Step, Step> = {
  idle: "moving",
  moving: "press",
  press: "fly",
  fly: "land",
  land: "reset",
  reset: "idle",
}

/** Cohort index → the gesture the cursor performs on the machine. */
const COHORT_ACTION: Action[] = ["brew", "eco", "espresso", "churn"]

/** Event chip label per action (churn emits nothing). */
const EVENT_LABEL: Record<Action, string> = {
  brew: "brew_started",
  eco: "eco_enabled",
  espresso: "espresso_pulled",
  churn: "",
}

/** Which cohort each cycle targets — one pass through all four, then loop. */
const TARGET_SEQUENCE = [0, 1, 2, 3]

/** Press anchors as % of the machine image wrapper (matches the wide PNG,
 *  1570×1002 — the machine sits centre, clouds fill the sides). */
const PRESS_POINTS: Record<Exclude<Action, "churn">, { x: number; y: number }> =
  {
    brew: { x: 42, y: 43.5 },
    eco: { x: 51.5, y: 26.3 },
    espresso: { x: 41, y: 24 },
  }

/** Where the cursor sits to shake "no" for the churn gesture. */
const CHURN_CENTER = { x: 43, y: 42 }
/** Cursor idle rest — off the UI, on the machine body. */
const CURSOR_IDLE = { x: 60, y: 62 }
const DANGER = TOKENS.danger

const baseCount = (s: string) => Number.parseInt(s.replace(/,/g, ""), 10)

export default function CohortsTab() {
  const reduce = useReducedMotion()
  const [inView, setInView] = useState(true)
  const [step, setStep] = useState<Step>("idle")
  const [tick, setTick] = useState(0)
  const [counts, setCounts] = useState<number[]>(() =>
    cohorts.map((c) => baseCount(c.users)),
  )

  const targetIdx = TARGET_SEQUENCE[tick % TARGET_SEQUENCE.length]
  const action = COHORT_ACTION[targetIdx]
  const isChurn = action === "churn"
  const playing = inView && !reduce

  // Geometry for the cross-column event flight, measured in grid space so it
  // survives responsive resizing.
  const gridRef = useRef<HTMLDivElement>(null)
  const machineRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const [machineBox, setMachineBox] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })
  const [tos, setTos] = useState<{ x: number; y: number }[]>([])

  const measure = useCallback(() => {
    const grid = gridRef.current
    if (!grid) return
    const g = grid.getBoundingClientRect()
    const machine = machineRef.current
    if (machine) {
      const m = machine.getBoundingClientRect()
      setMachineBox({
        left: m.left - g.left,
        top: m.top - g.top,
        width: m.width,
        height: m.height,
      })
    }
    setTos(
      rowRefs.current.map((r) => {
        if (!r) return { x: 0, y: 0 }
        const rr = r.getBoundingClientRect()
        return {
          x: rr.left + rr.width / 2 - g.left,
          y: rr.top + rr.height / 2 - g.top,
        }
      }),
    )
  }, [])

  // Measure on mount + after the enter stagger settles + on resize.
  useEffect(() => {
    measure()
    const t = setTimeout(measure, 700)
    const ro = new ResizeObserver(measure)
    if (gridRef.current) ro.observe(gridRef.current)
    window.addEventListener("resize", measure)
    return () => {
      clearTimeout(t)
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [measure])

  // Re-measure when the section scrolls back into view (rects may have been 0).
  useEffect(() => {
    if (inView) measure()
  }, [inView, measure])

  // Pause the loop when the section is off-screen.
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Single self-cleaning timer advances the scene; the count ticks up exactly
  // once, as the event lands (fly → land transition).
  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => {
      if (step === "fly") {
        setCounts((prev) => {
          const next = [...prev]
          next[targetIdx] += 1
          return next
        })
      }
      if (step === "reset") setTick((t) => t + 1)
      setStep(NEXT_STEP[step])
    }, STEP_DUR[step])
    return () => clearTimeout(id)
  }, [step, playing, targetIdx])

  // Snap to a clean frame whenever the loop is paused.
  useEffect(() => {
    if (!playing) setStep("idle")
  }, [playing])

  const atTarget = step === "moving" || step === "press" || step === "fly"
  const churnActive = isChurn && atTarget
  const churnShake = churnActive && (step === "press" || step === "fly")
  const ambient = playing && !atTarget
  const cursorColor = churnActive ? DANGER : "var(--tab-accent)"
  const cursorPos = atTarget
    ? isChurn
      ? CHURN_CENTER
      : PRESS_POINTS[action]
    : CURSOR_IDLE
  const showCup = (step === "fly" || step === "land") && !isChurn

  // Stable flight keyframes across the fly → land re-render (no restart).
  const flight = useMemo(() => {
    const a = COHORT_ACTION[targetIdx]
    const p = a === "churn" ? PRESS_POINTS.brew : PRESS_POINTS[a]
    const fx = machineBox.left + (p.x / 100) * machineBox.width
    const fy = machineBox.top + (p.y / 100) * machineBox.height
    const to = tos[targetIdx] ?? { x: fx, y: fy }
    return {
      from: { x: fx, y: fy },
      x: [fx, (fx + to.x) / 2, to.x],
      y: [fy, Math.min(fy, to.y) - 52, to.y],
    }
  }, [machineBox, tos, targetIdx])

  return (
    <div ref={gridRef} className="relative h-full">
      <RevealGroup className="grid h-full grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Cohort list — the landing target (right column) */}
        <Reveal className="order-2 min-h-0">
          <Card className="flex h-full flex-col overflow-hidden p-0">
            <div className="flex shrink-0 items-center justify-between border-b px-5 py-3.5">
              <span className="font-semibold text-sm">Cohorts</span>
              <span className="text-muted-foreground text-xs tabular-nums">
                4 active
              </span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col divide-y">
              {cohorts.map((c, i) => {
                const rowDanger = COHORT_ACTION[i] === "churn"
                const hotColor = rowDanger ? DANGER : "var(--tab-accent)"
                const hot =
                  playing && i === targetIdx && (step === "land" || step === "reset")
                return (
                  <div
                    className={cn(
                      "relative flex flex-1 items-center justify-between gap-3 px-5 transition-colors duration-300",
                      !hot &&
                        "hover:bg-[color-mix(in_srgb,var(--tab-accent)_6%,var(--card))]",
                    )}
                    key={c.name}
                    ref={(el) => {
                      rowRefs.current[i] = el
                    }}
                    style={
                      hot
                        ? {
                            background: `color-mix(in srgb, ${hotColor} 12%, var(--card))`,
                          }
                        : undefined
                    }
                  >
                    {/* accent bar on the hot row */}
                    <AnimatePresence>
                      {hot && (
                        <motion.span
                          animate={{ scaleY: 1, opacity: 1 }}
                          className="absolute inset-y-1.5 left-0 w-0.5 origin-center rounded-full"
                          exit={{ opacity: 0 }}
                          initial={{ scaleY: 0, opacity: 0 }}
                          key="bar"
                          style={{ background: hotColor }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                    </AnimatePresence>

                    <div className="min-w-0">
                      <div className="truncate font-medium text-sm">{c.name}</div>
                      <div className="truncate text-muted-foreground text-xs">
                        {c.description}
                      </div>
                    </div>
                    <div className="relative shrink-0 text-right">
                      <div className="font-semibold text-sm tabular-nums">
                        {counts[i].toLocaleString()}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {c.createdBy} · {c.lastCalculated}
                      </div>
                      {/* +1 reinforcement */}
                      <AnimatePresence>
                        {hot && (
                          <motion.span
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="-top-2.5 absolute right-0 rounded-full px-1.5 py-0.5 font-semibold text-[10px] text-white tabular-nums"
                            exit={{ opacity: 0, y: -6 }}
                            initial={{ opacity: 0, y: 8, scale: 0.8 }}
                            key="plus"
                            style={{ background: hotColor }}
                            transition={{ type: "spring", bounce: 0.35, duration: 0.45 }}
                          >
                            +1
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </Reveal>

        {/* Smart machine — the event source (left column) */}
        <Reveal className="order-1 min-h-0">
          <Card
            className="relative h-full overflow-hidden border-0 p-0"
            style={{ background: "#fbfcfc" }}
          >
            {/* Fills the card edge-to-edge — no inner frame. On mobile the
                aspect ratio gives the card its height; at lg it absolutely
                fills the column. object-cover bleeds the cloud texture to every
                edge; the card and image share nearly the same ratio, so the
                crop is a hair off the top/bottom only and the % press anchors
                still land. */}
            <div
              className="relative aspect-[1570/1002] w-full lg:absolute lg:inset-0 lg:aspect-auto"
              ref={machineRef}
            >
              <img
                alt="Smart coffee machine touchscreen with a menu and a BREW button"
                className="absolute inset-0 h-full w-full select-none object-cover object-center"
                draggable={false}
                src="/coffee-machine-wide.png"
              />

              {/* press pulse at the active control (not for the churn gesture) */}
              <AnimatePresence>
                {(step === "press" || step === "fly") && playing && !isChurn && (
                  <motion.span
                    animate={{ scale: 1.9, opacity: 0 }}
                    className="pointer-events-none absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    exit={{ opacity: 0 }}
                    initial={{ scale: 0.4, opacity: 0.6 }}
                    key={`press-${tick}`}
                    style={{
                      left: `${PRESS_POINTS[action].x}%`,
                      top: `${PRESS_POINTS[action].y}%`,
                      background:
                        "color-mix(in srgb, var(--tab-accent) 32%, transparent)",
                    }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

              {/* simulated-user cursor */}
              <motion.div
                animate={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                className="pointer-events-none absolute z-10"
                initial={false}
                transition={{ type: "spring", bounce: 0.12, duration: 0.6 }}
              >
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={
                      churnShake
                        ? { x: [0, -6, 6, -6, 6, 0] }
                        : ambient
                          ? { y: [0, -3, 0] }
                          : { x: 0, y: 0 }
                    }
                    className="relative"
                    transition={
                      churnShake
                        ? {
                            duration: 0.45,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                        : ambient
                          ? {
                              duration: 2.6,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }
                          : { duration: 0.3 }
                    }
                  >
                    {/* soft trail */}
                    <motion.span
                      animate={{ background: `color-mix(in srgb, ${cursorColor} 18%, transparent)` }}
                      className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-6 rounded-full blur-[2px]"
                    />
                    {/* cursor dot */}
                    <motion.span
                      animate={{ background: cursorColor }}
                      className="relative block size-3.5 rounded-full border-2 border-white shadow-md"
                    />
                    {/* click ripple (not for churn) */}
                    <AnimatePresence>
                      {(step === "press" || step === "fly") &&
                        playing &&
                        !isChurn && (
                          <motion.span
                            animate={{ scale: 2.8, opacity: 0 }}
                            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-3.5 rounded-full border-2"
                            exit={{ opacity: 0 }}
                            initial={{ scale: 1, opacity: 0.8 }}
                            key={`ripple-${tick}`}
                            style={{ borderColor: cursorColor }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </Card>
        </Reveal>
      </RevealGroup>

      {/* Cross-column overlay — the flying event chip is never clipped by either
          card. Hidden on mobile (stacked columns make the flight read poorly). */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <AnimatePresence>
          {showCup && tos[targetIdx] && (
            <motion.div
              animate={{
                x: flight.x,
                y: flight.y,
                opacity: [0, 1, 1],
                scale: [0.5, 1, 1],
              }}
              className="absolute top-0 left-0"
              exit={{ opacity: 0, scale: 0.4 }}
              initial={{
                x: flight.from.x,
                y: flight.from.y,
                opacity: 0,
                scale: 0.5,
              }}
              key={`cup-${tick}`}
              transition={{
                duration: STEP_DUR.fly / 1000,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1.5 shadow-lg">
                <Coffee
                  className="size-4 text-[var(--tab-accent)]"
                  weight="fill"
                />
                <span className="font-semibold text-[11px]">
                  {EVENT_LABEL[action]}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
