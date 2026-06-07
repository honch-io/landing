import type { ReactNode } from "react"

/** A column definition for the reusable data table, generic over the row type. */
export interface DataColumn<T> {
  id: string
  label: string
  width: string
  /** Property type used for the type badge in the column config dialog. */
  type?: string
  cellClassName?: string
  getSortValue?: (row: T) => string | number
  render: (row: T) => ReactNode
}

export type SortState = { columnId: string; direction: "asc" | "desc" } | null

/** Lightweight column reference used by menus and the column config dialog. */
export interface ColumnOption {
  id: string
  label: string
}
