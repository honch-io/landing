"use client"

import { useEffect, useRef } from "react"
import posthog from "posthog-js"

interface TrackedSectionProps {
  name: string
  children: React.ReactNode
}

export default function TrackedSection({ name, children }: TrackedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const tracked = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true
          posthog.capture("section_viewed", { section: name })
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [name])

  return <div ref={ref}>{children}</div>
}
