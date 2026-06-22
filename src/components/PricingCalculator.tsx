"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SliderPrimitive } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// Graduated per-event pricing — the rate drops as monthly volume grows.
// First 1,000 events each month are free.
const BANDS = [
  { upTo: 1_000, rate: 0 },
  { upTo: 2_000_000, rate: 0.00003 },
  { upTo: 15_000_000, rate: 0.0000206 },
  { upTo: 50_000_000, rate: 0.0000177 },
  { upTo: 100_000_000, rate: 0.0000131 },
  { upTo: 250_000_000, rate: 0.000009 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.0000054 },
]

function monthlyCost(events: number): number {
  let cost = 0
  let prev = 0
  for (const band of BANDS) {
    if (events <= prev) break
    cost += (Math.min(events, band.upTo) - prev) * band.rate
    prev = band.upTo
  }
  return cost
}

const STOPS = [
  { label: "1K", events: 1_000 },
  { label: "1M", events: 1_000_000 },
  { label: "2M", events: 2_000_000 },
  { label: "15M", events: 15_000_000 },
  { label: "50M", events: 50_000_000 },
  { label: "100M", events: 100_000_000 },
  { label: "250M", events: 250_000_000 },
  { label: "500M", events: 500_000_000 },
]

interface PricingCalculatorProps {
  /** Height of the slider area in px */
  height?: number
  /** If provided, renders a button at the bottom with this label */
  actionLabel?: string
  /** Called when the action button is clicked */
  onAction?: () => void
  /** If true, the action button is disabled */
  actionDisabled?: boolean
  /** Helper text shown above the slider */
  helperText?: string
}

export function PricingCalculator({
  height = 280,
  actionLabel,
  onAction,
  actionDisabled,
  helperText = "Drag to estimate your monthly bill. Your first 1,000 events are free.",
}: PricingCalculatorProps) {
  const [idx, setIdx] = useState(2)
  const stopCount = STOPS.length
  const stop = STOPS[idx]
  const cost = monthlyCost(stop.events)

  return (
    <div className="space-y-4">
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}

      <div className="flex select-none gap-3" style={{ height }}>
        {/* Volume labels (largest at top) */}
        <div className="flex w-10 shrink-0 flex-col justify-between py-1 text-right">
          {STOPS.map((_, i) => {
            const realIdx = stopCount - 1 - i
            const labelStop = STOPS[realIdx]
            return (
              <button
                key={labelStop.label}
                type="button"
                onClick={() => setIdx(realIdx)}
                className={cn(
                  "cursor-pointer text-[11px] leading-none transition-colors",
                  idx === realIdx ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {labelStop.label}
              </button>
            )
          })}
        </div>

        {/* Vertical slider — design-system primitive */}
        <SliderPrimitive.Root
          orientation="vertical"
          min={0}
          max={stopCount - 1}
          step={1}
          value={idx}
          onValueChange={(value) => setIdx(typeof value === "number" ? value : value[0])}
          className="flex-1"
        >
          <SliderPrimitive.Control className="h-full w-full">
            <SliderPrimitive.Track className="relative h-full w-full rounded-xl border border-border bg-background">
              {/* Gradient fill — clipped to the rounded track (handle is a sibling so it isn't clipped) */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: `${(idx / (stopCount - 1)) * 100}%`,
                    background:
                      "linear-gradient(to top, color-mix(in srgb, var(--color-primary) 12%, transparent), var(--color-primary))",
                  }}
                />
              </div>
              <SliderPrimitive.Thumb
                aria-label="Monthly event volume"
                className="flex h-5 w-10 cursor-grab items-center justify-center gap-[3px] rounded-md border border-border bg-background shadow-md outline-none transition-[box-shadow,scale] has-focus-visible:ring-[3px] has-focus-visible:ring-ring/24 data-dragging:scale-105 data-dragging:cursor-grabbing data-dragging:shadow-lg"
              >
                <span className="h-2 w-[2px] rounded-full bg-muted-foreground/40" />
                <span className="h-2 w-[2px] rounded-full bg-muted-foreground/40" />
                <span className="h-2 w-[2px] rounded-full bg-muted-foreground/40" />
              </SliderPrimitive.Thumb>
            </SliderPrimitive.Track>
          </SliderPrimitive.Control>
        </SliderPrimitive.Root>
      </div>

      {/* Selected tier readout */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5">
        <span className="text-sm font-medium text-foreground">{stop.label} events / mo</span>
        {cost === 0 ? (
          <span className="text-sm font-medium text-foreground">Free</span>
        ) : (
          <span className="text-sm font-medium text-foreground">
            ${Math.round(cost).toLocaleString()}
            <span className="font-normal text-muted-foreground">/mo</span>
          </span>
        )}
      </div>

      {actionLabel && onAction && (
        <Button onClick={onAction} disabled={actionDisabled} size="lg" className="w-full">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
