"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEnvironmentVariables, saveEnvironmentVariables } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Globe, Mail, Save, AlertCircle } from "lucide-react"

export function SettingsForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("domain")

  const [domainConfig, setDomainConfig] = useState({
    domain: "",
  })

  const [googleConfig, setGoogleConfig] = useState({
    clientId: "",
    clientSecret: "",
    redirectUri: "",
  })

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getEnvironmentVariables()

        setDomainConfig({
          domain: config.APP_DOMAIN || "",
        })

        setGoogleConfig({
          clientId: config.GOOGLE_CLIENT_ID || "",
          clientSecret: config.GOOGLE_CLIENT_SECRET || "",
          redirectUri: config.GOOGLE_REDIRECT_URI || "",
        })
      } catch (error) {
        console.error("Failed to fetch configuration:", error)
        toast({
          title: "Failed to load settings",
          description: "Could not retrieve your current configuration",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [toast])

  const handleDomainConfigChange = (field: keyof typeof domainConfig, value: string) => {
    setDomainConfig((prev) => ({ ...prev, [field]: value }))

    // Update redirect URI when domain changes
    if (field === "domain") {
      setGoogleConfig((prev) => ({
        ...prev,
        redirectUri: `https://${value}/api/auth/callback`,
      }))
    }
  }

  const handleGoogleConfigChange = (field: keyof typeof googleConfig, value: string) => {
    setGoogleConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validate inputs
      if (!domainConfig.domain) {
        throw new Error("Domain is required")
      }

      if (!googleConfig.clientId || !googleConfig.clientSecret || !googleConfig.redirectUri) {
        throw new Error("All Google OAuth fields are required")
      }

      // Save environment variables
      await saveEnvironmentVariables({
        APP_DOMAIN: domainConfig.domain,
        GOOGLE_CLIENT_ID: googleConfig.clientId,
        GOOGLE_CLIENT_SECRET: googleConfig.clientSecret,
        GOOGLE_REDIRECT_URI: googleConfig.redirectUri,
      })

      toast({
        title: "Settings saved",
        description: "Your configuration has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Failed to save settings",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 w-full">
        <div className="animate-pulse text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl animate-fade-in">
      <Card className="shadow-lg border-2 border-blue-100 dark:border-blue-900/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Application Settings</CardTitle>
          <CardDescription className="text-base">Update your application configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger
                value="domain"
                className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30"
              >
                <Globe className="mr-2 h-4 w-4" />
                Domain
              </TabsTrigger>
              <TabsTrigger
                value="google"
                className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30"
              >
                <Mail className="mr-2 h-4 w-4" />
                Google OAuth
              </TabsTrigger>
            </TabsList>

            <TabsContent value="domain" className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-base">
                  Application Domain
                </Label>
                <Input
                  id="domain"
                  value={domainConfig.domain}
                  onChange={(e) => handleDomainConfigChange("domain", e.target.value)}
                  placeholder="yourdomain.com"
                  className="text-base py-6"
                  required
                />
                <p className="text-sm text-muted-foreground">This is the domain where your application is hosted</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Note</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      Changing your domain will require updating your Google OAuth configuration in the Google Cloud
                      Console.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="google" className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="client-id" className="text-base">
                  Google Client ID
                </Label>
                <Input
                  id="client-id"
                  value={googleConfig.clientId}
                  onChange={(e) => handleGoogleConfigChange("clientId", e.target.value)}
                  placeholder="Your Google OAuth Client ID"
                  className="text-base py-6"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-secret" className="text-base">
                  Google Client Secret
                </Label>
                <Input
                  id="client-secret"
                  type="password"
                  value={googleConfig.clientSecret}
                  onChange={(e) => handleGoogleConfigChange("clientSecret", e.target.value)}
                  placeholder="Your Google OAuth Client Secret"
                  className="text-base py-6"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  For security, we never display the full secret. Enter a new value to update it.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirect-uri" className="text-base">
                  Redirect URI
                </Label>
                <Input
                  id="redirect-uri"
                  value={googleConfig.redirectUri}
                  onChange={(e) => handleGoogleConfigChange("redirectUri", e.target.value)}
                  placeholder="https://your  e.target.value)}
                  placeholder="
                  https:className="text-base py-6" //your-domain.com/api/auth/callback"
                  required
                />
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-md border border-amber-200 dark:border-amber-800/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Important</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      Make sure this matches the redirect URI configured in your Google Cloud Console.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving} className="rounded-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

