import type { EventDefinitionInfo } from "./events/event-tooltip"
import { isoAgo } from "./mock-time"
import type { Cohort, Device, ProjectSession, RawEvent } from "./types"

/* -------------------------------------------------------------------------- */
/*  Hardware-flavored fixtures for the vendored platform UI. Shapes mirror the */
/*  real API types exactly; only the values are invented (a connected espresso */
/*  machine fleet — "Aurora X1", "Nimbus S2", etc.). All timestamps are        */
/*  anchored to the fixed NOW in mock-time.ts so SSR + hydration stay stable.  */
/* -------------------------------------------------------------------------- */

const ENV = "production"

/** Event definitions → drive the per-event icons + tooltips in the table. */
export const EVENT_DEFS = new Map<string, EventDefinitionInfo>(
  (
    [
      {
        name: "brew_started",
        displayName: "Brew started",
        icon: "Coffee",
        description: "A brew cycle began on the machine.",
      },
      {
        name: "brew_completed",
        displayName: "Brew completed",
        icon: "CheckCircle",
        description: "A brew cycle finished and dispensed.",
      },
      {
        name: "eco_mode_enabled",
        displayName: "Eco mode enabled",
        icon: "Leaf",
        description: "Power-saving mode switched on.",
      },
      {
        name: "firmware_update_applied",
        displayName: "Firmware update applied",
        icon: "DownloadSimple",
        description: "Device finished flashing a new firmware build.",
      },
      {
        name: "wifi_reconnected",
        displayName: "Wi-Fi reconnected",
        icon: "WifiHigh",
        description: "Device re-established its network connection.",
      },
      {
        name: "wifi_connected",
        displayName: "Wi-Fi connected",
        icon: "WifiHigh",
      },
      {
        name: "temp_setpoint_changed",
        displayName: "Temp setpoint changed",
        icon: "Thermometer",
        description: "The target brew temperature was adjusted.",
      },
      {
        name: "sleep_entered",
        displayName: "Sleep entered",
        icon: "Moon",
        description: "Device dropped into low-power sleep.",
      },
      {
        name: "descale_reminder_shown",
        displayName: "Descale reminder shown",
        icon: "Drop",
        description: "A descaling reminder was surfaced on-device.",
      },
      {
        name: "descale_check_passed",
        displayName: "Descale check passed",
        icon: "Drop",
      },
      { name: "power_on", displayName: "Power on", icon: "Power" },
      { name: "power_off", displayName: "Power off", icon: "Power" },
    ] satisfies EventDefinitionInfo[]
  ).map((d) => [d.name, d]),
)

let _eid = 0
const eid = () => `evt_${(_eid++).toString(16).padStart(8, "0")}`

interface SeedEvent {
  event: string
  distinctId: string
  deviceId: string
  deviceModel: string
  firmwareVersion: string
  sdkPlatform: string
  sessionId: string
  properties: Record<string, unknown>
  ago: number
}

function toRawEvent(s: SeedEvent): RawEvent {
  return {
    id: eid(),
    event: s.event,
    distinctId: s.distinctId,
    properties: s.properties,
    timestamp: isoAgo(s.ago),
    receivedAt: isoAgo(Math.max(0, s.ago - 1)),
    deviceId: s.deviceId,
    deviceModel: s.deviceModel,
    firmwareVersion: s.firmwareVersion,
    sessionId: s.sessionId,
    sdkPlatform: s.sdkPlatform,
    environment: ENV,
  }
}

const AURORA = {
  distinctId: "dev_8f3a2c9b41e7",
  deviceId: "device_8f3a2c9b41e7",
  deviceModel: "Aurora X1",
  firmwareVersion: "v2.4.1",
  sdkPlatform: "esp-idf",
  sessionId: "sess_01HQ9F2K7M",
}
const NIMBUS = {
  distinctId: "dev_c4d9e1772a05",
  deviceId: "device_c4d9e1772a05",
  deviceModel: "Nimbus S2",
  firmwareVersion: "v1.8.0",
  sdkPlatform: "zephyr",
  sessionId: "sess_01HQ9E5P3T",
}
const PULSE = {
  distinctId: "dev_a1b2c3d4e5f6",
  deviceId: "device_a1b2c3d4e5f6",
  deviceModel: "Pulse Mini",
  firmwareVersion: "v0.9.4",
  sdkPlatform: "arduino",
  sessionId: "sess_01HQ9D8W2Q",
}
const HALO = {
  distinctId: "dev_77c0ffee1234",
  deviceId: "device_77c0ffee1234",
  deviceModel: "Halo Band",
  firmwareVersion: "v3.1.2",
  sdkPlatform: "nrf-connect",
  sessionId: "sess_01HQ9C1A8B",
}

