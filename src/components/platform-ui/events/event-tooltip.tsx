import type React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { getPhosphorIcon } from "../phosphor-map"

export interface EventDefinitionInfo {
  name: string
  displayName?: string
  description?: string
  icon?: string
}

/** Honch-defined events use a `$` prefix (e.g. `$pageview`). */
function isHonchEvent(eventName: string): boolean {
  return eventName.startsWith("$")
}

const SESSION_LIFECYCLE_EVENTS = new Set(["$session_start", "$session_end"])
function isSessionLifecycleEvent(eventName: string): boolean {
  return SESSION_LIFECYCLE_EVENTS.has(eventName)
}

/** The Honch brand mark, used to identify Honch events in the UI. */
function HonchEventMark({ className }: { className?: string }) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={cn("shrink-0 rounded-[3px]", className)}
      draggable={false}
      src="/icon.svg"
    />
  )
}

function getDisplayName(eventName: string, def?: EventDefinitionInfo): string {
  if (def?.displayName) return def.displayName
  return isHonchEvent(eventName) ? eventName.slice(1) : eventName
}

export function EventTooltip({
  eventName,
  definition,
  children,
}: {
  eventName: string
  definition?: EventDefinitionInfo
  children: React.ReactNode
}) {
  const display = getDisplayName(eventName, definition)

  return (
    <Tooltip>
      <TooltipTrigger className="max-w-full text-left">
        {children}
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={12} className="w-64 p-0">
        {/* Header — icon + display name */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-2.5">
          {(() => {
            if (isSessionLifecycleEvent(eventName)) {
              return <HonchEventMark className="size-4.5" />
            }
            const IconComp = definition?.icon
              ? getPhosphorIcon(definition.icon)
              : undefined
            if (IconComp) {
              return <IconComp className="size-4.5 shrink-0" aria-hidden="true" />
            }
            return isHonchEvent(eventName) ? (
              <HonchEventMark className="size-4.5" />
            ) : null
          })()}
          <span className="text-sm font-semibold text-popover-foreground truncate">
            {display}
          </span>
        </div>

        {/* Description */}
        {definition?.description && (
          <div className="border-t border-border px-3 py-2.5">
            <p className="text-xs text-popover-foreground leading-relaxed">
              {definition.description}
            </p>
          </div>
        )}

        {/* Sent as */}
        <div className="border-t border-border px-3 py-2.5">
          <span className="text-xs text-popover-foreground">
            Sent as <code className="font-mono text-xs">{eventName}</code>
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export {
  getDisplayName as getEventDisplayName,
  HonchEventMark,
  isHonchEvent,
  isSessionLifecycleEvent,
}
