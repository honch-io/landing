"use client"

import { ArrowRight } from "lucide-react"
import { CalendarBlank } from "@phosphor-icons/react"
import TrackedLink from "@/components/TrackedLink"

export default function PricingCta() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-repeat mix-blend-overlay"
        style={{ backgroundImage: "url(/noise-light.png)" }}
      />

      {/* Wave: white content above into the orange banner */}
      <svg aria-hidden className="relative z-10 block h-5 w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pricing-cta-wave" width="36" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 0 H36 V10 Q27 4 18 10 Q9 16 0 10 Z" style={{ fill: "var(--background)" }} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pricing-cta-wave)" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center">
        <h2 className="font-heading text-4xl md:text-5xl">
          Start free. Pay only as your fleet scales.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
          Every plan ships with the full hardware analytics suite. Send your first
          events in minutes, and only pay for the volume you send.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <TrackedLink
            href="https://app.honch.io/register"
            event="cta_clicked"
            properties={{ cta: "start_free", location: "pricing_footer" }}
            variant="default"
            className="border-white bg-white text-primary shadow-[0_1px_2px_0_#0000001f,0_4px_10px_-2px_#00000026,inset_0_-1px_0_0_#0000000d] hover:bg-white/90 data-pressed:bg-white/90"
          >
            Start free <ArrowRight />
          </TrackedLink>
          <TrackedLink
            href="https://cal.com/honch/30min"
            event="cta_clicked"
            properties={{ cta: "talk_to_sales", location: "pricing_footer" }}
            className="border-white/40 bg-transparent text-white shadow-none hover:bg-white/10 data-pressed:bg-white/10"
          >
            Talk to sales <CalendarBlank weight="duotone" />
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
