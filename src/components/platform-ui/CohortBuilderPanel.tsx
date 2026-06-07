"use client"

import { Copy, Plus, Trash } from "@phosphor-icons/react"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardFrame } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DetailHeader } from "./ui/detail-header"
import { COHORT_BUILDER_SEED } from "./mock"
import type {
  Cohort,
  CohortCondition,
  CohortConditionOp,
  CohortFilter,
  CohortType,
} from "./types"

/* The interactive cohort condition builder, ported from the platform's
 * cohort-detail page. All state is local — edits to the title, description,
 * match type, and criteria genuinely work; Save commits to a local baseline
 * (no network). The verbose materialization section is omitted to keep the
 * slice focused on the criteria builder. */

const DEVICE_FIELDS: { value: string; label: string }[] = [
  { value: "deviceId", label: "Device ID" },
  { value: "deviceModel", label: "Device model" },
  { value: "hardwareRevision", label: "Hardware revision" },
  { value: "currentFirmwareVersion", label: "Firmware version" },
  { value: "sdkPlatform", label: "SDK platform" },
  { value: "lastEnvironment", label: "Environment" },
]

const PERSON_FIELDS: { value: string; label: string }[] = [
  { value: "distinctId", label: "Distinct ID" },
]

const OPS: { value: CohortConditionOp; label: string; needsValue: boolean }[] = [
  { value: "eq", label: "equals", needsValue: true },
  { value: "neq", label: "does not equal", needsValue: true },
  { value: "ilike", label: "contains", needsValue: true },
  { value: "is_null", label: "is empty", needsValue: false },
  { value: "is_not_null", label: "is not empty", needsValue: false },
]

function fieldOptions(type: CohortType) {
  return type === "device" ? DEVICE_FIELDS : PERSON_FIELDS
}

interface CriterionRowProps {
  type: CohortType
  cond: CohortCondition
  onChange: (patch: Partial<CohortCondition>) => void
  onRemove: () => void
}

function CriterionRow({ type, cond, onChange, onRemove }: CriterionRowProps) {
  const op = OPS.find((o) => o.value === cond.op)
  return (
    <div className="flex items-center gap-1.5">
      <span className="shrink-0 text-muted-foreground text-sm">↳</span>

      <Select
        value={cond.field}
        onValueChange={(v) => onChange({ field: v as string })}
      >
        <SelectTrigger size="sm" className="w-[150px] min-w-0 shrink-0">
          <SelectValue>
            {fieldOptions(type).find((f) => f.value === cond.field)?.label ??
              cond.field}
          </SelectValue>
        </SelectTrigger>
        <SelectPopup>
          {fieldOptions(type).map((f) => (
            <SelectItem key={f.value} value={f.value}>
              {f.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>

      <Select
        value={cond.op}
        onValueChange={(v) => onChange({ op: v as CohortConditionOp })}
      >
        <SelectTrigger size="sm" className="w-[108px] min-w-0 shrink-0">
          <SelectValue>{op?.label ?? cond.op}</SelectValue>
        </SelectTrigger>
        <SelectPopup>
          {OPS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>

      {op?.needsValue && (
        <Input
          value={String(cond.value ?? "")}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder="Value"
          nativeInput
          className="h-8 min-w-0 flex-1"
        />
      )}

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        aria-label="Remove criterion"
        className="shrink-0"
      >
        <Trash size={14} />
      </Button>
    </div>
  )
}

export function CohortBuilderPanel({
  seed = COHORT_BUILDER_SEED,
}: {
  seed?: Cohort
}) {
  const [name, setName] = useState(seed.name)
  const [description, setDescription] = useState(seed.description)
  const [filter, setFilter] = useState<CohortFilter>(seed.filter)
  const [baseline, setBaseline] = useState({
    name: seed.name,
    description: seed.description,
    filter: seed.filter,
  })

  const dirty = useMemo(
    () =>
      name !== baseline.name ||
      description !== baseline.description ||
      JSON.stringify(filter) !== JSON.stringify(baseline.filter),
    [name, description, filter, baseline],
  )

  const audience = seed.type === "device" ? "devices" : "persons"

  const updateCondition = (idx: number, patch: Partial<CohortCondition>) =>
    setFilter((f) => ({
      ...f,
      conditions: f.conditions.map((c, i) =>
        i === idx ? { ...c, ...patch } : c,
      ),
    }))

  const addCondition = () => {
    const defaultField = fieldOptions(seed.type)[0]?.value ?? "deviceId"
    setFilter((f) => ({
      ...f,
      conditions: [...f.conditions, { field: defaultField, op: "eq", value: "" }],
    }))
  }

  const removeCondition = (idx: number) =>
    setFilter((f) => ({
      ...f,
      conditions: f.conditions.filter((_, i) => i !== idx),
    }))

  return (
    <div className="flex flex-col">
      <DetailHeader
        onBack={() => {}}
        backLabel="Back to cohorts"
        title={{
          value: name,
          onCommit: setName,
          label: "Cohort name",
          tooltip: "Edit cohort name",
          placeholder: "Cohort name",
        }}
        description={{
          value: description,
          onCommit: setDescription,
          label: "Cohort description",
          tooltip: "Edit description",
          placeholder: "Add a description...",
          emptyText: "Add a description...",
        }}
        actions={
          <Button
            onClick={() => setBaseline({ name, description, filter })}
            disabled={!dirty}
          >
            Save
          </Button>
        }
      />

      <div className="px-4 py-5">
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="font-semibold text-lg">Matching criteria</h2>
            <p className="text-muted-foreground text-sm">
              {audience === "devices" ? "Devices" : "Persons"} who match the
              following criteria will be part of the cohort. Continuously updated
              automatically.
            </p>
          </div>

          <CardFrame className="flex flex-col gap-3 p-4">
            {/* Group header */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                A
              </Badge>
              <span className="text-sm">Match {audience} against</span>
              <Select
                value={filter.matchType}
                onValueChange={(v) =>
                  setFilter((f) => ({ ...f, matchType: v as "all" | "any" }))
                }
              >
                <SelectTrigger size="sm" className="min-w-20">
                  <SelectValue>{filter.matchType}</SelectValue>
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="any">any</SelectItem>
                </SelectPopup>
              </Select>
              <span className="text-sm">criteria</span>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Duplicate group"
                  disabled
                >
                  <Copy size={14} />
                </Button>
              </div>
            </div>

            {/* Criteria */}
            <div className="flex flex-col gap-2 pl-2">
              {filter.conditions.map((cond, idx) => (
                <CriterionRow
                  // biome-ignore lint/suspicious/noArrayIndexKey: list mutated by index
                  key={idx}
                  type={seed.type}
                  cond={cond}
                  onChange={(patch) => updateCondition(idx, patch)}
                  onRemove={() => removeCondition(idx)}
                />
              ))}
              <div>
                <Button variant="ghost" size="sm" onClick={addCondition}>
                  <Plus size={14} />
                  Add criteria
                </Button>
              </div>
            </div>
          </CardFrame>
        </section>
      </div>
    </div>
  )
}