/** The live activity feed — newest first. */
export const LIVE_EVENTS: RawEvent[] = [
  {
    ...AURORA,
    event: "brew_started",
    properties: { recipe: "espresso", water_ml: 36, temp_c: 93 },
    ago: 2,
  },
  {
    ...AURORA,
    event: "eco_mode_enabled",
    properties: { trigger: "idle_timeout", idle_min: 15 },
    ago: 9,
  },
  {
    ...NIMBUS,
    event: "firmware_update_applied",
    properties: { from: "v1.7.3", to: "v1.8.0", duration_ms: 41200 },
    ago: 18,
  },
  {
    ...AURORA,
    event: "descale_reminder_shown",
    properties: { cycles_since: 312 },
    ago: 41,
  },
  {
    ...PULSE,
    event: "wifi_reconnected",
    properties: { rssi: -67, attempt: 3 },
    ago: 72,
  },
  {
    ...NIMBUS,
    event: "temp_setpoint_changed",
    properties: { from_c: 92, to_c: 96 },
    ago: 130,
  },
  {
    ...AURORA,
    firmwareVersion: "v2.4.0",
    event: "brew_completed",
    properties: { recipe: "latte", yield_ml: 220, duration_s: 38 },
    ago: 190,
  },
  {
    ...HALO,
    event: "sleep_entered",
    properties: { battery_pct: 41, reason: "schedule" },
    ago: 300,
  },
].map(toRawEvent)

/** Extra events the live panel rotates through when streaming new rows in. */
export const STREAM_POOL: SeedEvent[] = [
  {
    ...AURORA,
    event: "brew_started",
    properties: { recipe: "cappuccino", water_ml: 60, temp_c: 94 },
    ago: 0,
  },
  {
    ...PULSE,
    event: "brew_completed",
    properties: { recipe: "americano", yield_ml: 180, duration_s: 29 },
    ago: 0,
  },
  {
    ...NIMBUS,
    event: "wifi_reconnected",
    properties: { rssi: -58, attempt: 1 },
    ago: 0,
  },
  {
    ...AURORA,
    event: "temp_setpoint_changed",
    properties: { from_c: 93, to_c: 90 },
    ago: 0,
  },
  {
    ...HALO,
    event: "eco_mode_enabled",
    properties: { trigger: "manual" },
    ago: 0,
  },
  {
    ...NIMBUS,
    event: "descale_reminder_shown",
    properties: { cycles_since: 280 },
    ago: 0,
  },
]

/** Turn a pool seed into a fresh "just arrived" event (re-stamped to now). */
export function streamEvent(seed: SeedEvent): RawEvent {
  return toRawEvent({ ...seed, ago: 0 })
}

/* ----------------------------- Sessions ---------------------------------- */

export const SESSION: ProjectSession = {
  sessionId: "sess_01HQ9F2K7M",
  startTime: isoAgo(372 + 120),
  endTime: isoAgo(120),
  durationMs: 372_000,
  eventCount: 9,
  deviceId: "device_8f3a2c9b41e7",
  deviceModel: "Aurora X1",
  distinctId: "dev_8f3a2c9b41e7",
  firmwareVersion: "v2.4.1",
  sdkPlatform: "esp-idf",
  environment: ENV,
}

/** The timeline of events inside SESSION — oldest first (chronological). */
export const SESSION_EVENTS: RawEvent[] = [
  { ...AURORA, event: "power_on", properties: { source: "button" }, ago: 372 + 118 },
  { ...AURORA, event: "wifi_connected", properties: { ssid: "Roastery-5G", rssi: -52 }, ago: 372 + 110 },
  { ...AURORA, event: "descale_check_passed", properties: { cycles_since: 12 }, ago: 372 + 96 },
  { ...AURORA, event: "brew_started", properties: { recipe: "espresso", water_ml: 36 }, ago: 372 + 70 },
  { ...AURORA, event: "brew_completed", properties: { recipe: "espresso", yield_ml: 36, duration_s: 27 }, ago: 372 + 43 },
  { ...AURORA, event: "eco_mode_enabled", properties: { trigger: "idle_timeout" }, ago: 240 },
  { ...AURORA, event: "temp_setpoint_changed", properties: { from_c: 93, to_c: 96 }, ago: 180 },
  { ...AURORA, event: "brew_started", properties: { recipe: "latte", water_ml: 60 }, ago: 150 },
  { ...AURORA, event: "power_off", properties: { reason: "user" }, ago: 120 },
]
  .map(toRawEvent)
  .reverse() // table renders newest-first like the real session view

