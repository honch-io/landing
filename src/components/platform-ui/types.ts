/* -------------------------------------------------------------------------- */
/*  Types lifted verbatim from the Honch platform app (wailing-wall/frontend). */
/*  These mirror the real API shapes so the vendored UI renders exactly as it  */
/*  does in production — only the data is mocked. Hooks/fetch are intentionally */
/*  NOT copied; the panels receive these as props.                             */
/* -------------------------------------------------------------------------- */

/** Source: hooks/api/events.ts */
export interface RawEvent {
  id: string
  event: string
  distinctId: string
  properties: Record<string, unknown>
  timestamp: string
  receivedAt: string
  deviceId: string | null
  deviceModel: string | null
  firmwareVersion: string | null
  sessionId: string | null
  sdkPlatform: string | null
  environment: string | null
  [key: string]: unknown
}

/** Source: hooks/api/events.ts */
export interface ProjectSession {
  sessionId: string
  startTime: string
  endTime: string
  durationMs: number
  eventCount: number
  deviceId: string | null
  deviceModel: string | null
  distinctId: string
  firmwareVersion?: string | null
  sdkPlatform?: string | null
  environment?: string | null
}

/** Source: hooks/api/cohorts.ts */
export type CohortType = "device" | "person"
export type MaterializationType = "dynamic" | "static"

export type CohortConditionOp =
  | "eq"
  | "neq"
  | "in"
  | "not_in"
  | "ilike"
  | "is_null"
  | "is_not_null"

export interface CohortCondition {
  field: string
  op: CohortConditionOp
  value?: string | string[] | number | boolean | null
}

export interface CohortFilter {
  matchType: "all" | "any"
  conditions: CohortCondition[]
}

export interface Cohort {
  id: string
  projectId: string
  name: string
  slug: string
  description: string
  type: CohortType
  materializationType: MaterializationType
  filter: CohortFilter
  isSystem: boolean
  memberCount: number | null
  version: number
  isCalculating: boolean
  lastCalculatedAt: string | null
  lastError: string | null
  createdAt: string
  updatedAt: string
}

/** Source: hooks/api/devices.ts */
export interface Device {
  id: string
  deviceId: string
  deviceModel: string | null
  deviceModelId: string | null
  hardwareRevision: string | null
  currentFirmwareVersion: string | null
  sdkPlatform: string | null
  lastEnvironment: string | null
  lastSeenPersonId: string | null
  firstSeenAt: string | null
  lastSeenAt: string | null
}
