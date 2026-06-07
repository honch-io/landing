"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  CheckCircle,
  MagnifyingGlass,
  Sparkle,
} from "@phosphor-icons/react"
import { motion, useReducedMotion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  churnRetention,
  coffeeTypes,
  drinkerSegments,
  ecoFunnel,
  insightQueries,
  type InsightQueryId,
} from "./mock-data"
import {
  DiscoveryFunnel,
  InsightSkeleton,
  RankedBars,
  SegmentBar,
} from "./insights-viz"
import { LineChart, Reveal, RevealGroup } from "./shared"

/* -------------------------------------------------------------------------- */
/*  "Insights from users" — a self-driving "ask → analyze → insight" loop.     */
/*                                                                            */
/*  A question is typed into a prompt bar; while it types the result side       */
/*  shows a "generating" skeleton; then the matching chart + a generated        */
/*  insight reveal. It clears and moves to the next question, looping through    */
/*  all four. Driven by a tiny state machine (same shape as CohortsTab); it      */
/*  freezes off-screen and, under reduced motion, skips typing entirely and      */
/*  cross-fades the four questions on a plain interval.                          */
/* -------------------------------------------------------------------------- */

type Phase =
  | "typing"
  | "pressing"
  | "thinking"
  | "revealing"
  | "holding"
  | "clearing"

/** Durations in ms — paced so the question reads as it's typed and the insight
 *  has time to land before clearing. A focused viewer sees the full
 *  four-question cycle (~32s); a glimpse still shows the type + first reveal. */
const DUR = {
  perChar: 28,
  afterType: 420,
  pressing: 300,
  thinking: 1000,
  revealing: 1050,
  holding: 3600,
  backspace: 22,
  afterClear: 420,
} as const

/** Reduced-motion: no typing — just cross-fade the questions on this interval. */
const REDUCED_INTERVAL = 4500

