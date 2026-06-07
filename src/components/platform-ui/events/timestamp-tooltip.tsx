import { Check, Copy, Desktop, House, LinuxLogoIcon } from "@phosphor-icons/react"
import type React from "react"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* Vendored from the platform. date-fns / date-fns-tz are replaced with Intl
 * so the landing page needs no extra deps. The popup only mounts on hover
 * (client-side), so local-timezone formatting can't cause a hydration drift. */

function fmt(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date)
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
    >
      {copied ? (
        <Check size={12} aria-hidden="true" />
      ) : (
        <Copy size={12} aria-hidden="true" />
      )}
    </button>
  )
}

export function TimestampTooltip({
  timestamp,
  children,
}: {
  timestamp: string
  children: React.ReactNode
}) {
  const date = new Date(timestamp)
  const localTz =
    Intl.DateTimeFormat().resolvedOptions().timeZone.split("/").pop() ?? ""
  const localAbbr =
    new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? localTz
  const localFormatted = fmt(date)
  const utcFormatted = fmt(date, "UTC")
  const unix = Math.floor(date.getTime() / 1000).toString()

  return (
    <Tooltip>
      <TooltipTrigger className="max-w-full text-left">
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8} className="w-auto p-0">
        {/* Header */}
        <div className="px-3 pt-2.5 pb-1">
          <span className="text-sm font-semibold text-popover-foreground">
            Timezone conversion
          </span>
        </div>

        {/* Rows */}
        <div className="flex flex-col">
          {/* Local */}
          <div className="flex items-center gap-2.5 px-3 py-2">
            <Desktop
              size={14}
              className="shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-popover-foreground">
              Your device
            </span>
            <span className="text-xs text-muted-foreground">{localAbbr}</span>
            <span className="ml-auto text-xs text-popover-foreground whitespace-nowrap">
              {localFormatted}
            </span>
            <CopyButton value={localFormatted} />
          </div>

          {/* UTC */}
          <div className="flex items-center gap-2.5 px-3 py-2">
            <House
              size={14}
              className="shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-popover-foreground">
              Project
            </span>
            <span className="text-xs text-muted-foreground">UTC</span>
            <span className="ml-auto text-xs text-popover-foreground whitespace-nowrap">
              {utcFormatted}
            </span>
            <CopyButton value={utcFormatted} />
          </div>

          {/* UNIX */}
          <div className="flex items-center gap-2.5 px-3 py-2">
            <LinuxLogoIcon
              size={14}
              className="shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-popover-foreground">
              UNIX
            </span>
            <span className="ml-auto font-mono text-xs text-popover-foreground">
              {unix}
            </span>
            <CopyButton value={unix} />
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
