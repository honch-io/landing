"use client"

import {
  ArrowLeft,
  ArrowsClockwise,
  CaretDown,
  CaretRight,
  Check,
  Copy,
  Receipt,
} from "@phosphor-icons/react"
import { type ReactNode, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFrame } from "@/components/ui/card"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DataTable } from "./data-table/data-table"
import { compactEventColumns, dayLabel } from "./events/event-columns"
import { EventDetailInline } from "./events/event-detail-inline"
import { TimestampTooltip } from "./events/timestamp-tooltip"
import { EVENT_DEFS, SESSION, SESSION_EVENTS } from "./mock"
import { formatDuration, relativeTime } from "./mock-time"
import type { ProjectSession, RawEvent } from "./types"

/* A real slice of the platform's Session Profile: summary, stat cards, a
 * collapsible properties card, and the session's event timeline (the same
 * vendored events DataTable as the Live Events panel). Ported from
 * session-profile.tsx with router/query/export coupling stripped. */

function CopyableValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    void navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <span className="group inline-flex min-w-0 items-center gap-1.5">
      <span className="truncate font-mono text-foreground text-sm" title={value}>
        {value}
      </span>
      <button
        aria-label="Copy"
        className="inline-flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground/60 outline-none transition hover:bg-accent hover:text-foreground"
        onClick={copy}
        type="button"
      >
        {copied ? (
          <Check className="size-3.5" weight="bold" />
        ) : (
          <Copy className="size-3.5" weight="bold" />
        )}
      </button>
    </span>
  )
}

function SummaryItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="min-w-0 text-foreground text-sm">{children}</div>
    </div>
  )
}

function StatCard({
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

function SessionProperties({ session }: { session: ProjectSession }) {
  // Collapsed by default in the walkthrough so the event timeline surfaces.
  const [open, setOpen] = useState(false)
  const rows: { label: string; value: string }[] = [
    { label: "Device ID", value: session.deviceId ?? "—" },
    { label: "Device model", value: session.deviceModel ?? "—" },
    { label: "Firmware version", value: session.firmwareVersion ?? "—" },
    { label: "Environment", value: session.environment ?? "—" },
    { label: "Source", value: session.sdkPlatform ?? "—" },
    { label: "Distinct ID", value: session.distinctId },
  ]
  return (
    <Card>
      <Collapsible onOpenChange={setOpen} open={open}>
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left font-semibold text-foreground text-sm outline-none">
          {open ? (
            <CaretDown className="size-4" weight="bold" />
          ) : (
            <CaretRight className="size-4" weight="bold" />
          )}
          Session Properties
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

function SessionEventsTable({
  events,
  eventCount,
}: {
  events: RawEvent[]
  eventCount: number
}) {
  const columns = useMemo(() => compactEventColumns(EVENT_DEFS), [])

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-foreground text-lg">
        Events ({eventCount})
      </h2>
      <CardFrame>
        <DataTable<RawEvent>
          addableColumns={[]}
          allColumnOptions={[]}
          columns={columns}
          containerClassName="overflow-hidden"
          getRowId={(e) => e.id}
          groupLabel={(e) => dayLabel(e.timestamp)}
          hideColumnMenu
          onAddColumn={() => {}}
          onEditColumn={() => {}}
          onRemoveColumn={() => {}}
          onSortChange={() => {}}
          renderExpanded={(e) => <EventDetailInline event={e} />}
          rows={events}
          sort={null}
        />
      </CardFrame>
    </div>
  )
}

export function SessionDetailPanel({
  session = SESSION,
  events = SESSION_EVENTS,
}: {
  session?: ProjectSession
  events?: RawEvent[]
}) {
  return (
    <TooltipProvider>
      <div className="flex w-full flex-col">
        <div className="flex items-center gap-3 border-border border-b px-4 py-3">
          <Button aria-label="Back to sessions" size="icon-sm" variant="ghost">
            <ArrowLeft />
          </Button>
          <Receipt className="size-5 text-muted-foreground" weight="bold" />
          <h1 className="font-semibold text-foreground text-lg">
            Session Profile
          </h1>
          <Button className="ml-auto" size="sm" variant="outline">
            <ArrowsClockwise />
            Refresh
          </Button>
        </div>

        <div className="flex flex-col gap-5 p-4">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <SummaryItem label="Device">
              <span className="font-medium">{session.deviceModel ?? "—"}</span>
              {session.deviceId && (
                <span className="ml-2 font-mono text-muted-foreground text-xs">
                  {session.deviceId}
                </span>
              )}
            </SummaryItem>
            <SummaryItem label="Session ID">
              <CopyableValue value={session.sessionId} />
            </SummaryItem>
            <SummaryItem label="Distinct ID">
              <span className="font-mono text-xs">{session.distinctId}</span>
            </SummaryItem>
            <SummaryItem label="Start time">
              <TimestampTooltip timestamp={session.startTime}>
                {relativeTime(session.startTime)}
              </TimestampTooltip>
            </SummaryItem>
            <SummaryItem label="End time">
              <TimestampTooltip timestamp={session.endTime}>
                {relativeTime(session.endTime)}
              </TimestampTooltip>
            </SummaryItem>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Duration"
              sub={`${Math.round(session.durationMs / 1000)} seconds`}
              value={formatDuration(session.durationMs)}
            />
            <StatCard label="Total Events" value={session.eventCount} />
            <StatCard
              label="Firmware version"
              value={session.firmwareVersion ?? "—"}
            />
          </div>

          <SessionProperties session={session} />

          <SessionEventsTable
            eventCount={session.eventCount}
            events={events}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}
