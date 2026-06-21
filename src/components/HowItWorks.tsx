"use client"

import { Card, CardFrame, CardFrameHeader, CardFrameTitle, CardFrameDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowRight } from "lucide-react"
import { Coffee, Drop, WifiHigh, Thermometer, Cpu, Watch, DeviceMobile, SpeakerHigh, GameController, CalendarBlank, ArrowsClockwise } from "@phosphor-icons/react"
import TrackedLink from "./TrackedLink"

export default function HowItWorks() {
  return (
    <section id="product" className="px-6 py-24">
      <h2 className="mx-auto max-w-3xl text-center font-heading text-4xl md:text-5xl">
        Device analytics made simple
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
        Get real product insights from your hardware without building
        a data pipeline.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <TrackedLink href="https://app.honch.io/register" event="cta_clicked" properties={{ cta: "get_started", location: "how_it_works" }} variant="default">
          Get started <ArrowRight />
        </TrackedLink>
        <TrackedLink href="https://cal.com/honch/30min" event="cta_clicked" properties={{ cta: "book_a_demo", location: "how_it_works" }}>
          Book a demo <CalendarBlank weight="duotone" />
        </TrackedLink>
      </div>

      <div className="mt-16 grid gap-3 md:grid-cols-3">
        {/* Card 01 - Integrate SDK */}
        <Card className="p-8">
          <span className="flex w-max px-4 py-1 items-center justify-center rounded-md bg-background text-sm font-semibold">
            01
          </span>
          <h3 className="mt-6 text-xl font-bold">Add the SDK</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            A lightweight SDK that lives on your device. Integrate in minutes, ship analytics from day one.
          </p>

          {/* Orbiting devices visual */}
          <div className="relative mx-auto mt-auto pt-10 flex items-center justify-center overflow-hidden h-56">
            {/* Top & bottom fade */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-card to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-card to-transparent" />
            <style>{`
              ${[0, 60, 120, 180, 240, 300].map((d) => `
                @keyframes orbit-${d} {
                  from { transform: rotate(${d}deg) translateX(100px) rotate(-${d}deg); }
                  to { transform: rotate(${d + 360}deg) translateX(100px) rotate(-${d + 360}deg); }
                }
              `).join("")}
            `}</style>
            <div className="relative flex size-72 items-center justify-center">
              {/* Outer orbit ring */}
              <div className="absolute inset-0 rounded-full border border-border/60" />
              {/* Middle orbit ring */}
              <div className="absolute inset-8 rounded-full border border-border/40" />
              {/* Inner orbit ring */}
              <div className="absolute inset-16 rounded-full border border-border/30" />

              {/* Center - Honch pill */}
              <div className="relative z-10 flex items-center justify-center rounded-full border bg-background px-3 py-1">
                <span className="font-heading text-xl font-black">honch<span className="text-muted-foreground">.</span></span>
              </div>

              {/* Orbiting device icons — evenly spaced, all start together */}
              {[
                { icon: Cpu, offset: 0, color: "text-blue-500" },
                { icon: WifiHigh, offset: 60, color: "text-violet-500" },
                { icon: SpeakerHigh, offset: 120, color: "text-amber-500" },
                { icon: Watch, offset: 180, color: "text-emerald-500" },
                { icon: DeviceMobile, offset: 240, color: "text-rose-500" },
                { icon: GameController, offset: 300, color: "text-cyan-500" },
              ].map(({ icon: Icon, offset, color }) => (
                <div
                  key={offset}
                  className="absolute left-1/2 top-1/2 -ml-[18px] -mt-[18px]"
                  style={{
                    animation: `orbit-${offset} 20s cubic-bezier(0.45, 0, 0.55, 1) infinite`,
                  }}
                >
                  <div className="flex size-9 items-center justify-center rounded-full border bg-background">
                    <Icon className={`size-4 ${color}`} weight="duotone" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Card 02 - Ship events */}
        <Card className="p-8">
          <span className="flex w-max px-4 py-1 items-center justify-center rounded-md bg-background text-sm font-semibold">
            02
          </span>
          <h3 className="mt-6 text-xl font-bold">See every interaction</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            See how people use your product in real time, from everyday features to rare edge cases.
          </p>

          {/* Event stream visual — matches platform CardFrame + Table variant="card" */}
          <div className="mt-auto pt-10">
            <CardFrame>
              <Table variant="card">
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">2s ago</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm">
                        <Coffee className="size-4 shrink-0 text-muted-foreground" weight="duotone" />
                        brew_completed
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">X1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">5s ago</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm">
                        <Coffee className="size-4 shrink-0 text-muted-foreground" weight="duotone" />
                        recipe_saved
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">X1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">12s ago</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm">
                        <WifiHigh className="size-4 shrink-0 text-muted-foreground" weight="duotone" />
                        setup_complete
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">S2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">18s ago</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm">
                        <Coffee className="size-4 shrink-0 text-muted-foreground" weight="duotone" />
                        strength_changed
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">X1</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardFrame>
          </div>
        </Card>

        {/* Card 03 - Analyze & iterate */}
        <Card className="p-8">
          <span className="flex w-max px-4 py-1 items-center justify-center rounded-md bg-background text-sm font-semibold">
            03
          </span>
          <h3 className="mt-6 text-xl font-bold">Find what matters</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Funnels, retention, and cohorts that show where users drop off and what drives them to come back.
          </p>

          {/* Funnel visual */}
          <div className="mt-auto pt-10">
            <div className="mb-1">
              <span className="text-xs font-semibold">Funnel</span>
            </div>
            <div className="mb-3 text-[11px] text-muted-foreground">
              Powered on → first brew → daily habit
            </div>
            <div className="flex items-end gap-2 h-28">
              {[
                { pct: "100%", h: 100, label: "Powered on", users: "12,643" },
                { pct: "76.3%", h: 76.3, label: "First brew", users: "9,642" },
                { pct: "42.1%", h: 42.1, label: "5th brew", users: "5,221" },
                { pct: "18.7%", h: 18.7, label: "Daily habit", users: "2,382" },
              ].map((s) => (
                <div key={s.label} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold tabular-nums">{s.pct}</span>
                  <div className="w-full flex items-end" style={{ height: 80 }}>
                    <div
                      className="w-full rounded-t bg-blue-500"
                      style={{ height: `${s.h}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              {[
                { label: "Powered on", users: "12,643" },
                { label: "First brew", users: "9,642" },
                { label: "5th brew", users: "5,221" },
                { label: "Daily habit", users: "2,382" },
              ].map((s) => (
                <div key={s.label} className="flex-1 text-center">
                  <div className="text-[10px] font-medium leading-tight">{s.label}</div>
                  <div className="text-[9px] text-muted-foreground">{s.users} devices</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
