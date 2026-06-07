import { ArrowRight } from "lucide-react"
import NotifyDialog from "./NotifyDialog"
import TrackedLink from "./TrackedLink"

export default function Hero() {
  return (
    <section className="flex px-6 py-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center rounded-3xl bg-card border px-6 md:px-16 overflow-clip min-h-[24rem] lg:min-h-[32rem]">
        <div className="mx-auto flex flex-col items-start justify-center gap-12 py-12 lg:flex-row lg:items-center">
          {/* Left side - Copy */}
          <div className="flex max-w-xl flex-col gap-6 lg:w-1/2">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] text-nowrap">
              Product analytics<br />
              built for hardware,<br />
              not webpages
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl">
              Funnels, retention, and cohorts that understand firmware, fleets, and the
              physical world.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <NotifyDialog>
                Get notified <ArrowRight />
              </NotifyDialog>
              <TrackedLink href="https://cal.com/honch/30min" event="cta_clicked" properties={{ cta: "talk_to_us", location: "hero" }}>
                Talk to us
              </TrackedLink>
            </div>

            <p className="text-sm text-muted-foreground">
              Works with your existing firmware. Ship same day.
            </p>
          </div>

          {/* Right side - Hero image */}
          <div className="flex-1 lg:w-1/2">
            <img
              src="/hero.png"
              alt="Honch dashboard showing device analytics"
              className="w-full scale-110 lg:scale-150 lg:ml-20"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
