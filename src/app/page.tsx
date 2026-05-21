import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import LogoBar from "@/components/LogoBar"
import HowItWorks from "@/components/HowItWorks"
import SDKSection from "@/components/SDKSection"
import FAQ from "@/components/FAQ"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"
import TrackedSection from "@/components/TrackedSection"

function SectionDivider() {
  return (
    <div className="relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen">
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
      <SectionDivider />
      <TrackedSection name="faq">
        <FAQ />
      </TrackedSection>
      <SectionDivider />
      <div className="relative overflow-hidden">
        <img
          src="/footer-bg.png"
          alt=""
          className="absolute bottom-0 left-0 w-full h-auto"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-transparent" />

        <div className="relative z-10">
          <TrackedSection name="cta">
            <CTA />
          </TrackedSection>
          <TrackedSection name="footer">
            <Footer />
          </TrackedSection>
        </div>
      </div>
    </div>
  )
}
