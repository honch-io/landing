import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between px-10">
      <a href="/" className="flex items-center gap-1.5">
        <span className="font-heading text-3xl font-black">honch<span className="text-muted-foreground">.</span></span>
      </a>

      <nav className="hidden items-center gap-1 md:flex">
        {["Product", "SDKs", "Docs", "Pricing"].map((item) => (
          <Button key={item} variant="ghost" size="sm" className="text-muted-foreground">
            {item}
          </Button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
          Log in
        </Button>
        <Button size="sm">
          Get started <ArrowRight />
        </Button>
      </div>
    </header>
  )
}
