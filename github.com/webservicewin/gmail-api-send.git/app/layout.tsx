import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import { ConfigCheck } from "@/components/config-check"

// Configure the font properly for SWC
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata = {
  title: "Gmail Batch Email Sender",
  description: "Send multiple emails in batch using Gmail API",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <ConfigCheck>{children}</ConfigCheck>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'