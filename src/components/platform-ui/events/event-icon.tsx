import { Lightning } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { getPhosphorIcon } from "../phosphor-map"

/**
 * Resolves the icon shown for an event:
 *   1. A custom icon set on the definition → that Phosphor icon
 *   2. Everything else → Lightning fallback
 */
export function EventIcon({
  icon,
  className,
}: {
  name?: string
  icon?: string
  className?: string
}) {
  const CustomIcon = icon ? getPhosphorIcon(icon) : null
  if (CustomIcon) {
    return (
      <CustomIcon
        aria-hidden="true"
        className={cn("size-4 shrink-0 text-muted-foreground", className)}
        weight="bold"
      />
    )
  }

  return (
    <Lightning
      aria-hidden="true"
      className={cn("size-4 shrink-0 text-muted-foreground", className)}
      weight="bold"
    />
  )
}
