"use client"

import { Fragment, type ReactNode } from "react"
import { MotionConfig } from "motion/react"
import SectionDivider from "@/components/SectionDivider"
import { CohortsFunnelPanel } from "@/components/platform-ui/CohortsFunnelPanel"
import { DeviceProfilePanel } from "@/components/platform-ui/DeviceProfilePanel"
import { LiveEventsPanel } from "@/components/platform-ui/LiveEventsPanel"
import { SessionDetailPanel } from "@/components/platform-ui/SessionDetailPanel"
import { WALKTHROUGH, type WalkthroughId } from "./walkthrough.config"
import { WalkthroughFrame } from "./WalkthroughFrame"
import { WalkthroughSection } from "./WalkthroughSection"

/* The "how it works" walkthrough: four sections, each pairing a real, vendored
 * product panel with explanatory copy. Reduced motion is scoped here (layout.tsx
 * is a server component) so all reveals respect prefers-reduced-motion. */

const PANELS: Record<
  WalkthroughId,
  { node: ReactNode; clip: "bottom" | "both"; height?: string }
> = {
  // Compact feed fits the frame; size to ~8 rows.
  events: { node: <LiveEventsPanel />, clip: "bottom", height: "h-[380px] lg:h-[400px]" },
  // Taller: the cohort builder stacks above the funnel, both need to show.
  cohorts: {
    node: <CohortsFunnelPanel />,
    clip: "bottom",
    height: "h-[640px] lg:h-[700px]",
  },
  sessions: {
    node: <SessionDetailPanel />,
    clip: "bottom",
    height: "h-[520px] lg:h-[560px]",
  },
  devices: {
    node: <DeviceProfilePanel />,
    clip: "bottom",
    height: "h-[540px] lg:h-[600px]",
  },
}

export default function Walkthrough() {
  return (
    <MotionConfig reducedMotion="user">
      {WALKTHROUGH.map((s, i) => {
        const panel = PANELS[s.id]
        return (
          <Fragment key={s.id}>
            {i > 0 && <SectionDivider />}
            <WalkthroughSection {...s}>
              <WalkthroughFrame
                clip={panel.clip}
                heightClassName={panel.height}
              >
                {panel.node}
              </WalkthroughFrame>
            </WalkthroughSection>
          </Fragment>
        )
      })}
    </MotionConfig>
  )
}
