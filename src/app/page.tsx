import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import LogoBar from "@/components/LogoBar"
import HowItWorks from "@/components/HowItWorks"
import SDKSection from "@/components/SDKSection"
import Pricing from "@/components/Pricing"
import FAQ from "@/components/FAQ"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"
import TrackedSection from "@/components/TrackedSection"

function SectionDivider() {
  return (
    <div style={{ marginLeft: -1, marginRight: -1 }}>
      <div className="h-px w-full bg-border" />
    </div>
  )
}

export default function Page() {
  return (
    <div className="relative mx-auto min-h-screen max-w-7xl border-x">
      <Navbar />
      <TrackedSection name="hero">
        <Hero />
      </TrackedSection>
      <SectionDivider />
      <TrackedSection name="logo_bar">
        <LogoBar />
      </TrackedSection>
      <SectionDivider />
      <TrackedSection name="how_it_works">
        <HowItWorks />
      </TrackedSection>
      <SectionDivider />
      <TrackedSection name="sdks">
        <SDKSection />
      </TrackedSection>
      {/* <SectionDivider />
      <TrackedSection name="pricing">
        <Pricing />
      </TrackedSection> */}
      <SectionDivider />
      <TrackedSection name="faq">
        <FAQ />
      </TrackedSection>
      <SectionDivider />
      <TrackedSection name="cta">
        <CTA />
      </TrackedSection>
      <SectionDivider />
      <TrackedSection name="footer">
        <Footer />
      </TrackedSection>
    </div>
  )
}
