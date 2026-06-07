import { useEffect, useRef, useState } from "react"

/**
 * Tracks whether a sticky header has scrolled away from the top of its scroll
 * container. Render the returned `sentinelRef` on a zero-height element placed
 * immediately before the sticky element; `stuck` flips to `true` once that
 * sentinel scrolls out of view. (Inside a non-scrolling showcase frame it
 * simply stays `false`, which is the correct resting appearance.)
 */
export function useStickyHeader() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { sentinelRef, stuck }
}
