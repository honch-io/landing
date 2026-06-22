"use client"

import posthog from "posthog-js"
import { Card } from "@/components/ui/card"
import { PricingCalculator } from "./PricingCalculator"

export default function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left — copy */}
        <div>
          <h2 className="font-heading text-4xl md:text-5xl">Usage-based pricing</h2>
          <div className="mt-5 max-w-md space-y-4 text-base text-muted-foreground">
            <p>Honch is built so pricing is the last thing you have to think about.</p>
            <p>
              Everything is pay-per-event, and the rate drops the more you send. Your first{" "}
              <span className="font-medium text-foreground">1,000 events every month are free</span>.
            </p>
            <p>
              You only pay for what you use, so you always know what you&rsquo;ll pay. Drag
              the slider to estimate yours.
            </p>
            <p>
              Sending more than 250M events a month?{" "}
              <a
                href="https://cal.com/honch/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => posthog.capture("cta_clicked", { cta: "talk_to_sales", location: "pricing" })}
                className="font-medium text-primary hover:underline"
              >
                Talk to sales
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right — interactive calculator */}
        <Card className="p-6 md:p-8">
          <PricingCalculator
            actionLabel="Start for free"
            onAction={() => {
              posthog.capture("cta_clicked", { cta: "get_started", location: "pricing_calculator" })
              window.open("https://app.honch.io/register", "_blank", "noopener,noreferrer")
            }}
          />
        </Card>
      </div>
    </section>
  )
}
