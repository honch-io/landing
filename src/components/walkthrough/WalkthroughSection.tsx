import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { WalkthroughDef } from "./walkthrough.config"
import { RevealGroupOnView, RevealItem } from "./walkthrough-motion"

/**
 * One walkthrough section: a real-UI panel on one side and a serif heading +
 * subtitles on the other, alternating left/right per `side`. On mobile the
 * panel always sits on top. Text and panel reveal as the section scrolls in.
 */
export function WalkthroughSection({
  eyebrow,
  heading,
  subtitles,
  side,
  accent,
  icon: Icon,
  children,
}: WalkthroughDef & { children: ReactNode }) {
  return (
    <section className="px-6 py-24">
      <div
        className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16"
        style={{ "--wt-accent": accent } as CSSProperties}
      >
        {/* Panel */}
        <RevealGroupOnView
          className={cn(
            "min-w-0 order-1",
            side === "left" ? "lg:order-1" : "lg:order-2",
          )}
        >
          <RevealItem>{children}</RevealItem>
        </RevealGroupOnView>

        {/* Copy */}
        <RevealGroupOnView
          className={cn(
            "flex flex-col gap-5 order-2 lg:gap-6",
            side === "left" ? "lg:order-2" : "lg:order-1",
          )}
        >
          <RevealItem>
            <span
              className="inline-flex w-max items-center gap-2 font-semibold text-sm"
              style={{ color: "var(--wt-accent)" }}
            >
              <Icon className="size-4" weight="duotone" />
              {eyebrow}
            </span>
          </RevealItem>
          <RevealItem>
            <h3 className="text-balance font-heading text-3xl md:text-4xl">
              {heading}
            </h3>
          </RevealItem>
          {subtitles.map((s) => (
            <RevealItem key={s}>
              <p className="text-pretty text-lg text-muted-foreground">{s}</p>
            </RevealItem>
          ))}
        </RevealGroupOnView>
      </div>
    </section>
  )
}
