"use client"

import posthog from "posthog-js"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "SDKs", href: "#sdks" },
  { label: "FAQ", href: "#faq" },
  { label: "Pricing", href: "#pricing" },
]

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between px-10">
      <a href="/" className="flex items-center gap-1.5">
        <span className="font-heading text-3xl font-black">honch<span className="text-muted-foreground">.</span></span>
      </a>

      <nav className="hidden items-center gap-1 md:flex">
        {navLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => posthog.capture("nav_clicked", { link: item.label.toLowerCase() })}
            className={buttonVariants({ variant: "ghost", size: "sm", className: "text-muted-foreground" })}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => posthog.capture("cta_clicked", { cta: "log_in", location: "navbar" })}>
          Log in
        </Button>
        <Button size="sm" onClick={() => posthog.capture("cta_clicked", { cta: "get_started", location: "navbar" })}>
          Get started <ArrowRight />
        </Button>
      </div>
    </header>
  )
}
