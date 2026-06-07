"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  animate,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
} from "motion/react"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
import { TABS, type TabId } from "./tabs.config"
import CohortsTab from "./CohortsTab"
import FleetTab from "./FleetTab"
import InsightsTab from "./InsightsTab"
import LifecycleTab from "./LifecycleTab"

const PANELS: Record<TabId, React.FC> = {
  fleet: FleetTab,
  cohorts: CohortsTab,
  insights: InsightsTab,
  lifecycle: LifecycleTab,
}

/** Seconds each tab stays active before auto-advancing to the next. */
const CYCLE_SECONDS = 6

export default function FeatureTabs() {
  const [activeId, setActiveId] = useState<TabId>(TABS[0].id)

  const active = TABS.find((t) => t.id === activeId) ?? TABS[0]
  const activeIndex = TABS.findIndex((t) => t.id === activeId)

  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [paused, setPaused] = useState(true)

  // 0 → 1 over one cycle, driving the active tab's underline as a left-to-right
  // scaleX fill. While the viewer is on the section it sits full and static (a
  // normal selected-tab underline) and never advances; off-screen it fills over
  // CYCLE_SECONDS and its completion hands off to the next tab — so the bar and
  // the auto-advance can't drift apart, and the "loading" only runs out of view.
  const progress = useMotionValue(0)

  // Auto-advance, gated on `paused`: in view (or under reduced motion) the
  // underline is full and frozen; off-screen it fills, then advances. Re-runs
  // when the active tab changes (auto-advance, click, keyboard) or the section
  // enters/leaves the viewport center.
  useEffect(() => {
    if (prefersReducedMotion || paused) {
      progress.set(1)
      return
    }
    progress.set(0)
    const controls = animate(progress, 1, {
      duration: CYCLE_SECONDS,
      ease: "linear",
      onComplete: () => {
        setActiveId(TABS[(activeIndex + 1) % TABS.length].id)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, paused, prefersReducedMotion])

  // Freeze the loading bar while the viewer is actually on the section, so they
  // stay in control of which tab they're reading (a tab click likewise just
  // stops here). The rootMargin collapses the root to a line at the viewport's
  // vertical center, so the section only counts as "being viewed" once it
  // crosses that center — a sliver peeking up from the hero doesn't trip it.
  // On the hero or scrolled past, the center line sits off the section, so it
  // keeps auto-cycling.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setPaused(entry.isIntersecting),
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="px-6 pt-8 pb-24">
      <MotionConfig reducedMotion="user">
        <motion.div
          className="mx-auto max-w-6xl"
          style={
            {
              "--tab-accent": active.accent,
              "--tab-fill": progress,
            } as React.CSSProperties
          }
        >
          <Tabs
            onValueChange={(value) => setActiveId(value as TabId)}
            value={activeId}
          >
            {/* Tab bar — the codebase Tabs component, underline variant */}
            <TabsList
              aria-label="What Honch does"
              className="mx-auto w-max max-w-full gap-1 overflow-x-auto border-b [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_[data-slot=tab-indicator]]:origin-left [&_[data-slot=tab-indicator]]:scale-x-[var(--tab-fill,0)] [&_[data-slot=tab-indicator]]:bg-[color-mix(in_srgb,var(--tab-accent)_85%,var(--card))]"
              variant="underline"
            >
              {TABS.map((t) => (
                <TabsTab
                  className="gap-2 px-3 text-sm sm:px-4 sm:text-base"
                  key={t.id}
                  value={t.id}
                >
                  <t.icon className="size-4" weight="duotone" />
                  {t.label}
                </TabsTab>
              ))}
            </TabsList>

            {/* Panels — base-ui mounts only the active one, so the motion enter
                replays on every tab change. Each is a fixed-height flex column
                at lg+ (header is shrink-0, content is flex-1) so every tab
                renders at the exact same height — switching tabs never shifts
                the page. Below lg it falls back to natural height. */}
            {TABS.map((t) => {
              const Panel = PANELS[t.id]
              return (
                <TabsPanel className="relative mt-6" key={t.id} value={t.id}>
                  <motion.div
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    className="flex flex-col rounded-3xl border-2 border-[color-mix(in_srgb,var(--tab-accent)_85%,var(--card))] bg-card p-5 shadow-xs/5 sm:p-7 lg:h-[32rem]"
                    initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                    transition={{ type: "spring", bounce: 0.14, duration: 0.5 }}
                  >
                    <div className="shrink-0">
                      <h3 className="font-heading text-2xl sm:text-3xl">
                        {t.headline}
                      </h3>
                      <p className="mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
                        {t.subhead}
                      </p>
                    </div>
                    <div className="mt-6 min-h-0 flex-1">
                      <Panel />
                    </div>
                  </motion.div>
                </TabsPanel>
              )
            })}
          </Tabs>
        </motion.div>
      </MotionConfig>
    </section>
  )
}
