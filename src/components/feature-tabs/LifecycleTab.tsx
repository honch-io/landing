"use client"

import { useEffect, useRef, useState } from "react"
import { Check, MapPin } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { lifecycleDevice, lifecycleJourney } from "./mock-data"
import { Reveal, RevealGroup } from "./shared"

/* -------------------------------------------------------------------------- */
/*  Animated "Track device lifecycle" scene                                    */
/*                                                                            */
/*  One physical unit (serial CM-X1-0473) is followed cradle-to-grave. The     */
/*  left card cross-fades the device's environment — store → coffee shop →     */
/*  two homes → landfill — while the right card's timeline advances in         */
/*  lock-step: the active stage's marker lights up, a ring loads around it      */
/*  over the dwell, the connector fills, and the row expands to reveal who      */
/*  owns it now. The serial in the header never changes — that's the point of   */
/*  checkout attribution: the same unit, tracked across every owner.            */
/*                                                                            */
/*  Every transition is driven by plain CSS off the `active` state (opacity /   */
/*  transform / grid-rows), so nothing accumulates and nothing can stall — a    */
/*  self-driving loop is exactly the case JS animation libraries handle poorly. */
/*  The loop pauses off-screen and on hover; any stage is clickable to jump.    */
/* -------------------------------------------------------------------------- */

/** Per-stage dwell, ms — also the ring fill time. */
const DWELL_MS = 4000
/** Snappy, slightly cinematic ease shared across the scene. */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
/** Progress-ring geometry (sits just outside the marker it wraps). */
const RING_R = 16
const RING_C = 2 * Math.PI * RING_R

