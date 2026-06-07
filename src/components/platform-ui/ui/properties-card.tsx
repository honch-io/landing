"use client"

import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export interface PropertyRow {
  label: string
  value: string
}

export function PropertiesCard({
  title,
  rows,
  defaultOpen = true,
}: {
  title: string
  rows: PropertyRow[]
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Card>
      <Collapsible onOpenChange={setOpen} open={open}>
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left font-semibold text-foreground text-sm outline-none">
          {open ? (
            <CaretDown className="size-4" weight="bold" />
          ) : (
            <CaretRight className="size-4" weight="bold" />
          )}
          {title}
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <div className="border-border border-t">
            {rows.map((row) => (
              <div
                className="grid grid-cols-[minmax(0,16rem)_minmax(0,1fr)] items-center gap-3 border-border border-b px-4 py-2 last:border-b-0"
                key={row.label}
              >
                <span className="truncate text-[13px] text-muted-foreground">
                  {row.label}
                </span>
                <span className="min-w-0 truncate font-mono text-foreground text-xs">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </CollapsiblePanel>
      </Collapsible>
    </Card>
  )
}
