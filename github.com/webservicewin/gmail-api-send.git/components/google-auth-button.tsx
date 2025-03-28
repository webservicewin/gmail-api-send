"use client"

import { Button } from "@/components/ui/button"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { Loader2 } from "lucide-react"

export function GoogleAuthButton() {
  const { login, logout, isAuthenticated, isLoading } = useGoogleAuth()

  if (isAuthenticated) {
    return (
      <Button variant="outline" onClick={logout} disabled={isLoading} className="rounded-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing Out...
          </>
        ) : (
          "Sign Out"
        )}
      </Button>
    )
  }

  return (
    <Button onClick={login} disabled={isLoading} size="lg" className="rounded-full px-8 py-6 text-base">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Connecting...
        </>
      ) : (
        "Sign in with Google"
      )}
    </Button>
  )
}

