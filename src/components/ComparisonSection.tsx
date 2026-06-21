import { Fragment } from "react"
import { Check, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const COLUMNS = ["Honch", "PostHog", "Mixpanel", "Amplitude"]

// values align with COLUMNS order: [Honch, PostHog, Mixpanel, Amplitude]
const groups: {
  category: string
  features: { name: string; desc: string; values: boolean[] }[]
}[] = [
  {
    category: "Analytics",
    features: [
      {
        name: "Product analytics",
        desc: "Funnels, retention, cohorts, and feature adoption.",
        values: [true, true, true, true],
      },
      {
        name: "Dashboards & alerts",
        desc: "Build dashboards, set limits, and get notified.",
        values: [true, true, true, true],
      },
    ],
  },
  {
    category: "Device-native",
    features: [
      {
        name: "Sessions you define",
        desc: "You pick what a session is, like one recording or one ride. Web tools just guess based on idle time.",
        values: [true, false, false, false],
      },
      {
        name: "Real device tracking",
        desc: "Follow every device over its whole life, even as it changes owners and firmware.",
        values: [true, false, false, false],
      },
      {
        name: "Works offline",
        desc: "Devices save events while offline and send them later, still in the right order.",
        values: [true, false, false, false],
      },
      {
        name: "Firmware version tracking",
        desc: "See how each firmware release changes the way people use the product.",
        values: [true, false, false, false],
      },
    ],
  },
  {
    category: "Integration",
    features: [
      {
        name: "Any connection",
        desc: "Wi-Fi, cellular, Bluetooth, or a hub. They all send the same data.",
        values: [true, false, false, false],
      },
      {
        name: "Embedded SDKs",
        desc: "Drop-in SDKs for C, ESP-IDF, Zephyr, and Arduino, plus iOS and Android.",
        values: [true, false, false, false],
      },
    ],
  },
]

function Cell({ value }: { value: boolean }) {
  return (
    <TableCell className="border-l px-4 py-5 text-center align-top">
      {value ? (
        <Check className="mx-auto size-5 text-emerald-500" strokeWidth={2.5} />
      ) : (
        <X className="mx-auto size-5 text-muted-foreground/30" strokeWidth={2.5} />
      )}
    </TableCell>
  )
}

export default function ComparisonSection() {
  return (
    <section id="compare" className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-4xl md:text-5xl">Built for devices, not browsers</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          PostHog, Mixpanel, and Amplitude were built for websites and apps.
          Honch is built for the physical products you ship.
        </p>
      </div>

      <Card className="mx-auto mt-12 max-w-5xl overflow-hidden">
        <Table className="min-w-[680px] border-collapse [&_tr:hover]:bg-transparent">
          <TableHeader>
            <TableRow>
              <TableHead className="px-6" />
              {COLUMNS.map((col) => (
                <TableHead key={col} className="h-auto w-28 border-l py-5 text-center text-sm font-semibold">
                  {col === "Honch" ? (
                    <span className="font-heading text-base font-black text-foreground">
                      honch<span className="text-muted-foreground">.</span>
                    </span>
                  ) : (
                    col
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <Fragment key={group.category}>
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length + 1}
                    className="bg-muted px-6 py-3 text-sm font-semibold text-foreground"
                  >
                    {group.category}
                  </TableCell>
                </TableRow>
                {group.features.map((f) => (
                  <TableRow key={f.name}>
                    <TableCell className="whitespace-normal px-6 py-5 align-top leading-normal">
                      <div className="font-semibold text-foreground">{f.name}</div>
                      <div className="mt-1 max-w-md text-sm text-muted-foreground">{f.desc}</div>
                    </TableCell>
                    {f.values.map((v, i) => (
                      <Cell key={i} value={v} />
                    ))}
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  )
}
