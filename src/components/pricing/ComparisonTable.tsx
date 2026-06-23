"use client"

import { useState } from "react"
import { Check, Info, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  FEATURE_SECTIONS,
  PLANS,
  PLAN_ORDER,
  type Cell,
  type FeatureRow,
  type PlanId,
  type Plan,
} from "./config"

// Height the sticky site navbar occupies (h-16 nav + pt-[17px] header), so the
// table's sticky header parks just beneath it instead of sliding underneath.
const STICKY_TOP = "top-[81px]"

function planPrice(plan: Plan): string {
  if (plan.monthlyPrice === null) return "Custom"
  if (plan.monthlyPrice === 0) return "Free"
  return `$${plan.monthlyPrice}/mo`
}

/** A single comparison value: checkmark, dash, or text — with accessible labels. */
function CellValue({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <>
        <Check aria-hidden className="mx-auto size-4 text-primary" />
        <span className="sr-only">Included</span>
      </>
    )
  }
  if (value === false) {
    return (
      <>
        <Minus aria-hidden className="mx-auto size-4 text-muted-foreground/40" />
        <span className="sr-only">Not included</span>
      </>
    )
  }
  return <span className="text-foreground">{value}</span>
}

/** Row label with an optional keyboard-reachable info tooltip + roadmap badge. */
function RowLabel({ row }: { row: FeatureRow }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span>{row.label}</span>
      {row.tooltip && (
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                aria-label={`About ${row.label}`}
                className="inline-flex cursor-help rounded-full text-muted-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <Info className="size-3.5" />
          </TooltipTrigger>
          <TooltipPopup className="max-w-64 px-3 py-1.5 leading-relaxed">
            {row.tooltip}
          </TooltipPopup>
        </Tooltip>
      )}
      {row.comingSoon && (
        <Badge variant="secondary" size="sm" className="font-normal">
          Coming soon
        </Badge>
      )}
    </span>
  )
}

// Column index of the "most popular" plan, used to tint that column.
const POPULAR_INDEX = PLAN_ORDER.findIndex((id) => PLANS.find((p) => p.id === id)?.mostPopular)

export default function ComparisonTable() {
  const [activePlan, setActivePlan] = useState<PlanId>("business")
  const mobilePlan = PLANS.find((p) => p.id === activePlan) ?? PLANS[0]

  return (
    <TooltipProvider delay={150}>
      {/* Desktop / tablet: full four-column matrix with a sticky header. */}
      <div className="hidden md:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Feature comparison across Honch plans</caption>
          <thead className={cn("sticky z-30", STICKY_TOP)}>
            <tr>
              <th
                scope="col"
                className="w-[28%] border-b border-border bg-background px-4 py-4 align-bottom"
              >
                <span className="text-base font-semibold text-foreground">Compare plans</span>
              </th>
              {PLAN_ORDER.map((id, i) => {
                const plan = PLANS.find((p) => p.id === id)!
                return (
                  <th
                    key={id}
                    scope="col"
                    className={cn(
                      "border-b border-border px-4 py-4 text-center align-bottom",
                      i === POPULAR_INDEX ? "bg-primary/5" : "bg-background",
                    )}
                  >
                    <span className="block font-heading text-lg leading-tight text-foreground">
                      {plan.name}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-muted-foreground">
                      {planPrice(plan)}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          {FEATURE_SECTIONS.map((section) => (
            <tbody key={section.title}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={PLAN_ORDER.length + 1}
                  className="border-b border-border bg-muted/40 px-4 pt-6 pb-2"
                >
                  <span className="text-sm font-semibold tracking-wide text-foreground uppercase">
                    {section.title}
                  </span>
                  {section.note && (
                    <span className="ml-3 text-xs font-normal normal-case text-muted-foreground">
                      {section.note}
                    </span>
                  )}
                </th>
              </tr>
              {section.rows.map((row) => (
                <tr key={row.label} className="border-b border-border/60 last:border-b-0">
                  <th
                    scope="row"
                    className="px-4 py-3 text-left align-top font-normal text-muted-foreground"
                  >
                    <RowLabel row={row} />
                  </th>
                  {PLAN_ORDER.map((id, i) => (
                    <td
                      key={id}
                      className={cn(
                        "px-4 py-3 text-center align-top",
                        i === POPULAR_INDEX && "bg-primary/5",
                      )}
                    >
                      <CellValue value={row.values[id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {/* Mobile: one plan at a time via a Tabs selector, sticky header preserved. */}
      <div className="md:hidden">
        <Tabs
          value={activePlan}
          onValueChange={(value) => setActivePlan(value as PlanId)}
          className="mb-4"
        >
          <TabsList className="w-full overflow-x-auto">
            {PLANS.map((plan) => (
              <TabsTab key={plan.id} value={plan.id} className="text-xs">
                {plan.name}
              </TabsTab>
            ))}
          </TabsList>
        </Tabs>

        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Feature list for the {mobilePlan.name} plan
          </caption>
          <thead className={cn("sticky z-30", STICKY_TOP)}>
            <tr>
              <th scope="col" className="border-b border-border bg-background px-3 py-3">
                <span className="font-heading text-base text-foreground">{mobilePlan.name}</span>
              </th>
              <th
                scope="col"
                className="border-b border-border bg-background px-3 py-3 text-right text-sm font-medium text-muted-foreground"
              >
                {planPrice(mobilePlan)}
              </th>
            </tr>
          </thead>
          {FEATURE_SECTIONS.map((section) => (
            <tbody key={section.title}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={2}
                  className="border-b border-border bg-muted/40 px-3 pt-5 pb-2 text-left"
                >
                  <span className="text-xs font-semibold tracking-wide text-foreground uppercase">
                    {section.title}
                  </span>
                </th>
              </tr>
              {section.rows.map((row) => (
                <tr key={row.label} className="border-b border-border/60 last:border-b-0">
                  <th
                    scope="row"
                    className="px-3 py-3 text-left align-top font-normal text-muted-foreground"
                  >
                    <RowLabel row={row} />
                  </th>
                  <td className="px-3 py-3 text-right align-top">
                    <CellValue value={row.values[mobilePlan.id]} />
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </TooltipProvider>
  )
}
