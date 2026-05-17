"use client"

import posthog from "posthog-js"
import { ChevronDownIcon } from "lucide-react"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
  FrameDescription,
} from "@/components/ui/frame"

const faqs = [
  {
    question: "Why not just use Mixpanel or Amplitude?",
    answer:
      "They assume your users are in a browser. Your users aren't. Hardware devices go offline for days, send events out of order, run across multiple owners over years, and don't have \"sessions\" in any way a web tool understands. You'll spend more time fighting the tool than learning from it. We built Honch so you don't have to.",
  },
  {
    question: "How is this different from Memfault?",
    answer:
      "Memfault tells your firmware team what crashed. Honch tells your product team what's getting used. Different audience, different questions. A lot of teams will run both — Memfault for reliability, Honch for product decisions.",
  },
  {
    question: "My devices go offline. Does that break anything?",
    answer:
      "No. Events queue on-device and sync when connectivity comes back. Every event carries the timestamp from when it actually happened, so your funnels and retention curves stay accurate even if data arrives weeks late. We built the whole system assuming offline is the default.",
  },
  {
    question: "What about devices that only connect through a phone app?",
    answer:
      "Earbuds, wearables, pet trackers — we get it. The device SDK queues events locally and hands them off as a payload to your companion app. The app SDK forwards them to our cloud next time the user opens it. We don't touch your BLE stack or transport layer. Just a payload on top of whatever pairing you already have.",
  },
  {
    question: "Will this slow down my device or kill battery life?",
    answer:
      "No. Events are batched and compressed. The queue is bounded and configurable. The SDK never blocks your main loop. We benchmark against ESP32-class hardware every release — expect well under 1% overhead on CPU, RAM, and bandwidth.",
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="px-6 py-24">
      <h2 className="mx-auto max-w-3xl text-center font-heading text-4xl md:text-5xl">
        Frequently asked questions
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
        Everything you need to know about Honch.
      </p>

      <div className="mx-auto mt-12 max-w-3xl">
        <Frame className="w-full">
          <FrameHeader>
            <FrameTitle>FAQ</FrameTitle>
            <FrameDescription>Common questions from hardware teams</FrameDescription>
          </FrameHeader>
          {faqs.map((faq, index) => (
            <Collapsible key={index} onOpenChange={(open) => { if (open) posthog.capture("faq_opened", { question: faq.question }) }}>
              <FramePanel>
                <CollapsibleTrigger
                  className="flex w-full cursor-pointer items-center justify-between gap-3 text-left data-panel-open:[&_svg]:rotate-180"
                  render={<button />}
                >
                  <h3 className="font-semibold text-sm">{faq.question}</h3>
                  <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </CollapsibleTrigger>
                <CollapsiblePanel>
                  <p className="mt-2 text-muted-foreground text-sm">{faq.answer}</p>
                </CollapsiblePanel>
              </FramePanel>
            </Collapsible>
          ))}
        </Frame>
      </div>
    </section>
  )
}
