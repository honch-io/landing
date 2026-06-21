"use client"

import posthog from "posthog-js"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { MCP_CLIENT_LOGOS } from "./McpClientLogos"

// --- Geometry -------------------------------------------------------------
// One self-contained SVG draws the tiles + connector curves; the center logo
// pill is an HTML element overlaid at the convergence point so the wordmark
// renders crisply. Colors come from theme tokens.
const VIEW_W = 760
const VIEW_H = 600

const TILE_SIZE = 80
const TILE_Y = 56
const TILE_CY = TILE_Y + TILE_SIZE / 2
const ICON_SIZE = 38

const NODE_CX = VIEW_W / 2
const NODE_CY = 460

// Evenly space the MCP client tiles across the top, centered on the node.
const PITCH = 116
const tiles = MCP_CLIENT_LOGOS.map((logo, i) => ({
  logo,
  cx: NODE_CX + (i - (MCP_CLIENT_LOGOS.length - 1) / 2) * PITCH,
}))

// Each client tile sends a curve down into the center of the pill, fanning in.
function connector(cx: number) {
  const endX = NODE_CX + (cx - NODE_CX) * 0.1
  const startY = TILE_Y + TILE_SIZE
  return `M ${cx} ${startY} C ${cx} ${startY + 165}, ${endX} ${NODE_CY - 110}, ${endX} ${NODE_CY}`
}

export default function AISection() {
  return (
    <section id="ai" className="px-6 py-24">
      <div className="overflow-hidden rounded-3xl border bg-card">
        <div className="flex flex-col items-center gap-12 p-8 md:p-12 lg:flex-row lg:gap-8 lg:p-16">
          {/* Left — copy */}
          <div className="flex max-w-xl flex-col items-start gap-6 lg:w-[46%]">
            <h2 className="font-heading text-4xl md:text-5xl">
              Ask your product what&rsquo;s happening.
              <br />
              Get answers instantly.
            </h2>

            <p className="text-lg text-muted-foreground md:text-xl">
              Connect Honch to Claude, Cursor, or any MCP client and get answers
              from live device data in plain English.
            </p>

            <a
              href="https://docs.honch.io/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                posthog.capture("cta_clicked", { cta: "explore_mcp", location: "ai_section" })
              }
              className={buttonVariants({ size: "xl", className: "w-max" })}
            >
              Get started with MCP <ArrowRight />
            </a>
          </div>

          {/* Right — MCP clients flowing into the Honch node */}
          <div className="relative w-full lg:w-[54%]">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="block h-auto w-full"
              role="img"
              aria-label="MCP clients connected to Honch through the MCP server"
            >
              <defs>
                <linearGradient id="ai-line" x1="0" y1={TILE_Y + TILE_SIZE} x2="0" y2={NODE_CY} gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="var(--border)" />
                  <stop offset="1" stopColor="var(--primary)" stopOpacity="0.55" />
                </linearGradient>
              </defs>

              {/* Connector curves (converge behind the pill) */}
              <g fill="none" stroke="url(#ai-line)" strokeWidth="1.5">
                {tiles.map(({ logo, cx }) => (
                  <path key={logo.name} d={connector(cx)} />
                ))}
              </g>

              {/* MCP client tiles */}
              {tiles.map(({ logo, cx }) => (
                <g key={logo.name}>
                  <rect
                    x={cx - TILE_SIZE / 2}
                    y={TILE_Y}
                    width={TILE_SIZE}
                    height={TILE_SIZE}
                    rx="18"
                    fill="var(--background)"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                  />
                  <g transform={`translate(${cx - ICON_SIZE / 2} ${TILE_CY - ICON_SIZE / 2}) scale(${ICON_SIZE / 24})`}>
                    <path
                      d={logo.path}
                      fill={logo.color === "currentColor" ? "var(--foreground)" : logo.color}
                    />
                  </g>
                </g>
              ))}
            </svg>

            {/* Center — big Honch logo pill */}
            <div
              className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-full border bg-background px-8 py-4 shadow-sm"
              style={{ top: `${(NODE_CY / VIEW_H) * 100}%` }}
            >
              <span className="font-heading text-4xl font-black leading-none">
                honch<span className="text-muted-foreground">.</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
