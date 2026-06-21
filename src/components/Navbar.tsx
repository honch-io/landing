"use client"

import { useEffect, useState } from "react"
import posthog from "posthog-js"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "SDKs", href: "#sdks" },
  { label: "Compare", href: "#compare" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "https://docs.honch.io/" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    // app.honch.io sets a `honch_authed` cookie on the shared `.honch.io` domain
    // while logged in (the auth token lives in localStorage and isn't readable
    // cross-subdomain, so this lightweight cookie is the signal).
    const match = document.cookie.match(/(?:^|;\s*)honch_authed=([^;]+)/)
    setLoggedIn(Boolean(match && match[1] && match[1] !== "0"))
  }, [])

  return (
    <header className="sticky top-0 z-50 mx-2 pt-[17px] lg:mx-[30px]">
      <nav
        className={cn(
          "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl p-4 transition duration-300",
          scrolled
            ? "bg-white text-foreground shadow-lg shadow-black/5"
            : "bg-transparent text-white",
        )}
      >
        {/* Left: logo + nav links */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-1.5">
            <span className={cn("font-heading text-3xl font-black", scrolled ? "text-foreground" : "text-white")}>
              honch<span className={scrolled ? "text-muted-foreground" : "text-white/60"}>.</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => {
              const external = item.href.startsWith("http")
              return (
                <a
                  key={item.label}
                  href={item.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => posthog.capture("nav_clicked", { link: item.label.toLowerCase() })}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "transition-none",
                    scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10",
                  )}
                >
                  {item.label}
                </a>
              )
            })}
          </div>
        </div>

        {/* Right: auth + CTAs */}
        <div className="flex items-center gap-4">
          {loggedIn ? (
            <a
              href="https://app.honch.io/"
              onClick={() => posthog.capture("cta_clicked", { cta: "dashboard", location: "navbar" })}
              className={cn(
                buttonVariants({ size: "lg" }),
                "transition-none",
                !scrolled &&
                  "border-white bg-white text-primary shadow-[0_1px_2px_0_#0000001f,0_3px_8px_-2px_#00000024,inset_0_-1px_0_0_#0000000d] hover:bg-white/90",
              )}
            >
              Dashboard <ArrowRight />
            </a>
          ) : (
            <>
              <a
                href="https://app.honch.io/"
                onClick={() => posthog.capture("cta_clicked", { cta: "log_in", location: "navbar" })}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "hidden transition-none sm:inline-flex",
                  scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10",
                )}
              >
                Log in
              </a>
              <a
                href="https://cal.com/honch/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => posthog.capture("cta_clicked", { cta: "talk_to_sales", location: "navbar" })}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "hidden transition-none sm:inline-flex",
                  scrolled ? "border-border text-foreground hover:bg-muted" : "border-white/40 text-white hover:bg-white/10",
                )}
              >
                Talk to sales
              </a>
              <a
                href="https://app.honch.io/register"
                onClick={() => posthog.capture("cta_clicked", { cta: "get_started", location: "navbar" })}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "transition-none",
                  !scrolled &&
                    "border-white bg-white text-primary shadow-[0_1px_2px_0_#0000001f,0_3px_8px_-2px_#00000024,inset_0_-1px_0_0_#0000000d] hover:bg-white/90",
                )}
              >
                Get started <ArrowRight />
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
