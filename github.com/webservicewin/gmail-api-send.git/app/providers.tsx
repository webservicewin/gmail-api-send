"use client"

import type { ReactNode } from "react"
import { GoogleAuthProvider } from "@/hooks/use-google-auth"

export function Providers({ children }: { children: ReactNode }) {
  return <GoogleAuthProvider>{children}</GoogleAuthProvider>
}

