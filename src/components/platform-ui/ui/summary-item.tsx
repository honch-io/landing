import type { ReactNode } from "react"

export function SummaryItem({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="min-w-0 text-foreground text-sm">{children}</div>
    </div>
  )
}
