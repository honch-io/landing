"use client"

import { useState } from "react"
import posthog from "posthog-js"
import { ArrowRight, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { PLANS, annualMonthly, type Plan } from "./config"

function priceDisplay(plan: Plan, annual: boolean): { amount: string; suffix?: string } {
  if (plan.monthlyPrice === null) return { amount: "Custom" }
  if (plan.monthlyPrice === 0) return { amount: "$0", suffix: "/mo" }
  const value = annual ? annualMonthly(plan.monthlyPrice) : plan.monthlyPrice
  return { amount: `$${value}`, suffix: "/mo" }
}

// The headline allotments echoed on each card, in display order.
const CARD_SPECS: { label: string; key: keyof Plan }[] = [
  { label: "included / mo", key: "includedEvents" },
  { label: "retention", key: "retention" },
  { label: "seats", key: "seats" },
  { label: "projects", key: "projects" },
  { label: "dashboards", key: "dashboards" },
]

export default function TierCards() {
  const [annual, setAnnual] = useState(false)

  return (
    <div>
      {/* Billing cadence toggle */}
      <div className="mb-10 flex items-center justify-center gap-3">
        <Label
          htmlFor="billing-cadence"
          className={cn("text-sm", !annual ? "font-medium text-foreground" : "text-muted-foreground")}
        >
          Monthly
        </Label>
        <Switch
          id="billing-cadence"
          checked={annual}
          onCheckedChange={(checked) => {
            setAnnual(checked)
            posthog.capture("pricing_billing_toggled", { cadence: checked ? "annual" : "monthly" })
          }}
        />
        <Label
          htmlFor="billing-cadence"
          className={cn("text-sm", annual ? "font-medium text-foreground" : "text-muted-foreground")}
        >
          Annual
        </Label>
        <Badge variant="success" size="sm" className="ml-1">
          2 months free
        </Badge>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const price = priceDisplay(plan, annual)
          const popular = Boolean(plan.mostPopular)
          return (
            <Card
              key={plan.id}
              className={cn(
                "p-6",
                popular && "border-primary shadow-md shadow-primary/10 ring-1 ring-primary",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading text-2xl">{plan.name}</h3>
                {popular && <Badge>Most popular</Badge>}
              </div>
              <p className="mt-2 min-h-10 text-sm text-muted-foreground">{plan.tagline}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-heading text-4xl tracking-tight">{price.amount}</span>
                {price.suffix && <span className="text-sm text-muted-foreground">{price.suffix}</span>}
              </div>
              <p className="mt-1 h-4 text-xs text-muted-foreground">
                {annual && plan.monthlyPrice && plan.monthlyPrice > 0
                  ? `Billed annually · was $${plan.monthlyPrice}/mo`
                  : plan.monthlyPrice === null
                    ? "Committed-volume pricing"
                    : " "}
              </p>

              <Button
                size="lg"
                variant={popular ? "default" : "outline"}
                className="mt-6 w-full"
                render={<a href={plan.cta.href} target="_blank" rel="noopener noreferrer" />}
                onClick={() =>
                  posthog.capture("cta_clicked", {
                    cta: plan.cta.label.toLowerCase().replace(/\s+/g, "_"),
                    location: "pricing_tier_card",
                    plan: plan.id,
                  })
                }
              >
                {plan.cta.label} <ArrowRight />
              </Button>

              <ul className="mt-6 space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium text-foreground">{plan.includedEvents}</span>{" "}
                    events included
                  </span>
                </li>
                {CARD_SPECS.slice(1).map((spec) => (
                  <li key={spec.key} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      <span className="font-medium text-foreground">{String(plan[spec.key])}</span>{" "}
                      {spec.label}
                    </span>
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>Full hardware analytics suite</span>
                </li>
              </ul>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
