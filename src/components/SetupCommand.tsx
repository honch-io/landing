"use client"

import { useState } from "react"
import { Check, ChevronRight, Copy } from "lucide-react"
import posthog from "posthog-js"
import { Frame, FramePanel, FrameFooter } from "@/components/ui/frame"

const COMMAND = "npx @honch/start"

export default function SetupCommand() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(COMMAND)
    setCopied(true)
    posthog.capture("install_command_copied", { command: COMMAND, location: "sdk_section" })
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Frame className="mx-auto w-full max-w-md text-left">
      <FramePanel className="flex items-center justify-between gap-3 px-4 py-3 font-mono text-sm">
        <div className="flex min-w-0 items-center gap-2">
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          <code className="overflow-x-auto whitespace-nowrap">
            <span className="text-foreground">npx </span>
            <span className="text-muted-foreground">@honch</span>
            <span className="text-foreground">/start</span>
          </code>
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy command"}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </FramePanel>
      <FrameFooter className="flex items-center justify-between gap-2 px-4 py-2.5">
        <span className="text-sm text-muted-foreground">Sets up your SDK in one command</span>
        <a
          href="https://docs.honch.io/quickstart"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => posthog.capture("nav_clicked", { link: "quickstart", location: "sdk_section" })}
          className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
        >
          Quickstart &rarr;
        </a>
      </FrameFooter>
    </Frame>
  )
}
