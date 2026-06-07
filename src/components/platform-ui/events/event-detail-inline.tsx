"use client"

import {
  BracketsCurly,
  Check,
  Copy,
  Hash,
  type Icon,
  MagnifyingGlass,
  TextAa,
  ToggleLeft,
} from "@phosphor-icons/react"
import { useMemo, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { formatAbsolute } from "../mock-time"
import { PropertyTypeBadge } from "../property-type-badge"
import type { RawEvent } from "../types"

interface PropRow {
  key: string
  label: string
  value: unknown
}

function typeIcon(value: unknown): Icon {
  if (typeof value === "boolean") return ToggleLeft
  if (typeof value === "number") return Hash
  if (typeof value === "object" && value !== null) return BracketsCurly
  return TextAa
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "null"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === ""
}

function PropertyRow({ row }: { row: PropRow }) {
  const IconComp = typeIcon(row.value)
  const display = formatValue(row.value)
  const empty = isEmpty(row.value)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    void navigator.clipboard?.writeText(display)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="group grid grid-cols-[minmax(0,16rem)_minmax(0,1fr)_auto] items-center gap-3 border-border border-b px-4 py-2 last:border-b-0 hover:bg-accent/40">
      <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
        <IconComp aria-hidden="true" className="size-4 shrink-0" weight="bold" />
        <span className="truncate text-[13px]" title={row.label}>
          {row.label}
        </span>
      </span>
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "min-w-0 truncate font-mono text-foreground text-xs",
            empty && "text-muted-foreground/60",
          )}
          title={display}
        >
          {display}
        </span>
        <PropertyTypeBadge value={row.value} />
      </span>
      <button
        aria-label="Copy value"
        className="inline-flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground/50 opacity-0 outline-none transition group-hover:opacity-100 hover:bg-accent hover:text-foreground focus-visible:opacity-100"
        onClick={copy}
        type="button"
      >
        {copied ? (
          <Check className="size-3.5" weight="bold" />
        ) : (
          <Copy className="size-3.5" weight="bold" />
        )}
      </button>
    </div>
  )
}

function PropertyList({
  rows,
  search,
  hideNull,
  hideHonch,
}: {
  rows: PropRow[]
  search: string
  hideNull: boolean
  hideHonch: boolean
}) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (hideNull && isEmpty(r.value)) return false
      if (hideHonch && r.key.startsWith("$")) return false
      if (q) {
        const haystack = `${r.label} ${formatValue(r.value)}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [rows, search, hideNull, hideHonch])

  if (filtered.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-[13px] text-muted-foreground/60">
        No matching properties
      </p>
    )
  }

  return (
    <div>
      {filtered.map((r) => (
        <PropertyRow key={r.key} row={r} />
      ))}
    </div>
  )
}

/**
 * Inline event detail shown beneath an expanded row in the activity table:
 * a tab strip, a search + filter row, and a flat searchable list of properties.
 */
export function EventDetailInline({ event }: { event: RawEvent }) {
  const [tab, setTab] = useState("properties")
  const [search, setSearch] = useState("")
  const [hideNull, setHideNull] = useState(true)
  const [hideHonch, setHideHonch] = useState(false)

  const props = useMemo(() => event.properties ?? {}, [event.properties])

  const propertyRows = useMemo<PropRow[]>(
    () =>
      Object.entries(props)
        .map(([key, value]) => ({ key, label: key, value }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [props],
  )

  const metadataRows = useMemo<PropRow[]>(
    () => [
      { key: "event", label: "Sent as", value: event.event },
      {
        key: "timestamp",
        label: "Timestamp",
        value: formatAbsolute(event.timestamp),
      },
      {
        key: "receivedAt",
        label: "Received at",
        value: event.receivedAt ? formatAbsolute(event.receivedAt) : null,
      },
      { key: "distinctId", label: "Distinct ID", value: event.distinctId },
      { key: "deviceId", label: "Device ID", value: event.deviceId },
      { key: "deviceModel", label: "Device model", value: event.deviceModel },
      {
        key: "firmwareVersion",
        label: "Firmware version",
        value: event.firmwareVersion,
      },
      { key: "sessionId", label: "Session ID", value: event.sessionId },
      { key: "sdkPlatform", label: "Source", value: event.sdkPlatform },
      { key: "environment", label: "Environment", value: event.environment },
    ],
    [event],
  )

  return (
    <div className="bg-card">
      <div className="border-border border-b px-2">
        <Tabs onValueChange={(v) => setTab(v as string)} value={tab}>
          <TabsList className="gap-x-1" variant="underline">
            <TabsTab value="properties">Properties</TabsTab>
            <TabsTab value="metadata">Metadata</TabsTab>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <InputGroup className="w-72 max-w-full">
          <InputGroupAddon>
            <MagnifyingGlass />
          </InputGroupAddon>
          <InputGroupInput
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search property keys and values"
            size="sm"
            value={search}
          />
        </InputGroup>
        {tab === "properties" && (
          <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-2.5 text-[13px] text-muted-foreground shadow-xs/5 not-dark:bg-clip-padding sm:h-7 dark:bg-input/32">
            <Checkbox
              checked={hideHonch}
              onCheckedChange={(c) => setHideHonch(c === true)}
            />
            Hide Honch properties
          </label>
        )}
        <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-2.5 text-[13px] text-muted-foreground shadow-xs/5 not-dark:bg-clip-padding sm:h-7 dark:bg-input/32">
          <Checkbox
            checked={hideNull}
            onCheckedChange={(c) => setHideNull(c === true)}
          />
          Hide null values
        </label>
      </div>
      <div>
        <PropertyList
          hideHonch={tab === "properties" && hideHonch}
          hideNull={hideNull}
          rows={tab === "metadata" ? metadataRows : propertyRows}
          search={search}
        />
      </div>
    </div>
  )
}
