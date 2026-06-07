import type { DataColumn } from "../data-table/types"
import { relativeTime } from "../mock-time"
import type { RawEvent } from "../types"
import { EventIcon } from "./event-icon"
import {
  type EventDefinitionInfo,
  EventTooltip,
  getEventDisplayName,
} from "./event-tooltip"
import { TimestampTooltip } from "./timestamp-tooltip"

export function truncateMiddle(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  const keep = Math.floor((maxLen - 1) / 2)
  return `${str.slice(0, keep)}…${str.slice(str.length - keep)}`
}

export function dayLabel(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const DEFAULT_EVENT_COLUMN_IDS = [
  "event",
  "distinctId",
  "deviceModel",
  "firmwareVersion",
  "sdkPlatform",
  "timestamp",
]

/* A compact, narrow column set sized to fit inside a walkthrough panel (~510px)
 * without horizontal clipping. The event column flexes to fill remaining space. */
export const COMPACT_EVENT_COLUMN_IDS = [
  "event",
  "deviceModel",
  "firmwareVersion",
  "timestamp",
]

const COMPACT_WIDTHS: Record<string, string> = {
  event: "w-[150px]",
  deviceModel: "w-[84px]",
  firmwareVersion: "w-[76px]",
  timestamp: "w-[84px]",
}

export function compactEventColumns(
  defMap: Map<string, EventDefinitionInfo>,
): DataColumn<RawEvent>[] {
  return buildEventColumns(defMap)
    .filter((c) => COMPACT_EVENT_COLUMN_IDS.includes(c.id))
    .map((c) => ({ ...c, width: COMPACT_WIDTHS[c.id] ?? c.width }))
}

export function buildEventColumns(
  defMap: Map<string, EventDefinitionInfo>,
): DataColumn<RawEvent>[] {
  return [
    {
      id: "event",
      label: "Event",
      width: "w-[280px]",
      cellClassName: "max-w-[280px]",
      getSortValue: (e) => e.event,
      render: (event) => (
        <EventTooltip
          definition={defMap.get(event.event)}
          eventName={event.event}
        >
          <span className="truncate text-sm max-w-[280px] flex items-center gap-2">
            <EventIcon icon={defMap.get(event.event)?.icon} name={event.event} />
            {(() => {
              const d = getEventDisplayName(event.event, defMap.get(event.event))
              return d.length > 40 ? `${d.slice(0, 40)}...` : d
            })()}
          </span>
        </EventTooltip>
      ),
    },
    {
      id: "distinctId",
      label: "Distinct ID",
      width: "w-[140px]",
      cellClassName: "font-mono text-xs text-muted-foreground max-w-[140px]",
      getSortValue: (e) => e.distinctId,
      render: (e) => (
        <span title={e.distinctId}>{truncateMiddle(e.distinctId, 20)}</span>
      ),
    },
    {
      id: "deviceModel",
      label: "Device",
      width: "w-[100px]",
      cellClassName: "text-sm truncate max-w-[100px]",
      getSortValue: (e) => e.deviceModel ?? "",
      render: (e) => e.deviceModel || "-",
    },
    {
      id: "firmwareVersion",
      label: "Firmware",
      width: "w-[80px]",
      cellClassName: "font-mono text-xs text-muted-foreground",
      getSortValue: (e) => e.firmwareVersion ?? "",
      render: (e) => e.firmwareVersion || "-",
    },
    {
      id: "sdkPlatform",
      label: "Source",
      width: "w-[90px]",
      cellClassName: "text-xs text-muted-foreground",
      getSortValue: (e) => e.sdkPlatform ?? "",
      render: (e) => e.sdkPlatform || "-",
    },
    {
      id: "timestamp",
      label: "Time",
      width: "w-[110px]",
      type: "DateTime",
      cellClassName: "whitespace-nowrap text-xs text-muted-foreground",
      getSortValue: (e) => new Date(e.timestamp).getTime(),
      render: (e) => (
        <TimestampTooltip timestamp={e.timestamp}>
          {relativeTime(e.timestamp)}
        </TimestampTooltip>
      ),
    },
    {
      id: "deviceId",
      label: "Device ID",
      width: "w-[140px]",
      cellClassName: "font-mono text-xs text-muted-foreground max-w-[140px]",
      getSortValue: (e) => e.deviceId ?? "",
      render: (e) =>
        e.deviceId ? (
          <span title={e.deviceId}>{truncateMiddle(e.deviceId, 20)}</span>
        ) : (
          "-"
        ),
    },
    {
      id: "sessionId",
      label: "Session ID",
      width: "w-[180px]",
      cellClassName: "font-mono text-xs text-muted-foreground max-w-[180px]",
      getSortValue: (e) => e.sessionId ?? "",
      render: (e) =>
        e.sessionId ? (
          <span title={e.sessionId}>{truncateMiddle(e.sessionId, 24)}</span>
        ) : (
          "-"
        ),
    },
    {
      id: "environment",
      label: "Environment",
      width: "w-[110px]",
      cellClassName: "text-xs text-muted-foreground",
      getSortValue: (e) => e.environment ?? "",
      render: (e) => e.environment || "-",
    },
    {
      id: "receivedAt",
      label: "Received",
      width: "w-[110px]",
      type: "DateTime",
      cellClassName: "whitespace-nowrap text-xs text-muted-foreground",
      getSortValue: (e) => new Date(e.receivedAt).getTime(),
      render: (e) => (
        <TimestampTooltip timestamp={e.receivedAt}>
          {relativeTime(e.receivedAt)}
        </TimestampTooltip>
      ),
    },
  ]
}
