"use client"

import { ArrowRight } from "lucide-react"
import { CalendarBlank } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import TrackedLink from "./TrackedLink"
import InstallCommand from "./InstallCommand"

export default function Hero() {
  return (
    <section className="flex items-center justify-center mt-20 pb-32">
      <div className="text-center flex max-w-2xl flex-col gap-6">
        <h1 className="font-heading text-5xl md:text-6xl lg:text-[4rem] text-white">
          Product analytics for the{" "}
          <span className="relative inline-block">
            hardware
            <svg
              aria-hidden
              viewBox="0 0 300 20"
              preserveAspectRatio="none"
              fill="none"
              className="pointer-events-none absolute -bottom-[0.28em] left-0 h-[0.32em] w-full overflow-visible"
            >
              <path
                d="M4 11 Q150 0 296 12"
                stroke="currentColor"
                strokeWidth={4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: 1,
                  animation: "hero-underline 0.4s cubic-bezier(0.33, 1, 0.68, 1) 0.35s forwards",
                }}
              />
            </svg>
          </span>{" "}
          you ship
        </h1>
        <style>{`@keyframes hero-underline { to { stroke-dashoffset: 0; } }`}</style>

        <p className="text-lg text-white/80 md:text-xl">
          Funnels, retention, cohorts, and feature adoption for the connected
          products you ship. Made for devices, not browsers.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <Button
            size="xl"
            className="border-white bg-white text-primary shadow-[0_1px_2px_0_#0000001f,0_4px_10px_-2px_#00000026,inset_0_-1px_0_0_#0000000d] hover:bg-white/90 data-pressed:bg-white/90"
            render={<a href={"https://app.honch.io/register"} target="_blank" rel="noopener noreferrer" />}
          >
            Start for Free <ArrowRight />
          </Button>
          <TrackedLink
            href="https://cal.com/honch/30min"
            event="cta_clicked"
            properties={{ cta: "book_a_demo", location: "hero" }}
            className="border-white/40 bg-transparent text-white shadow-none hover:bg-white/10 data-pressed:bg-white/10"
          >
            Book a demo <CalendarBlank weight="duotone" />
          </TrackedLink>
        </div>

        <InstallCommand />
      </div>
    </section>
  )
}
