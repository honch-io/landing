"use client"

import { CaretDown, CaretUp, CaretUpDown } from "@phosphor-icons/react"
import { motion } from "motion/react"
import { Fragment, type ReactNode, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ColumnHeaderMenu } from "./column-header-menu"
import type { ColumnOption, DataColumn, SortState } from "./types"

/* Vendored from the Honch platform (components/data-table/data-table.tsx).
 * Adaptations for the landing page:
 *   - `--shell` → `--card` (landing has no --shell token; matches the
 *     substitution the landing's own ui/table.tsx already ships)
 *   - optional `hideColumnMenu` to drop the per-column dots menu when the
 *     table is a read-only showcase
 *   - optional `streaming` to slide newly-prepended rows in (live events) */

/** Mirrors ui/table.tsx TableRow base classes so a motion.tr matches it 1:1. */
const ROW_CLASS =
  "relative border-b not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-black)_2%)] not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-black)_4%)] dark:not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-white)_4%)] dark:not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-white)_2%)]"

interface DataTableProps<T> {
  columns: DataColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  sort: SortState
  onSortChange: (sort: SortState) => void
  allColumnOptions: ColumnOption[]
  addableColumns: ColumnOption[]
  onEditColumn: (columnId: string, newId: string) => void
  onAddColumn: (columnId: string, newId: string, side: "left" | "right") => void
  onRemoveColumn: (columnId: string) => void
  /** Detail content rendered beneath an expanded row. Omit to disable expand. */
  renderExpanded?: (row: T) => ReactNode
  /** Row click handler. Used when the table navigates rather than expands. */
  onRowClick?: (row: T) => void
  /** Group separator label per row; shown only when not sorting. */
  groupLabel?: (row: T) => string
  /** Content shown in the table body when there are no rows. Header stays visible. */
  empty?: ReactNode
  /** When true, shows a centered spinner in the body while keeping the header. */
  loading?: boolean
  /** Hide the per-column header dropdown (read-only showcase tables). */
  hideColumnMenu?: boolean
  /** Animate newly-prepended rows sliding in (live event feed). */
  streaming?: boolean
  /** Overrides the scroll container. Pass "overflow-visible" so a parent frame
   *  can clip the table into a "slice" instead of showing a scrollbar. */
  containerClassName?: string
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  sort,
  onSortChange,
  allColumnOptions,
  addableColumns,
  onEditColumn,
  onAddColumn,
  onRemoveColumn,
  renderExpanded,
  onRowClick,
  groupLabel,
  empty,
  loading,
  hideColumnMenu,
  streaming,
  containerClassName = "overflow-x-auto",
}: DataTableProps<T>) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const expandable = Boolean(renderExpanded)
  const clickable = !expandable && Boolean(onRowClick)
  const leadingCols = expandable ? 1 : 0
  const totalColumns = columns.length + leadingCols
  const showGroups = Boolean(groupLabel) && !sort

  const toggle = (id: string) =>
    setExpandedId((cur) => (cur === id ? null : id))

  return (
    <div className={containerClassName}>
      <Table variant="card">
        <TableHeader>
          <TableRow className="[&>th]:text-sm [&>th]:font-medium">
            {expandable && <TableHead className="w-8" />}
            {columns.map((col) => (
              <TableHead className={col.width} key={col.id}>
                <div className="flex items-center gap-1">
                  <span className="truncate">{col.label}</span>
                  {sort?.columnId === col.id &&
                    (sort.direction === "asc" ? (
                      <CaretUp className="size-3 shrink-0" weight="bold" />
                    ) : (
                      <CaretDown className="size-3 shrink-0" weight="bold" />
                    ))}
                  {!hideColumnMenu && (
                    <ColumnHeaderMenu
                      addableColumns={addableColumns}
                      allColumns={allColumnOptions}
                      canRemove={columns.length > 1}
                      column={col}
                      onAdd={(newId, side) => onAddColumn(col.id, newId, side)}
                      onEdit={(newId) => onEditColumn(col.id, newId)}
                      onRemove={() => onRemoveColumn(col.id)}
                      onResetSort={() => onSortChange(null)}
                      onSort={(direction) =>
                        onSortChange({ columnId: col.id, direction })
                      }
                      sortDirection={
                        sort?.columnId === col.id ? sort.direction : null
                      }
                    />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow className="[&>td]:py-2">
              {expandable && <TableCell className="w-8" />}
              {columns.map((col) => (
                <TableCell className={col.cellClassName} key={col.id}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          )}
          {!loading && rows.length === 0 && empty != null && (
            <TableRow>
              <TableCell
                className="p-0! hover:bg-card!"
                colSpan={totalColumns}
              >
                {empty}
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            rows.map((row, i) => {
              const id = getRowId(row)
              const expanded = expandable && expandedId === id
              const showGroup =
                showGroups &&
                groupLabel != null &&
                (i === 0 || groupLabel(rows[i - 1]) !== groupLabel(row))
              const rowClassName = `[&>td]:py-2 ${
                expandable || clickable ? "cursor-pointer" : ""
              } ${
                expanded
                  ? "[&>td]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)]! dark:[&>td]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)]!"
                  : ""
              }`
              const onClick = expandable
                ? () => toggle(id)
                : clickable
                  ? () => onRowClick?.(row)
                  : undefined
              const cells = (
                <>
                  {expandable && (
                    <TableCell className="w-8 text-muted-foreground">
                      <button
                        aria-label={expanded ? "Collapse row" : "Expand row"}
                        className="inline-flex size-6 items-center justify-center rounded outline-none hover:bg-accent hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggle(id)
                        }}
                        type="button"
                      >
                        {expanded ? (
                          <span className="flex flex-col items-center -space-y-1">
                            <CaretDown className="size-3" weight="bold" />
                            <CaretUp className="size-3" weight="bold" />
                          </span>
                        ) : (
                          <CaretUpDown className="size-4" weight="bold" />
                        )}
                      </button>
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell className={col.cellClassName} key={col.id}>
                      {col.render(row)}
                    </TableCell>
                  ))}
                </>
              )
              return (
                <Fragment key={id}>
                  {showGroup && groupLabel && (
                    <TableRow className="hover:bg-transparent!">
                      <TableCell
                        className="bg-muted/40! py-1.5 text-center font-medium text-[11px] text-muted-foreground"
                        colSpan={totalColumns}
                      >
                        {groupLabel(row)}
                      </TableCell>
                    </TableRow>
                  )}
                  {streaming ? (
                    <motion.tr
                      animate={{ opacity: 1, y: 0 }}
                      className={`${ROW_CLASS} ${rowClassName}`}
                      data-slot="table-row"
                      initial={{ opacity: 0, y: -6 }}
                      onClick={onClick}
                      transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                    >
                      {cells}
                    </motion.tr>
                  ) : (
                    <TableRow className={rowClassName} onClick={onClick}>
                      {cells}
                    </TableRow>
                  )}
                  {expanded && renderExpanded && (
                    <TableRow>
                      <TableCell
                        className="bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)]! p-0! dark:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)]!"
                        colSpan={totalColumns}
                      >
                        {renderExpanded(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}
