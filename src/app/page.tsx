import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import HowItWorks from "@/components/HowItWorks"
import SDKSection from "@/components/SDKSection"
import AISection from "@/components/AISection"
import ComparisonSection from "@/components/ComparisonSection"
import PricingSection from "@/components/PricingSection"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"
import SectionSeparator from "@/components/SectionSeparator"
import TrackedSection from "@/components/TrackedSection"

export default function Page() {
  return (
    <div className="relative bg-primary">
      <Navbar />

      {/* Hero — full-width primary background.
          Pulled up under the sticky navbar (h-16 + pt-[17px] = 81px) so the
          grain texture fills behind the transparent navbar; pt restores content. */}
      <div className="relative -mt-[81px] flex flex-col overflow-hidden bg-primary pt-[81px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-repeat mix-blend-overlay"
          style={{ backgroundImage: "url(/noise-light.png)" }}
        />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
          <TrackedSection name="hero">
            <Hero />
          </TrackedSection>
        </div>
      </div>

      {/* Zigzag separator: primary → white */}
      <SectionSeparator />

      {/* White content sections */}
      <div className="bg-background">
        <div className="mx-auto w-full max-w-7xl">
          <TrackedSection name="how_it_works">
            <HowItWorks />
          </TrackedSection>

          <TrackedSection name="sdks">
            <SDKSection />
          </TrackedSection>

          <TrackedSection name="ai">
            <AISection />
          </TrackedSection>

          <TrackedSection name="comparison">
            <ComparisonSection />
          </TrackedSection>

          <TrackedSection name="pricing">
            <PricingSection />
          </TrackedSection>
        </div>
      </div>

      {/* CTA banner — orange, bridges the content into the footer */}
      <TrackedSection name="cta">
        <CTA />
      </TrackedSection>

      {/* Footer — full-width black */}
      <TrackedSection name="footer">
        <Footer />
      </TrackedSection>
    </div>
  )
}
