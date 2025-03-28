"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string | null
  email: string
  image: string | null
}

type GoogleAuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined)

export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()

        if (data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error("Failed to check authentication status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async () => {
    setIsLoading(true)
    try {
      // Redirect to Google OAuth flow
      window.location.href = "/api/auth/signin"
    } catch (error) {
      console.error("Failed to sign in:", error)
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" })
      if (response.ok) {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to sign out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GoogleAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  )
}

export function useGoogleAuth() {
  const context = useContext(GoogleAuthContext)
  if (context === undefined) {
    throw new Error("useGoogleAuth must be used within a GoogleAuthProvider")
  }
  return context
}

