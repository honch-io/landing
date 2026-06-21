export default function SectionSeparator() {
  return (
    <div className="relative bg-primary">
      {/* Grain overlay — matches the hero's textured orange */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-repeat mix-blend-overlay"
        style={{ backgroundImage: "url(/noise-light.png)" }}
      />
      <svg className="relative z-10 block h-5 w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="section-zigzag"
            width="36"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            {/* White carves the bottom; textured orange shows above the gentle wave */}
            <path d="M0 10 Q9 16 18 10 Q27 4 36 10 V20 H0 Z" style={{ fill: "var(--background)" }} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#section-zigzag)" />
      </svg>
    </div>
  )
}
