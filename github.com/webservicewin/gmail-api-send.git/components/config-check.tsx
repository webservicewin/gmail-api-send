"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { checkConfiguration } from "@/lib/actions"
import { SetupWizard } from "@/components/setup-wizard"
import { Loader2 } from "lucide-react"

export function ConfigCheck({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const result = await checkConfiguration()
        setIsConfigured(result.configured)
      } catch (error) {
        console.error("Failed to check configuration:", error)
        setIsConfigured(false)
      }
    }

    checkConfig()
  }, [])

  if (isConfigured === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Checking configuration...</p>
      </div>
    )
  }

  if (!isConfigured) {
    return <SetupWizard />
  }

  return <>{children}</>
}

