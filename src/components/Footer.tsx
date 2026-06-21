"use client"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Product analytics", href: "#product" },
      { label: "SDKs", href: "#sdks" },
      { label: "Pricing", href: "#pricing" },
      { label: "Compare", href: "#compare" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "https://docs.honch.io/" },
      { label: "Quickstart", href: "https://docs.honch.io/quickstart" },
      { label: "Status", href: "https://status.honch.io/" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Sign up", href: "https://app.honch.io/register" },
      { label: "Log in", href: "https://app.honch.io/" },
      { label: "Book a demo", href: "https://cal.com/honch/30min" },
    ],
  },
]

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/honchio/",
    icon: (
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/honch-io/",
    icon: (
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    ),
  },
]

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-[15px] text-white/90 transition-colors hover:text-white"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* Light grain (normal blend — overlay is a no-op on pure black) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-repeat opacity-80"
        style={{ backgroundImage: "url(/noise-light.png)" }}
      />

      {/* Wave transition: orange CTA banner above into the black footer */}
      <svg aria-hidden className="relative z-10 block h-5 w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="footer-wave" width="36" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 0 H36 V10 Q27 4 18 10 Q9 16 0 10 Z" style={{ fill: "var(--primary)" }} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-wave)" />
      </svg>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 pt-16 pb-12 lg:flex-row lg:gap-16 lg:px-10">
        {/* Left — company / brand block */}
        <div className="lg:w-72 lg:shrink-0">
          <span className="font-heading text-4xl font-black">
            honch<span className="text-white/50">.</span>
          </span>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Product analytics for the hardware you ship.
          </p>

          <div className="mt-6 flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full text-white/70 hover:bg-white/10 hover:text-white")}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>

          <Badge
            variant="outline"
            size="lg"
            className="mt-6 gap-1.5 rounded-full border-white/15 bg-transparent px-3 text-xs text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
            render={<a href="https://status.honch.io/" target="_blank" rel="noopener noreferrer" />}
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            All systems operational
          </Badge>

          <p className="mt-8 text-xs text-white/50">
            &copy; {new Date().getFullYear()} Honch, Inc. All rights reserved.
          </p>
        </div>

        {/* Right — link columns */}
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-12">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white/50">{col.title}</h3>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
