import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] px-6 py-6">
      <div className="flex flex-1 items-center rounded-3xl bg-card border px-6 md:px-16 overflow-clip">
        <div className="flex flex-col items-start gap-16 py-16 lg:flex-row lg:items-center">
          {/* Left side - Copy */}
          <div className="flex max-w-xl flex-col gap-6 lg:w-1/2">
            <h1 className="font-heading text-5xl md:text-6xl lg:text-[4rem]">
              Product analytics for the hardware you ship
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl">
              Funnels, retention, cohorts, and feature adoption for consumer hardware products.
              Built for the way device data actually works.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="xl">
                Get early access <ArrowRight />
              </Button>
              <Button variant="outline" size="xl" render={<a href="https://cal.com/honch/30min" target="_blank" rel="noopener noreferrer" />}>
                Talk to us
              </Button>
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
              className="w-full scale-150 ml-20"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