/* ----------------------------- Cohorts ----------------------------------- */

const PROJECT_ID = "proj_honch_demo"

function cohort(c: Partial<Cohort> & Pick<Cohort, "id" | "name">): Cohort {
  return {
    projectId: PROJECT_ID,
    slug: c.name.toLowerCase().replace(/\s+/g, "_"),
    description: "",
    type: "device",
    materializationType: "dynamic",
    filter: { matchType: "all", conditions: [] },
    isSystem: false,
    memberCount: null,
    version: 4,
    isCalculating: false,
    lastCalculatedAt: isoAgo(360),
    lastError: null,
    createdAt: isoAgo(60 * 60 * 24 * 21),
    updatedAt: isoAgo(360),
    ...c,
  }
}

export const COHORTS: Cohort[] = [
  cohort({
    id: "c1",
    name: "Daily brewers",
    description: "5+ brews/day, last 14 days",
    memberCount: 4182,
    isSystem: true,
    filter: { matchType: "all", conditions: [{ field: "deviceModel", op: "eq", value: "X1" }] },
  }),
  cohort({
    id: "c2",
    name: "Eco-mode users",
    description: "Power-saving enabled",
    memberCount: 1536,
    isSystem: true,
  }),
  cohort({
    id: "c3",
    name: "Espresso drinkers",
    description: "Espresso as default drink",
    type: "person",
    memberCount: 312,
  }),
  cohort({
    id: "c4",
    name: "Churn risk",
    description: "No brew in 14 days",
    materializationType: "static",
    memberCount: 884,
    lastCalculatedAt: null,
    filter: { matchType: "any", conditions: [{ field: "lastEnvironment", op: "eq", value: "production" }] },
  }),
  cohort({
    id: "c5",
    name: "Beta firmware",
    description: "Running v2.5.0-rc",
    memberCount: 47,
    isCalculating: true,
    lastCalculatedAt: null,
    filter: { matchType: "all", conditions: [{ field: "currentFirmwareVersion", op: "ilike", value: "2.5.0" }] },
  }),
]

/** Seed for the interactive condition builder (Section 2 showpiece). */
export const COHORT_BUILDER_SEED: Cohort = cohort({
  id: "c1",
  name: "Daily brewers",
  description: "Owners who brew 5+ times a day over the last 14 days",
  memberCount: 4182,
  filter: {
    matchType: "all",
    conditions: [
      { field: "deviceModel", op: "eq", value: "X1" },
      { field: "currentFirmwareVersion", op: "ilike", value: "2.4" },
      { field: "lastEnvironment", op: "neq", value: "staging" },
    ],
  },
})

/* --------------------------- Device profile ------------------------------ */

export interface DeviceProfileMock
  extends Pick<
    Device,
    | "deviceId"
    | "deviceModel"
    | "hardwareRevision"
    | "currentFirmwareVersion"
    | "sdkPlatform"
    | "lastEnvironment"
  > {
  firstSeenAt: string
  lastSeenAt: string
  totalSessions: number
  totalEvents: number
}

export const DEVICE_PROFILE: DeviceProfileMock = {
  deviceId: "device_8f3a2c9b41e7",
  deviceModel: "Aurora X1",
  hardwareRevision: "C3",
  currentFirmwareVersion: "v2.4.1",
  sdkPlatform: "esp-idf",
  lastEnvironment: "production",
  firstSeenAt: isoAgo(60 * 60 * 24 * 243),
  lastSeenAt: isoAgo(120),
  totalSessions: 1204,
  totalEvents: 48_310,
}

/* ------------------------------- Funnel ---------------------------------- */

export interface FunnelStep {
  label: string
  count: number
  caption?: string
}

export const FUNNEL: { title: string; window: string; steps: FunnelStep[] } = {
  title: "Activation funnel",
  window: "Last 30 days",
  steps: [
    { label: "Unboxed", count: 12_643, caption: "first power cycle" },
    { label: "Powered on", count: 12_107, caption: "median 2m" },
    { label: "Paired", count: 9642, caption: "companion app" },
    { label: "First brew", count: 7458, caption: "median 14m" },
    { label: "Daily use", count: 2382, caption: "≥1 brew/day · 7d" },
  ],
}
