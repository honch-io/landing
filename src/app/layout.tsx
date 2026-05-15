import type { Metadata } from "next"
import "@/index.css"

export const metadata: Metadata = {
  title: "Honch",
  description: "Product analytics for the hardware you ship.",
  icons: { icon: "/icon.svg" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