export default function LifecycleTab() {
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)

  // Only pause when scrolled off-screen — never on hover, so clicking a stage
  // (which means hovering it) keeps the ring filling instead of freezing.
  const playing = inView
  const scene = lifecycleJourney[active]

  // Latest values for the rAF loop, which is started once and must not re-run.
  const playingRef = useRef(playing)
  playingRef.current = playing
  const activeRef = useRef(active)
  activeRef.current = active

  // Pause the loop while the section is scrolled off-screen.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // A single persistent rAF loop fills the active marker's ring AND advances
  // the journey. Started once (empty deps) so the parent carousel's per-frame
  // re-renders can never tear it down. It accumulates elapsed time only while
  // playing — so hovering / scrolling off-screen truly pauses and resumes — and
  // writes `--ring-progress` (0→1) straight to the DOM (not React state), which
  // the ring reads via calc(). A click that changes `active` resets the fill.
  useEffect(() => {
    const el = rootRef.current
    let raf = 0
    let prev = 0
    let elapsed = 0
    let curActive = activeRef.current
    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick)
      const dt = prev ? ts - prev : 0
      prev = ts
      if (activeRef.current !== curActive) {
        curActive = activeRef.current
        elapsed = 0
      }
      if (playingRef.current) {
        elapsed += dt
        if (elapsed >= DWELL_MS) {
          elapsed = 0
          curActive = (curActive + 1) % lifecycleJourney.length
          setActive(curActive)
        }
      }
      el?.style.setProperty(
        "--ring-progress",
        String(Math.min(1, elapsed / DWELL_MS)),
      )
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="relative h-full" ref={rootRef}>
      <RevealGroup className="grid h-full grid-cols-1 gap-3 lg:grid-cols-2">
        {/* LEFT — the device in its current environment (cross-fades) */}
        <Reveal className="order-1 min-h-0">
          <Card
            className="relative h-full overflow-hidden border-0 p-0"
            style={{ background: "#fbfcfc" }}
          >
            {/* On mobile the aspect ratio gives the card height; at lg the
                image absolutely fills the column. object-cover bleeds the
                scene to every edge — the machine sits centre so the crop is
                a hair off the sides only. */}
            <div className="relative aspect-[3/2] w-full lg:absolute lg:inset-0 lg:aspect-auto">
              {/* All five scenes stay mounted; CSS cross-fades opacity (with a
                  subtle scale/blur settle) and the active one sits on top. */}
              <div className="absolute inset-0 isolate">
                {lifecycleJourney.map((s, i) => {
                  const on = i === active
                  return (
                    <img
                      alt={`Smart coffee machine — ${s.stage}`}
                      className="absolute inset-0 h-full w-full select-none object-cover object-center transition-[opacity,transform,filter] duration-[600ms] motion-reduce:transition-none"
                      draggable={false}
                      key={s.img}
                      src={s.img}
                      style={{
                        opacity: on ? 1 : 0,
                        transform: on ? "scale(1)" : "scale(1.04)",
                        filter: on ? "blur(0px)" : "blur(6px)",
                        zIndex: on ? 1 : 0,
                        transitionTimingFunction: EASE,
                      }}
                    />
                  )
                })}
              </div>

              {/* current location tag — grounds the scene to the owner/env */}
              <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full border bg-card/80 px-2.5 py-1 shadow-xs/5 backdrop-blur-sm">
                <MapPin
                  className="size-3 shrink-0 text-[var(--tab-accent)]"
                  weight="fill"
                />
                <span className="font-medium text-foreground text-xs">
                  {scene.owner}
                  {scene.env !== "—" && (
                    <span className="text-muted-foreground">
                      {" · "}
                      {scene.env}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* RIGHT — the lifecycle timeline (advances with the scene) */}
        <Reveal className="order-2 min-h-0">
          <Card className="flex h-full flex-col overflow-hidden p-0">
            {/* header — the constant identity (same unit, every stage) */}
            <div className="flex shrink-0 items-center justify-between border-b px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full transition-colors duration-500"
                  style={{
                    background: scene.retired
                      ? "var(--muted-foreground)"
                      : "var(--tab-accent)",
                  }}
                />
                <span className="font-medium font-mono text-sm">
                  {lifecycleDevice.id}
                </span>
              </div>
              <span className="text-muted-foreground text-xs">
                Model {lifecycleDevice.model}
              </span>
            </div>

            {/* timeline — exactly one row is expanded at a time, so the block
                height is constant; centred with comfortable padding so it never
                rides up under the header. */}
            <div className="flex min-h-0 flex-1 flex-col justify-center px-5 py-3">
              {lifecycleJourney.map((s, i) => {
                const Icon = s.icon
                const isActive = i === active
                const isDone = i < active
                const isLast = i === lifecycleJourney.length - 1
                return (
                  <button
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Stage ${i + 1}: ${s.stage}`}
                    className="group flex w-full cursor-pointer gap-3.5 text-left"
                    key={s.stage}
                    onClick={() => setActive(i)}
                    type="button"
                  >
                    {/* marker + connector column */}
                    <div className="flex flex-col items-center self-stretch">
                      <div className="relative z-10 flex size-6 shrink-0 items-center justify-center">
                        {/* loading ring — fills over the dwell on the active
                            stage. Always mounted (only the active one is shown)
                            so its transition target survives the carousel's
                            per-frame re-renders. The card-filled backing masks
                            the connector inside the ring's footprint, so the
                            line meets the ring and pours out below it rather
                            than slicing through it. */}
                        <svg
                          aria-hidden
                          className="-translate-x-1/2 -translate-y-1/2 -rotate-90 pointer-events-none absolute top-1/2 left-1/2 size-9 transition-opacity duration-300 motion-reduce:hidden"
                          style={{ opacity: isActive ? 1 : 0 }}
                          viewBox="0 0 36 36"
                        >
                          <circle cx="18" cy="18" fill="var(--card)" r="18" />
                          <circle
                            cx="18"
                            cy="18"
                            fill="none"
                            r={RING_R}
                            stroke="color-mix(in srgb, var(--tab-accent) 22%, transparent)"
                            strokeWidth="2.25"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            fill="none"
                            r={RING_R}
                            stroke="var(--tab-accent)"
                            strokeLinecap="round"
                            strokeWidth="2.25"
                            style={{
                              strokeDasharray: RING_C,
                              strokeDashoffset: isActive
                                ? `calc(${RING_C} * (1 - var(--ring-progress, 0)))`
                                : RING_C,
                            }}
                          />
                        </svg>

                        <span
                          className="relative z-10 flex size-6 items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-300 ease-out motion-reduce:transition-none"
                          style={{
                            background: isActive
                              ? "var(--tab-accent)"
                              : isDone
                                ? "color-mix(in srgb, var(--tab-accent) 14%, var(--card))"
                                : "var(--card)",
                            borderColor:
                              isActive || isDone
                                ? "var(--tab-accent)"
                                : "var(--border)",
                            transform: isActive ? "scale(1.06)" : "scale(1)",
                          }}
                        >
                          {isDone ? (
                            <Check
                              className="size-3 text-[var(--tab-accent)]"
                              weight="bold"
                            />
                          ) : (
                            <Icon
                              className={cn(
                                "size-3",
                                isActive ? "text-card" : "text-muted-foreground",
                              )}
                              weight={isActive ? "fill" : "regular"}
                            />
                          )}
                        </span>
                      </div>

                      {!isLast && (
                        <div className="relative mt-1 w-0.5 flex-1 grow overflow-hidden rounded-full bg-border">
                          <span
                            className="absolute inset-0 origin-top rounded-full transition-transform duration-500 motion-reduce:transition-none"
                            style={{
                              background: "var(--tab-accent)",
                              transform: isDone ? "scaleY(1)" : "scaleY(0)",
                              transitionTimingFunction: EASE,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* label + expandable attribution */}
                    <div className={cn("min-w-0 flex-1", !isLast && "pb-4")}>
                      <div
                        className={cn(
                          "flex min-h-6 items-center font-medium text-sm transition-colors duration-300",
                          isActive
                            ? "text-foreground"
                            : isDone
                              ? "text-foreground/70"
                              : "text-muted-foreground",
                        )}
                      >
                        {s.stage}
                      </div>

                      {/* grid-rows 0fr→1fr animates the height cleanly in pure
                          CSS — no JS, nothing to accumulate. */}
                      <div
                        className="grid transition-[grid-template-rows] duration-[450ms] motion-reduce:transition-none"
                        style={{
                          gridTemplateRows: isActive ? "1fr" : "0fr",
                          transitionTimingFunction: EASE,
                        }}
                      >
                        <div className="overflow-hidden">
                          <div
                            className="pt-0.5 pb-1 transition-opacity duration-300 motion-reduce:transition-none"
                            style={{ opacity: isActive ? 1 : 0 }}
                          >
                            <div className="text-muted-foreground text-xs">
                              {s.owner}
                              {s.env !== "—" && ` · ${s.env}`}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                              <span className="font-medium text-[var(--tab-accent)]">
                                {s.metric}
                              </span>
                              <span className="text-border">·</span>
                              <span className="text-muted-foreground">
                                {s.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>
        </Reveal>
      </RevealGroup>
    </div>
  )
}
