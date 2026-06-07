"use client"

import { ArrowLeft, ArrowsClockwise, DeviceMobile } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TimestampTooltip } from "./events/timestamp-tooltip"
import { DEVICE_PROFILE, type DeviceProfileMock } from "./mock"
import { relativeTime } from "./mock-time"
import { CopyableValue } from "./ui/copyable-value"
import { PropertiesCard } from "./ui/properties-card"
import { StatCard } from "./ui/stat-card"
import { SummaryItem } from "./ui/summary-item"

/* A real slice of the platform's Device Profile: the per-device "at a glance"
 * view — header, summary row, stat grid, and a collapsible properties card.
 * Ported from device-profile.tsx; the session/event tables are out of scope
 * for this slice. */

const nf = new Intl.NumberFormat("en-US")

function fmtRelative(value: string | null): string {
  if (!value) return "—"
  return relativeTime(value)
}

export function DeviceProfilePanel({
  device = DEVICE_PROFILE,
}: {
  device?: DeviceProfileMock
}) {
  return (
    <TooltipProvider>
      <div className="flex flex-col">
        <div className="flex items-center gap-3 border-border border-b px-4 py-3">
          <Button aria-label="Back to devices" size="icon-sm" variant="ghost">
            <ArrowLeft />
          </Button>
          <DeviceMobile className="size-5 text-muted-foreground" weight="bold" />
          <h1 className="min-w-0 font-semibold text-foreground text-lg">
            <CopyableValue className="text-base" value={device.deviceId} />
          </h1>
          <Button className="ml-auto" size="sm" variant="outline">
            <ArrowsClockwise />
            Refresh
          </Button>
        </div>

        <div className="flex flex-col gap-5 p-4">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <SummaryItem label="Model">
              <span className="font-medium">{device.deviceModel ?? "—"}</span>
            </SummaryItem>
            <SummaryItem label="Hardware revision">
              <span className="font-mono text-xs">
                {device.hardwareRevision ?? "—"}
              </span>
            </SummaryItem>
            <SummaryItem label="Source">{device.sdkPlatform ?? "—"}</SummaryItem>
            <SummaryItem label="Environment">
              {device.lastEnvironment ?? "—"}
            </SummaryItem>
            <SummaryItem label="First seen">
              <TimestampTooltip timestamp={device.firstSeenAt}>
                {fmtRelative(device.firstSeenAt)}
              </TimestampTooltip>
            </SummaryItem>
            <SummaryItem label="Last seen">
              <TimestampTooltip timestamp={device.lastSeenAt}>
                {fmtRelative(device.lastSeenAt)}
              </TimestampTooltip>
            </SummaryItem>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Sessions" value={nf.format(device.totalSessions)} />
            <StatCard label="Total Events" value={nf.format(device.totalEvents)} />
            <StatCard
              label="Firmware version"
              value={device.currentFirmwareVersion ?? "—"}
            />
          </div>

          <PropertiesCard
            rows={[
              { label: "Device ID", value: device.deviceId },
              { label: "Device model", value: device.deviceModel ?? "—" },
              {
                label: "Hardware revision",
                value: device.hardwareRevision ?? "—",
              },
              {
                label: "Firmware version",
                value: device.currentFirmwareVersion ?? "—",
              },
              { label: "Source", value: device.sdkPlatform ?? "—" },
              { label: "Environment", value: device.lastEnvironment ?? "—" },
              { label: "First seen", value: fmtRelative(device.firstSeenAt) },
              { label: "Last seen", value: fmtRelative(device.lastSeenAt) },
            ]}
            title="Device Properties"
          />
        </div>
      </div>
    </TooltipProvider>
  )
}
