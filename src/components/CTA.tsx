import { ArrowRight } from "lucide-react"
import NotifyDialog from "./NotifyDialog"
import TrackedLink from "./TrackedLink"

export default function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="rounded-3xl border bg-card px-6 py-16 text-center md:px-16 md:py-24">
        <h2 className="font-heading text-4xl md:text-5xl">
          Product analytics for hardware.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Funnels, retention, and feature adoption for the devices you ship — the analytics layer hardware teams never had.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NotifyDialog>
            Get notified <ArrowRight />
          </NotifyDialog>
          <TrackedLink href="https://cal.com/honch/30min" event="cta_clicked" properties={{ cta: "talk_to_us", location: "cta_section" }}>
            Talk to us
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
