import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Decarbonize Your House",
  description: "EAS 574 classroom activity"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}