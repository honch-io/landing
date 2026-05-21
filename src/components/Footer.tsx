export default function Footer() {
  return (
    <footer className="relative z-10 flex items-center justify-between px-10 py-8 pt-50">
      <a href="/" className="flex items-center gap-1.5">
        <img src="/icon.svg" className="h-8 w-8"/>
      </a>

      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Honch
      </p>
    </footer>
  )
}
