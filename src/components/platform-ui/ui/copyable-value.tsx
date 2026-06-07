"use client"

import { Check, Copy } from "@phosphor-icons/react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function CopyableValue({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    void navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <span className="group inline-flex min-w-0 items-center gap-1.5">
      <span
        className={cn("truncate font-mono text-foreground text-sm", className)}
        title={value}
      >
        {value}
      </span>
      <button
        aria-label="Copy"
        className="inline-flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground/60 outline-none transition hover:bg-accent hover:text-foreground"
        onClick={(e) => {
          e.stopPropagation()
          copy()
        }}
        type="button"
      >
        {copied ? (
          <Check className="size-3.5" weight="bold" />
        ) : (
          <Copy className="size-3.5" weight="bold" />
        )}
      </button>
    </span>
  )
}