function ThinkingDots() {
  return (
    <span className="ml-0.5 inline-flex items-end gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  )
}

function Chart({ id }: { id: InsightQueryId }) {
  switch (id) {
    case "eco":
      return <DiscoveryFunnel steps={ecoFunnel} />
    case "churn":
      return (
        <LineChart
          series={churnRetention.series}
          xLabels={churnRetention.xLabels}
          className="h-full"
        />
      )
    case "popular":
      return <RankedBars items={coffeeTypes} />
    case "drinkers":
      return <SegmentBar segments={drinkerSegments} />
  }
}

export default function InsightsTab() {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)

  const [inView, setInView] = useState(true)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("typing")
  const [chars, setChars] = useState(0)

  const q = insightQueries[index]
  const len = q.question.length
  const playing = inView && !reduce

  const typed = reduce ? q.question : q.question.slice(0, chars)
  const showResult =
    reduce || phase === "revealing" || phase === "holding" || phase === "clearing"
  // The result panel only "loads" once the prompt has been sent (press → analyze).
  const loading = phase === "pressing" || phase === "thinking"

  // Freeze the loop when the tab is scrolled off-screen.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Single self-cleaning timer advances the scene. Re-runs on every state hop
  // (phase / chars / index) so each step schedules exactly one follow-up.
  useEffect(() => {
    if (!playing) return
    let id: ReturnType<typeof setTimeout>
    switch (phase) {
      case "typing":
        id =
          chars < len
            ? setTimeout(() => setChars((c) => c + 1), DUR.perChar)
            : setTimeout(() => setPhase("pressing"), DUR.afterType)
        break
      case "pressing":
        id = setTimeout(() => setPhase("thinking"), DUR.pressing)
        break
      case "thinking":
        id = setTimeout(() => setPhase("revealing"), DUR.thinking)
        break
      case "revealing":
        id = setTimeout(() => setPhase("holding"), DUR.revealing)
        break
      case "holding":
        id = setTimeout(() => setPhase("clearing"), DUR.holding)
        break
      case "clearing":
        id =
          chars > 0
            ? setTimeout(() => setChars((c) => c - 1), DUR.backspace)
            : setTimeout(() => {
                setIndex((i) => (i + 1) % insightQueries.length)
                setPhase("typing")
              }, DUR.afterClear)
        break
    }
    return () => clearTimeout(id)
  }, [phase, chars, index, playing, len])

  // Reduced motion: advance through the questions on a plain interval.
  useEffect(() => {
    if (!reduce) return
    const id = setInterval(
      () => setIndex((i) => (i + 1) % insightQueries.length),
      REDUCED_INTERVAL,
    )
    return () => clearInterval(id)
  }, [reduce])

  return (
    <div ref={rootRef} className="h-full">
      <RevealGroup className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[0.8fr_1fr]">
        {/* Ask — the prompt the user is "typing" */}
        <Reveal className="min-h-0">
          <Card className="flex h-full flex-col justify-center gap-5 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--tab-accent)]">
                <Sparkle className="size-4" weight="fill" />
                <span className="font-medium text-xs uppercase tracking-wide">
                  Ask Honch
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {insightQueries.map((iq, i) => (
                  <span
                    key={iq.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === index
                        ? "w-4 bg-[var(--tab-accent)]"
                        : "w-1.5 bg-muted-foreground/25",
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Prompt box — reserves two lines so typing never reflows the card */}
            <div className="flex items-start gap-2.5 rounded-xl border bg-background px-3.5 py-3 shadow-xs/5">
              <MagnifyingGlass
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                weight="bold"
              />
              <p className="min-h-[2.6em] min-w-0 flex-1 font-medium text-foreground text-sm leading-[1.3em]">
                {typed}
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[0.15em] rounded-full bg-[var(--tab-accent)] align-middle"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      times: [0, 0.5, 0.5, 1],
                    }}
                  />
                )}
              </p>
              <motion.span
                aria-hidden
                className="flex size-7 shrink-0 items-center justify-center self-center rounded-lg bg-[var(--tab-accent)] text-white"
                initial={false}
                animate={
                  reduce
                    ? { scale: 1, opacity: 1 }
                    : phase === "typing"
                      ? { scale: 0.9, opacity: 0.55, y: 0, filter: "brightness(1)" }
                      : phase === "pressing"
                        ? {
                            // Depress inward: dip + sink + darken, then release.
                            scale: [0.9, 0.8, 1],
                            y: [0, 2, 0],
                            opacity: [0.55, 1, 1],
                            filter: [
                              "brightness(1)",
                              "brightness(0.82)",
                              "brightness(1)",
                            ],
                          }
                        : { scale: 1, opacity: 1, y: 0, filter: "brightness(1)" }
                }
                transition={
                  phase === "pressing"
                    ? {
                        duration: DUR.pressing / 1000,
                        times: [0, 0.45, 1],
                        ease: "easeInOut",
                      }
                    : { type: "spring", stiffness: 500, damping: 24 }
                }
              >
                <ArrowRight className="size-3.5" weight="bold" />
              </motion.span>
            </div>

            {/* Status line — keeps a fixed height so nothing jumps */}
            <div className="flex min-h-5 items-center gap-1.5 text-xs">
              {showResult ? (
                <>
                  <CheckCircle
                    className="size-4 text-[var(--tab-accent)]"
                    weight="fill"
                  />
                  <span className="text-muted-foreground">Insight generated</span>
                </>
              ) : phase === "thinking" ? (
                <span className="flex items-center text-muted-foreground">
                  Analyzing {q.analyzing}
                  <ThinkingDots />
                </span>
              ) : null}
            </div>
          </Card>
        </Reveal>

        {/* Result — generates a chart + insight for the current question */}
        <Reveal className="min-h-0">
          <Card className="flex h-full flex-col gap-3 border-2 border-[color-mix(in_srgb,var(--tab-accent)_85%,var(--card))] bg-[color-mix(in_srgb,var(--tab-accent)_5%,var(--card))] p-5">
            <div className="flex shrink-0 items-center justify-between gap-2">
              <span className="font-semibold text-foreground text-sm">
                {q.vizTitle}
              </span>
              <Badge variant="secondary">{q.vizWindow}</Badge>
            </div>

            <div className="relative min-h-0 flex-1">
              {!showResult ? (
                <InsightSkeleton
                  key={loading ? "loading" : "idle"}
                  active={loading}
                />
              ) : (
                <motion.div
                  key={index}
                  className="flex h-full flex-col gap-3"
                  initial={
                    reduce ? false : { opacity: 0, y: 8, filter: "blur(5px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ type: "spring", bounce: 0.14, duration: 0.5 }}
                >
                  <div className="min-h-0 flex-1">
                    <Chart id={q.id} />
                  </div>
                  <div className="shrink-0 border-t pt-3">
                    <div className="flex items-center gap-1.5 text-[var(--tab-accent)]">
                      <Sparkle className="size-3.5" weight="fill" />
                      <span className="font-medium text-[11px] uppercase tracking-wide">
                        Insight
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-foreground text-sm leading-snug">
                      {q.insight}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </Reveal>
      </RevealGroup>
    </div>
  )
}
