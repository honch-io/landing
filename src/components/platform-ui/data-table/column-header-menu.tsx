import { Check, DotsThree } from "@phosphor-icons/react"
import type { ReactNode } from "react"
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from "@/components/ui/menu"
import type { ColumnOption } from "./types"

/** Per-column header dropdown: sort, swap, add, and remove a column. */
export function ColumnHeaderMenu({
  column,
  allColumns,
  addableColumns,
  canRemove,
  sortDirection,
  onSort,
  onResetSort,
  onEdit,
  onAdd,
  onRemove,
}: {
  column: ColumnOption
  allColumns: ColumnOption[]
  addableColumns: ColumnOption[]
  canRemove: boolean
  sortDirection: "asc" | "desc" | null
  onSort: (direction: "asc" | "desc") => void
  onResetSort: () => void
  onEdit: (newId: string) => void
  onAdd: (newId: string, side: "left" | "right") => void
  onRemove: () => void
}): ReactNode {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`${column.label} column options`}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded text-muted-foreground/40 normal-case outline-none hover:bg-accent hover:text-foreground data-popup-open:bg-accent data-popup-open:text-foreground"
      >
        <DotsThree size={20} weight="bold" />
      </MenuTrigger>
      <MenuPopup align="start" className="min-w-52">
        <div className="px-2 py-1 font-semibold text-foreground text-sm normal-case tracking-normal">
          {column.label}
        </div>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Edit column</MenuSubTrigger>
          <MenuSubPopup className="min-w-44">
            {allColumns.map((c) => (
              <MenuItem key={c.id} onClick={() => onEdit(c.id)}>
                {c.label}
                {c.id === column.id && <Check className="ms-auto" />}
              </MenuItem>
            ))}
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuItem onClick={() => onSort("asc")}>
          Sort ascending
          {sortDirection === "asc" && <Check className="ms-auto" />}
        </MenuItem>
        <MenuItem onClick={() => onSort("desc")}>
          Sort descending
          {sortDirection === "desc" && <Check className="ms-auto" />}
        </MenuItem>
        <MenuItem disabled={!sortDirection} onClick={onResetSort}>
          Reset sorting
        </MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Add column left</MenuSubTrigger>
          <MenuSubPopup className="min-w-44">
            {addableColumns.length === 0 ? (
              <MenuItem disabled>No more columns</MenuItem>
            ) : (
              addableColumns.map((c) => (
                <MenuItem key={c.id} onClick={() => onAdd(c.id, "left")}>
                  {c.label}
                </MenuItem>
              ))
            )}
          </MenuSubPopup>
        </MenuSub>
        <MenuSub>
          <MenuSubTrigger>Add column right</MenuSubTrigger>
          <MenuSubPopup className="min-w-44">
            {addableColumns.length === 0 ? (
              <MenuItem disabled>No more columns</MenuItem>
            ) : (
              addableColumns.map((c) => (
                <MenuItem key={c.id} onClick={() => onAdd(c.id, "right")}>
                  {c.label}
                </MenuItem>
              ))
            )}
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuItem disabled={!canRemove} onClick={onRemove} variant="destructive">
          Remove column
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}
