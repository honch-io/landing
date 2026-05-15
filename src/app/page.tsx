import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import LogoBar from "@/components/LogoBar"
import SDKSection from "@/components/SDKSection"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"

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
      <Hero />
      <SectionDivider />
      <LogoBar />
      <SectionDivider />
      <SDKSection />
      <SectionDivider />
      <CTA />
      <SectionDivider />
      <Footer />
    </div>
  )
}
