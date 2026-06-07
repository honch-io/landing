"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { DataTable } from "./data-table/data-table"
import { compactEventColumns } from "./events/event-columns"
import { EVENT_DEFS, LIVE_EVENTS, STREAM_POOL, streamEvent } from "./mock"
import type { RawEvent } from "./types"

/**
 * A real slice of the platform's Events tab: the live activity feed.
 *
 * New events stream in at the top on an interval — purposeful continuity, not
 * a decorative pulse. Hovering the feed pauses the stream so a row can be read
 * or expanded; it also pauses off-screen and for `prefers-reduced-motion`.
 */
export function LiveEventsPanel({
  events = LIVE_EVENTS,
  streamIntervalMs = 3000,
  maxRows = 8,
  className,
}: {
  events?: RawEvent[]
  streamIntervalMs?: number
  maxRows?: number
  className?: string
}) {
  const [rows, setRows] = useState<RawEvent[]>(events)
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduced = useReducedMotion()
  const cursor = useRef(0)

  const columns = useMemo(() => compactEventColumns(EVENT_DEFS), [])

  const active = inView && !hovered && !reduced

  useEffect(() => {
    if (!active) return
    const t = setInterval(() => {
      const seed = STREAM_POOL[cursor.current % STREAM_POOL.length]
      cursor.current += 1
      setRows((cur) => [streamEvent(seed), ...cur].slice(0, maxRows))
    }, streamIntervalMs)
    return () => clearInterval(t)
  }, [active, streamIntervalMs, maxRows])

  return (
    <TooltipProvider>
      <div
        ref={ref}
        className={cn("w-full p-3", className)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <DataTable<RawEvent>
          addableColumns={[]}
          allColumnOptions={[]}
          columns={columns}
          containerClassName="overflow-hidden"
          getRowId={(e) => e.id}
          hideColumnMenu
          onAddColumn={() => {}}
          onEditColumn={() => {}}
          onRemoveColumn={() => {}}
          onSortChange={() => {}}
          rows={rows}
          sort={null}
          streaming={!reduced}
        />
      </div>
    </TooltipProvider>
  )
}
