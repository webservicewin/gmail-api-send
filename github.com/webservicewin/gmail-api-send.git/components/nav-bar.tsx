"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { Settings, Mail, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function NavBar() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useGoogleAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Gmail Batch Sender</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/settings"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/settings" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {user && (
            <div className="flex items-center gap-2">
              {user.image && (
                <img
                  src={user.image || "/placeholder.svg"}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full border border-blue-200 dark:border-blue-800"
                />
              )}
              <span className="text-sm font-medium hidden md:inline">{user.email}</span>
            </div>
          )}

          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>

          <Button variant="ghost" size="icon" onClick={logout} className="rounded-full">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

