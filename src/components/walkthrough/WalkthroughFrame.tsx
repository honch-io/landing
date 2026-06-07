import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * The "vertical slice" window: a Card with macOS-style chrome dots and a
 * fixed-height clip viewport, so a real product panel reads as a slice of a
 * larger app. The edge gradients soften the cut into "there's more app beyond"
 * rather than a hard crop. Popups/tooltips portal to the body, so they escape
 * the clip.
 */
export function WalkthroughFrame({
  children,
  clip = "bottom",
  chrome = true,
  className,
  heightClassName = "h-[400px] lg:h-[460px]",
}: {
  children: ReactNode
  clip?: "bottom" | "both"
  chrome?: boolean
  className?: string
  /** Clip-viewport height. Override for taller panels (e.g. builder + funnel). */
  heightClassName?: string
}) {
  return (
    <Card className={cn("relative overflow-hidden p-0", className)}>
      {chrome && (
        <div className="flex shrink-0 items-center gap-1.5 border-border border-b px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
      )}
      <div className={cn("relative overflow-hidden", heightClassName)}>
        {children}
        {/* Bottom fade — the slice continues below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
        {/* Right fade — for panels wider than the frame (tables) */}
        {clip === "both" && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent" />
        )}
      </div>
    </Card>
  )
}
