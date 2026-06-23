"use client"

import posthog from "posthog-js"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PricingCalculator } from "@/components/PricingCalculator"
import { RATE_TABLE } from "./config"

export default function UsageSection() {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Left — the graduated rate card */}
      <div>
        <p className="max-w-md text-base text-muted-foreground">
          Overage is metered per event on a graduated curve — the rate drops as
          your monthly volume grows, so a fleet in the field never gets punished
          for scale. Your first 1,000 events each month are always free.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Events / month</TableHead>
                <TableHead className="px-4 text-right">Rate per event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RATE_TABLE.map((row) => (
                <TableRow key={row.range}>
                  <TableCell className="px-4 font-medium text-foreground">{row.range}</TableCell>
                  <TableCell className="px-4 text-right font-mono text-muted-foreground">
                    {row.rate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Sending more than 250M events a month? Enterprise moves to committed-volume
          pricing with a discounted curve.
        </p>
      </div>

      {/* Right — interactive estimator */}
      <Card className="p-6 md:p-8">
        <h3 className="font-heading text-xl">Estimate your monthly bill</h3>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Drag to see what a given monthly event volume would cost.
        </p>
        <PricingCalculator
          actionLabel="Start for free"
          onAction={() => {
            posthog.capture("cta_clicked", { cta: "get_started", location: "pricing_calculator" })
            window.open("https://app.honch.io/register", "_blank", "noopener,noreferrer")
          }}
        />
      </Card>
    </div>
  )
}
