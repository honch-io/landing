"use client"

import posthog from "posthog-js"
import { Button } from "@/components/ui/button"

interface TrackedLinkProps {
  href: string
  event: string
  properties?: Record<string, string>
  children: React.ReactNode
  className?: string
}

export default function TrackedLink({ href, event, properties, children, className }: TrackedLinkProps) {
  return (
    <Button
      variant="outline"
      size="xl"
      className={className}
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
      onClick={() => posthog.capture(event, properties)}
    >
      {children}
    </Button>
  )
}
