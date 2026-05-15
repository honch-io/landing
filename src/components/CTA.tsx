import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import NotifyDialog from "./NotifyDialog"

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
          <Button variant="outline" size="xl" render={<a href="https://cal.com/honch/30min" target="_blank" rel="noopener noreferrer" />}>
            Talk to us
          </Button>
        </div>
      </div>
    </section>
  )
}
