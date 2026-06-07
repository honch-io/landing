"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { FUNNEL, type FunnelStep } from "./mock"

/* A funnel visualization built natively to the platform's design system —
 * the platform never shipped a funnel UI, so this is greenfield, but it uses
 * the platform's Card, Badge, and StatCard type scale so it reads as the same
 * app. Bars fill from the bottom, staggered left→right, once on scroll-in. */

const nf = new Intl.NumberFormat("en-US")

export function Funnel({
  title = FUNNEL.title,
  window: windowLabel = FUNNEL.window,
  steps = FUNNEL.steps,
  accent = "var(--primary)",
}: {
  title?: string
  window?: string
  steps?: FunnelStep[]
  accent?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const reduced = useReducedMotion()
  const shown = reduced ? true : inView
  const top = steps[0]?.count ?? 1

  return (
    <Card ref={ref} className="gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-foreground">{title}</span>
        <Badge variant="secondary">{windowLabel}</Badge>
      </div>

      {/* Step labels */}
      <div className="flex gap-2">
        {steps.map((s) => (
          <span
            key={s.label}
            className="flex-1 truncate text-center font-medium text-foreground text-xs"
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* Bars */}
      <div className="flex h-32 items-end gap-2">
        {steps.map((s, i) => (
          <div key={s.label} className="relative h-full flex-1">
            <div className="absolute inset-0 rounded-t-md bg-muted/50" />
            <motion.div
              animate={{ scaleY: shown ? 1 : 0 }}
              className="absolute inset-x-0 bottom-0 rounded-t-md"
              initial={{ scaleY: 0 }}
              style={{
                height: `${(s.count / top) * 100}%`,
                background: accent,
                transformOrigin: "bottom",
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
              }
            />
          </div>
        ))}
      </div>

      {/* Counts + conversion */}
      <div className="flex gap-2">
        {steps.map((s, i) => {
          const pctTop = Math.round((s.count / top) * 100)
          const conv =
            i === 0 ? null : Math.round((s.count / steps[i - 1].count) * 100)
          return (
            <motion.div
              key={s.label}
              animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 6 }}
              className="flex flex-1 flex-col items-center gap-0.5 text-center"
              initial={{ opacity: 0, y: 6 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.4, delay: 0.25 + i * 0.08 }
              }
            >
              <span className="font-bold text-foreground text-sm tabular-nums sm:text-base">
                {nf.format(s.count)}
              </span>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {pctTop}%{conv != null && i > 0 ? ` · ${conv}%` : ""}
              </span>
              {s.caption && (
                <span className="text-[11px] text-muted-foreground/80 leading-tight">
                  {s.caption}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
