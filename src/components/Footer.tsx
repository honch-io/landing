import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-10 py-8">
      <a href="/" className="flex items-center gap-1.5">
        <img src="/icon.svg" className="h-8 w-8"/>
      </a>

      <nav className="hidden items-center gap-1 md:flex">
        {["Privacy", "Terms", "Docs"].map((item) => (
          <Button key={item} variant="ghost" size="sm" className="text-muted-foreground">
            {item}
          </Button>
        ))}
      </nav>

      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Honch
      </p>
    </footer>
  )
}
