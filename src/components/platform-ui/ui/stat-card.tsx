import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: ReactNode
  sub?: string
}) {
  return (
    <Card className="p-4">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="mt-1.5 truncate font-bold text-2xl text-foreground tabular-nums">
        {value}
      </span>
      {sub && <span className="mt-1 text-muted-foreground text-xs">{sub}</span>}
    </Card>
  )
}
