"use client"

import { useState } from "react"
import posthog from "posthog-js"
import { Check, ChevronRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const COMMAND = "npx @honch/start"

const WHAT_IT_DOES = [
  "Scans your project and detects the most likely SDK target.",
  "Connects your Honch account, then lets you pick or create a project.",
  "Does the work on a fresh git branch, so you can review or discard it.",
  "Wires in the SDK with an AI agent and writes a honch-setup-report.md you can review.",
]

const TARGETS = ["ESP-IDF", "C / POSIX", "MicroPython", "Arduino", "React Native"]

export default function InstallGuideDialog({
  triggerLabel,
  triggerClassName,
}: {
  triggerLabel: React.ReactNode
  triggerClassName?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(COMMAND)
    setCopied(true)
    posthog.capture("install_command_copied", { command: COMMAND, location: "install_guide" })
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger
        className={triggerClassName}
        onClick={() => posthog.capture("nav_clicked", { link: "install_guide" })}
      >
        {triggerLabel}
      </DialogTrigger>
      <DialogPopup className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Install with AI</DialogTitle>
          <DialogDescription>
            <code className="font-mono text-foreground">@honch/start</code> is an agent-powered installer.
            It scans your project, connects your account, and wires the right Honch SDK into your codebase.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="space-y-6">
          {/* Command */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black px-4 py-3 font-mono text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <ChevronRight className="size-4 shrink-0 text-white/40" />
              <code className="overflow-x-auto whitespace-nowrap text-white">
                npx <span className="text-white/50">@honch</span>/start
              </code>
            </div>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Copied" : "Copy command"}
              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          </div>

          {/* What it does */}
          <div>
            <h3 className="font-semibold text-sm">What it does</h3>
            <ul className="mt-3 space-y-2.5">
              {WHAT_IT_DOES.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Targets */}
          <div>
            <h3 className="font-semibold text-sm">Works with</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {TARGETS.map((target) => (
                <span
                  key={target}
                  className="rounded-full border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {target}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Preview without touching your files using{" "}
            <code className="font-mono">--dry-run</code>. Requires Node 22+.
          </p>
        </DialogPanel>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
          <Button
            render={<a href="https://docs.honch.io/quickstart" target="_blank" rel="noopener noreferrer" />}
            onClick={() => posthog.capture("cta_clicked", { cta: "quickstart_docs", location: "install_guide" })}
          >
            Read the docs
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}
