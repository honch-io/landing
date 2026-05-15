const codeLines = [
  { tokens: [{ text: '#include ', c: '#c586c0' }, { text: '"honch.h"', c: '#ce9178' }] },
  { tokens: [] },
  { tokens: [{ text: 'static ', c: '#569cd6' }, { text: 'honch_config_t', c: '#4ec9b0' }, { text: ' cfg = {', c: '#d4d4d4' }] },
  { tokens: [{ text: '  .write_key = ', c: '#d4d4d4' }, { text: '"hk_live_xxxx"', c: '#ce9178' }, { text: ',', c: '#d4d4d4' }] },
  { tokens: [{ text: '  .device_id = ', c: '#d4d4d4' }, { text: 'DEVICE_ID', c: '#4ec9b0' }, { text: ',', c: '#d4d4d4' }] },
  { tokens: [{ text: '};', c: '#d4d4d4' }] },
  { tokens: [] },
  { tokens: [{ text: 'void ', c: '#569cd6' }, { text: 'app_main', c: '#dcdcaa' }, { text: '() {', c: '#d4d4d4' }] },
  { tokens: [{ text: '  ', c: '' }, { text: 'honch_init', c: '#dcdcaa' }, { text: '(&cfg);', c: '#d4d4d4' }] },
  { tokens: [{ text: '  ', c: '' }, { text: 'honch_track', c: '#dcdcaa' }, { text: '(', c: '#d4d4d4' }, { text: '"button_pressed"', c: '#ce9178' }, { text: ', NULL);', c: '#d4d4d4' }] },
  { tokens: [{ text: '}', c: '#d4d4d4' }] },
  { tokens: [] },
  { tokens: [{ text: '// yes, it\'s really that easy', c: '#6a9955' }] },
]

const sdks = [
  { name: "C / C++", icon: "/sdk/c.svg" },
  { name: "ESP-IDF", icon: "/sdk/esp.svg" },
  { name: "Zephyr", icon: "/sdk/zephyr.svg" },
  { name: "Arduino", icon: "/sdk/arduino.svg" },
  { name: "iOS", icon: "/sdk/ios.svg" },
  { name: "Android", icon: "/sdk/android.svg" },
]

export default function SDKSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-heading text-4xl tracking-tight md:text-5xl">
          Drop-in SDKs for every platform
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A lightweight SDK that lives on your device. Integrate in minutes, ship analytics from day one.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Code preview */}
        <pre className="overflow-x-auto bg-[#1e1e1e] p-4 text-[13px] leading-6 font-mono rounded-md">
            {codeLines.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-6 shrink-0 select-none text-right pr-3 text-[11px]" style={{ color: '#858585' }}>
                  {i + 1}
                </span>
                <span>
                  {line.tokens.length === 0
                    ? "\n"
                    : line.tokens.map((t, j) => (
                        <span key={j} style={{ color: t.c || undefined }}>{t.text}</span>
                      ))}
                </span>
              </div>
            ))}
          </pre>

        {/* SDK grid */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-3">
            {sdks.map((sdk) => (
              <div key={sdk.name} className="group relative flex flex-col items-center gap-4 rounded-2xl border bg-card p-6 transition-shadow duration-300">
                <div className="relative flex size-20 items-center justify-center rounded-xl border bg-background shadow-sm transition-opacity duration-300 group-hover:opacity-0">
                  <img src={sdk.icon} alt={sdk.name} className="size-10 object-contain" />
                </div>

                <span className="absolute size-1.5 rounded-full bg-muted-foreground/25 transition-[top,left] duration-300 ease-in-out top-7.5 left-[calc(50%-2.5rem+6px)] group-hover:top-3 group-hover:left-3" />
                <span className="absolute size-1.5 rounded-full bg-muted-foreground/25 transition-[top,left] duration-300 ease-in-out top-7.5 left-[calc(50%+2.5rem-6px-0.375rem)] group-hover:top-3 group-hover:left-[calc(100%-12px-0.375rem)]" />
                <span className="absolute size-1.5 rounded-full bg-muted-foreground/25 transition-[top,left] duration-300 ease-in-out top-[calc(1.5rem+5rem-6px-0.375rem)] left-[calc(50%-2.5rem+6px)] group-hover:top-[calc(100%-12px-0.375rem)] group-hover:left-3" />
                <span className="absolute size-1.5 rounded-full bg-muted-foreground/25 transition-[top,left] duration-300 ease-in-out top-[calc(1.5rem+5rem-6px-0.375rem)] left-[calc(50%+2.5rem-6px-0.375rem)] group-hover:top-[calc(100%-12px-0.375rem)] group-hover:left-[calc(100%-12px-0.375rem)]" />

                <span className="text-sm font-semibold transition-opacity duration-300 group-hover:opacity-0">{sdk.name}</span>

                <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-sm font-semibold">{sdk.name}</span>
                  <span className="text-xs text-muted-foreground">Check out docs →</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
