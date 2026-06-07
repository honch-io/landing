import { ArrowLeft } from "@phosphor-icons/react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useStickyHeader } from "../hooks/use-sticky-header"
import { InlineEditor } from "./inline-editor"

interface EditableField {
  value: string
  label: string
  tooltip: string
  placeholder?: string
  /** When omitted the field renders as read-only text instead of an editor. */
  onCommit?: (value: string) => void
}

interface DescriptionField extends EditableField {
  emptyText?: string
}

export interface DetailHeaderProps {
  onBack: () => void
  backLabel: string
  title: EditableField
  icon?: React.ReactNode
  description?: DescriptionField
  actions?: React.ReactNode
}

/**
 * Detail-page header modeled on the cohort page: a back button, an optional
 * icon, an inline-editable title, optional right-aligned actions, and an
 * optional full-width description row flush to the left edge.
 */
export function DetailHeader({
  onBack,
  backLabel,
  title,
  icon,
  description,
  actions,
}: DetailHeaderProps) {
  const { sentinelRef, stuck } = useStickyHeader()

  return (
    <>
      <div aria-hidden className="h-0" ref={sentinelRef} />
      {/* Top bar (sticky) */}
      <div
        className={cn(
          "sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-card px-4 py-3 transition-colors",
          stuck ? "border-border" : "border-transparent",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onBack}
            aria-label={backLabel}
          >
            <ArrowLeft size={16} />
          </Button>
          {icon}
          <div className="flex min-w-0 flex-1 flex-col">
            {title.onCommit ? (
              <InlineEditor
                value={title.value}
                onCommit={title.onCommit}
                textClassName="font-semibold text-lg"
                placeholder={title.placeholder}
                iconSize={18}
                aria-label={title.label}
                tooltip={title.tooltip}
              />
            ) : (
              <h1 className="truncate px-1.5 font-semibold text-foreground text-lg">
                {title.value || title.placeholder}
              </h1>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="border-border border-b px-4 pb-3 pt-1">
          {description.onCommit ? (
            <InlineEditor
              value={description.value}
              onCommit={description.onCommit}
              textClassName="text-muted-foreground text-sm"
              placeholder={description.placeholder}
              emptyText={description.emptyText}
              aria-label={description.label}
              tooltip={description.tooltip}
            />
          ) : (
            <p className="px-1.5 text-muted-foreground text-sm">
              {description.value || (
                <span className="italic">
                  {description.emptyText ?? description.placeholder}
                </span>
              )}
            </p>
          )}
        </div>
      )}
    </>
  )
}
