"use client"

import { PencilSimple } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface InlineEditorProps {
  value: string
  onCommit: (value: string) => void
  textClassName?: string
  placeholder?: string
  emptyText?: string
  hideEditIcon?: boolean
  iconSize?: number
  "aria-label"?: string
  tooltip: string
  className?: string
}

/**
 * Click-to-edit text field that keeps typography identical between display and
 * edit modes — only an input box appears around the text. Reuses the same
 * border / focus-ring chrome as `<Input />`.
 */
export function InlineEditor({
  value,
  onCommit,
  textClassName,
  placeholder,
  emptyText,
  hideEditIcon = false,
  iconSize = 14,
  "aria-label": ariaLabel,
  tooltip,
  className,
}: InlineEditorProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [editing, value])

  const commit = () => {
    setEditing(false)
    if (draft !== value) onCommit(draft)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <span
        className={cn(
          "relative flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-focus-visible:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:border-ring has-focus-visible:shadow-none has-focus-visible:ring-[3px] dark:bg-input/32 dark:not-has-focus-visible:before:shadow-[0_-1px_--theme(--color-white/6%)]",
          className,
        )}
        data-slot="inline-editor-input"
      >
        <input
          className={cn(
            "w-full min-w-0 rounded-[inherit] bg-transparent px-1.5 py-0.5 outline-none placeholder:text-muted-foreground/72",
            textClassName,
          )}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              commit()
            } else if (e.key === "Escape") {
              e.preventDefault()
              cancel()
            }
          }}
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoFocus
        />
      </span>
    )
  }

  return (
    <Tooltip disableHoverablePopup>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={cn(
              "inline-flex w-fit max-w-full items-center gap-1.5 self-start rounded-lg border border-transparent px-1.5 py-0.5 text-left hover:border-input/60",
              textClassName,
              className,
            )}
            aria-label={ariaLabel}
          >
            <span className="truncate">
              {value || (
                <span className="italic">{emptyText ?? placeholder ?? ""}</span>
              )}
            </span>
            {!hideEditIcon && <PencilSimple size={iconSize} className="shrink-0" />}
          </button>
        }
      />
      <TooltipPopup>{tooltip}</TooltipPopup>
    </Tooltip>
  )
}
