"use client"

import posthog from "posthog-js"
import { ChevronRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
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
              Everything is pay-per-use:{" "}
              <span className="font-medium text-foreground">$30 per million events</span>,
              with a free tier that covers small fleets and early prototypes. Plenty of
              teams run free for a long time.
            </p>
            <p>
              The price only drops as you scale, so you always know what you&rsquo;ll
              pay. Drag the slider to estimate yours.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://cal.com/honch/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => posthog.capture("cta_clicked", { cta: "talk_to_sales", location: "pricing_header" })}
              className={buttonVariants({ size: "lg" })}
            >
              Talk to sales <ChevronRight />
            </a>
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
