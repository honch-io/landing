const logos = [
  "Insta360",
  "Eight Sleep",
  "Fi",
  "Peloton",
  "Sonos",
  "Ring",
]

export default function LogoBar() {
  return (
    <section className="flex items-center gap-8 overflow-hidden py-12 px-10">
      <p className="shrink-0 text-sm text-muted-foreground">
        Trusted by the teams building the best hardware.
      </p>
      <div className="relative min-w-0 flex-1 overflow-clip">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />
        {/* Scrolling track */}
        <div className="flex w-max animate-[scroll_20s_linear_infinite]">
          {[...logos, ...logos, ...logos, ...logos].map((name, i) => (
            <span
              key={i}
              className="mx-8 shrink-0 font-heading text-xl tracking-tight text-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
