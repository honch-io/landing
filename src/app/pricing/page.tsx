import type { Metadata } from "next"
import { Bug, CircleDollarSign, Gauge } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SectionSeparator from "@/components/SectionSeparator"
import TrackedSection from "@/components/TrackedSection"
import { Card } from "@/components/ui/card"
import TierCards from "@/components/pricing/TierCards"
import ComparisonTable from "@/components/pricing/ComparisonTable"
import UsageSection from "@/components/pricing/UsageSection"
import PricingFaq from "@/components/pricing/PricingFaq"
import PricingCta from "@/components/pricing/PricingCta"

export const metadata: Metadata = {
  title: "Pricing — Honch",
  description:
    "Usage-based product analytics for the hardware you ship. Every plan includes the full analytics suite — you only pay for the event volume you send.",
}

// The billing-model explainer band — three short cards.
const BILLING_POINTS = [
  {
    icon: CircleDollarSign,
    title: "A simple base fee",
    body: "Each plan carries a flat monthly base that bundles a generous block of included events. Pick the tier that fits your fleet.",
  },
  {
    icon: Gauge,
    title: "Graduated overage",
    body: "Go past your included events and the rest meter on a graduated curve — the per-event rate drops as your volume grows.",
  },
  {
    icon: Bug,
    title: "No separate errors SKU",
    body: "Crashes and errors are just events on the same meter. Honch is product analytics, not error tracking — never a surprise line item.",
  },
]

export default function PricingPage() {
  return (
    <div className="relative bg-primary">
      <Navbar />

      {/* Hero — full-width primary background, pulled under the sticky navbar. */}
      <div className="relative -mt-[81px] flex flex-col overflow-hidden bg-primary pt-[81px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-repeat mix-blend-overlay"
          style={{ backgroundImage: "url(/noise-light.png)" }}
        />
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-20 pb-28 text-center">
          <h1 className="font-heading text-5xl text-white md:text-6xl">
            Pricing for the hardware you ship
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Usage-based on events, with every plan including the full analytics
            suite — funnels, retention, cohorts, sessions. You only pay for the
            volume you send, and the rate drops as you scale.
          </p>
        </div>
      </div>

      {/* Zigzag separator: primary → white */}
      <SectionSeparator />

      {/* White content */}
      <div className="bg-background">
        <div className="mx-auto w-full max-w-7xl">
          {/* Billing-model explainer */}
          <section className="px-6 pt-20 pb-4">
            <div className="grid gap-5 md:grid-cols-3">
              {BILLING_POINTS.map(({ icon: Icon, title, body }) => (
                <Card key={title} className="p-6">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Tier cards */}
          <TrackedSection name="pricing_tiers">
            <section className="px-6 py-16">
              <TierCards />
            </section>
          </TrackedSection>

          {/* Comparison table */}
          <TrackedSection name="pricing_comparison">
            <section className="px-6 py-16">
              <div className="mb-8 max-w-2xl">
                <h2 className="font-heading text-3xl md:text-4xl">Compare every plan</h2>
                <p className="mt-3 text-base text-muted-foreground">
                  Every tier ships the full hardware analytics suite — funnels by
                  firmware, retention by hardware revision, sessions. You scale on
                  volume, not on unlocking features you'd expect to have.
                </p>
              </div>
              <ComparisonTable />
            </section>
          </TrackedSection>

          {/* Usage / overage */}
          <TrackedSection name="pricing_usage">
            <section className="px-6 py-16">
              <div className="mb-8 max-w-2xl">
                <h2 className="font-heading text-3xl md:text-4xl">Usage-based overage</h2>
                <p className="mt-3 text-base text-muted-foreground">
                  Beyond your plan's included events, volume meters on a graduated
                  per-event curve. Here's the rate card.
                </p>
              </div>
              <UsageSection />
            </section>
          </TrackedSection>

          {/* FAQ */}
          <TrackedSection name="pricing_faq">
            <section className="px-6 py-16 pb-24">
              <h2 className="mb-8 text-center font-heading text-3xl md:text-4xl">
                Frequently asked questions
              </h2>
              <PricingFaq />
            </section>
          </TrackedSection>
        </div>
      </div>

      {/* Footer CTA band — orange, bridges into the footer */}
      <TrackedSection name="pricing_cta">
        <PricingCta />
      </TrackedSection>

      {/* Footer */}
      <TrackedSection name="footer">
        <Footer />
      </TrackedSection>
    </div>
  )
}
