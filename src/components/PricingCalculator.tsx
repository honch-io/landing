"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SliderPrimitive } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// $30 per million events, decreasing per-million as volume scales.
export const PRICING_TIERS: { label: string; price: number | null }[] = [
  { label: "10K", price: 1 },
  { label: "100K", price: 3 },
  { label: "200K", price: 6 },
  { label: "500K", price: 15 },
  { label: "1M", price: 30 },
  { label: "2M", price: 54 },
  { label: "5M", price: 120 },
  { label: "10M", price: 210 },
  { label: "10M+", price: null },
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
  helperText = "Drag to estimate your monthly event volume. You only pay for what you send.",
}: PricingCalculatorProps) {
  const [idx, setIdx] = useState(4)
  const tierCount = PRICING_TIERS.length
  const tier = PRICING_TIERS[idx]

  return (
    <div className="space-y-4">
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}

      <div className="flex select-none gap-3" style={{ height }}>
        {/* Volume labels (largest at top) */}
        <div className="flex w-10 shrink-0 flex-col justify-between py-1 text-right">
          {PRICING_TIERS.map((_, i) => {
            const realIdx = tierCount - 1 - i
            const labelTier = PRICING_TIERS[realIdx]
            return (
              <button
                key={labelTier.label}
                type="button"
                onClick={() => setIdx(realIdx)}
                className={cn(
                  "cursor-pointer text-[11px] leading-none transition-colors",
                  idx === realIdx ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {labelTier.label}
              </button>
            )
          })}
        </div>

        {/* Vertical slider — design-system primitive */}
        <SliderPrimitive.Root
          orientation="vertical"
          min={0}
          max={tierCount - 1}
          step={1}
          value={idx}
          onValueChange={(value) => setIdx(typeof value === "number" ? value : value[0])}
          className="flex-1"
        >
          <SliderPrimitive.Control className="h-full w-full">
            <SliderPrimitive.Track className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-background">
              <SliderPrimitive.Indicator
                className="w-full rounded-b-xl"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--color-primary) 12%, transparent), var(--color-primary))",
                }}
              />
              <SliderPrimitive.Thumb
                aria-label="Monthly event volume"
                className="flex h-5 w-10 cursor-grab items-center justify-center gap-[3px] rounded-md border border-border bg-background shadow-md outline-none transition-shadow has-focus-visible:ring-[3px] has-focus-visible:ring-ring/24 data-dragging:cursor-grabbing data-dragging:shadow-lg"
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
        <span className="text-sm font-medium text-foreground">{tier.label} events</span>
        {tier.price === null ? (
          <span className="text-sm font-medium text-foreground">Custom</span>
        ) : (
          <span className="text-sm font-medium text-foreground">
            ${tier.price}
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
