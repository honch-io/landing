import { CohortBuilderPanel } from "./CohortBuilderPanel"
import { Funnel } from "./Funnel"

/**
 * Section 2 composite: the real, interactive cohort condition builder on top,
 * and its activation funnel beneath — "group devices, then trace where they
 * drop." The builder is a true platform component; the funnel is greenfield
 * but styled native to the same design system.
 */
export function CohortsFunnelPanel() {
  return (
    <div className="flex flex-col">
      <CohortBuilderPanel />
      <div className="border-border border-t p-4">
        <Funnel accent="var(--primary)" />
      </div>
    </div>
  )
}
