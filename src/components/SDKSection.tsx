import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

// Static code lines with manual syntax highlighting
// Colors: keyword=#569cd6, string=#ce9178, comment=#6a9955, type=#4ec9b0, number=#b5cea8, func=#dcdcaa, plain=#d4d4d4, preprocessor=#c586c0
const lines: { num: number; tokens: { text: string; color: string }[] }[] = [
  { num: 1, tokens: [{ text: '#include ', color: '#c586c0' }, { text: '"honch.h"', color: '#ce9178' }] },
  { num: 2, tokens: [] },
  { num: 3, tokens: [{ text: 'static ', color: '#569cd6' }, { text: 'honch_config_t', color: '#4ec9b0' }, { text: ' config = {', color: '#d4d4d4' }] },
  { num: 4, tokens: [{ text: '    .write_key = ', color: '#d4d4d4' }, { text: '"hk_live_xxxxxxxxxxxxx"', color: '#ce9178' }, { text: ',', color: '#d4d4d4' }] },
  { num: 5, tokens: [{ text: '    .device_id = ', color: '#d4d4d4' }, { text: 'DEVICE_UNIQUE_ID', color: '#4ec9b0' }, { text: ',', color: '#d4d4d4' }] },
  { num: 6, tokens: [{ text: '    .flush_interval_ms = ', color: '#d4d4d4' }, { text: '5000', color: '#b5cea8' }, { text: ',', color: '#d4d4d4' }] },
  { num: 7, tokens: [{ text: '};', color: '#d4d4d4' }] },
  { num: 8, tokens: [] },
  { num: 9, tokens: [{ text: 'void ', color: '#569cd6' }, { text: 'app_main', color: '#dcdcaa' }, { text: '(', color: '#d4d4d4' }, { text: 'void', color: '#569cd6' }, { text: ') {', color: '#d4d4d4' }] },
  { num: 10, tokens: [{ text: '    ', color: '' }, { text: 'honch_init', color: '#dcdcaa' }, { text: '(&config);', color: '#d4d4d4' }] },
  { num: 11, tokens: [] },
  { num: 12, tokens: [{ text: '    // your code...', color: '#6a9955' }] },
  { num: 13, tokens: [] },
  { num: 14, tokens: [{ text: '    ', color: '' }, { text: 'honch_event_t', color: '#4ec9b0' }, { text: ' props = {', color: '#d4d4d4' }] },
  { num: 15, tokens: [{ text: '        .count = ', color: '#d4d4d4' }, { text: '0', color: '#b5cea8' }, { text: ',', color: '#d4d4d4' }] },
  { num: 16, tokens: [{ text: '        .duration_ms = ', color: '#d4d4d4' }, { text: '1234', color: '#b5cea8' }, { text: ',', color: '#d4d4d4' }] },
  { num: 17, tokens: [{ text: '        .mode = ', color: '#d4d4d4' }, { text: '"burst"', color: '#ce9178' }] },
  { num: 18, tokens: [{ text: '    };', color: '#d4d4d4' }] },
  { num: 19, tokens: [] },
  { num: 20, tokens: [{ text: '    ', color: '' }, { text: 'honch_track', color: '#dcdcaa' }, { text: '(', color: '#d4d4d4' }, { text: '"espresso_brewed"', color: '#ce9178' }, { text: ', &props);', color: '#d4d4d4' }] },
  { num: 21, tokens: [{ text: '}', color: '#d4d4d4' }] },
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
    <section className="px-8 mt-50">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: SDK Code */}
        <div className="lg:w-[42%] flex-shrink-0">
          <h2 className="text-3xl font-bold tracking-tight">The SDK in action.</h2>
          <div className="bg-[#1e1e1e] rounded-xl overflow-hidden mt-6">
            <pre className="p-4 overflow-x-auto text-[12px] leading-[22px] font-mono">
              {lines.map((line) => (
                <div key={line.num} className="flex">
                  <span className="w-7 flex-shrink-0 text-right pr-2 select-none text-[11px]" style={{ color: '#858585' }}>
                    {String(line.num).padStart(2, "0")}
                  </span>
                  <span>
                    {line.tokens.length === 0 ? "\n" : line.tokens.map((t, i) => (
                      <span key={i} style={{ color: t.color || undefined }}>{t.text}</span>
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          </div>
          <p className="text-base mt-6 text-copy-light">That's the integration. Seriously.</p>
        </div>

        {/* Right: SDK Support */}
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold tracking-tight">SDK support.</h2>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {sdks.map((sdk) => (
              <div key={sdk.name} className="bg-white rounded-lg border border-border p-4 flex flex-col items-center gap-2">
                <img src={sdk.icon} alt={sdk.name} className="h-10 w-10 object-contain" />
                <span className="text-sm font-bold text-copy">{sdk.name}</span>
                <span className="text-xs text-secondary font-medium flex items-center gap-1">
                  Quickstart <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-copy-light mt-4">Coming soon: Rust, embedded Linux, MicroPython.</p>
        </div>
      </div>
    </section>
  )
}
