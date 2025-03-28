import type { Metadata } from "next"
import { EmailDashboard } from "@/components/email-dashboard"
import { NavBar } from "@/components/nav-bar"
import { HeroSection } from "@/components/hero-section"

export const metadata: Metadata = {
  title: "Gmail Batch Email Sender",
  description: "Send multiple emails in batch using Gmail API",
}

export default function Home() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col items-start gap-6 py-8 md:py-12">
          <EmailDashboard />
        </div>
      </main>
    </>
  )
}

