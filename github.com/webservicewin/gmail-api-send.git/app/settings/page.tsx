import type { Metadata } from "next"
import { SettingsForm } from "@/components/settings-form"
import { NavBar } from "@/components/nav-bar"

export const metadata: Metadata = {
  title: "Settings - Gmail Batch Email Sender",
  description: "Configure your Gmail Batch Email Sender application",
}

export default function SettingsPage() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col items-start gap-6 py-8 md:py-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Configure your application settings</p>
          </div>
          <SettingsForm />
        </div>
      </main>
    </>
  )
}

