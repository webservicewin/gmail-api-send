"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveEnvironmentVariables } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2, AlertCircle, Globe, Mail } from "lucide-react"

export function SetupWizard() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("domain")
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const [domainConfig, setDomainConfig] = useState({
    domain: "gbot.webservice.win",
  })

  const [googleConfig, setGoogleConfig] = useState({
    clientId: "",
    clientSecret: "",
    redirectUri: typeof window !== "undefined" ? `https://gbot.webservice.win/api/auth/callback` : "",
  })

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
    setIsLoading(true)

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

      setIsComplete(true)

      toast({
        title: "Setup complete",
        description: "Your application is now configured and ready to use",
      })

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (error) {
      toast({
        title: "Setup failed",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isComplete) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">Setup Complete!</CardTitle>
          <CardDescription className="text-base">Your application is now configured and ready to use.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full rounded-full text-base py-6" onClick={() => router.refresh()}>
            Continue to Application
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-2 border-blue-100 dark:border-blue-900/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Application Setup</CardTitle>
          <CardDescription className="text-base">
            Configure your application to connect with Google services
          </CardDescription>
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
                <p className="text-sm text-muted-foreground">
                  This is the domain where your application will be hosted
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setActiveTab("google")} className="rounded-full">
                  Next: Google OAuth
                </Button>
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
                <p className="text-sm text-muted-foreground">
                  From Google Cloud Console &gt; APIs &amp; Services &gt; Credentials
                </p>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirect-uri" className="text-base">
                  Redirect URI
                </Label>
                <Input
                  id="redirect-uri"
                  value={googleConfig.redirectUri}
                  onChange={(e) => handleGoogleConfigChange("redirectUri", e.target.value)}
                  placeholder="https://your-domain.com/api/auth/callback"
                  className="text-base py-6"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This should match the redirect URI configured in your Google Cloud Console
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-md border border-amber-200 dark:border-amber-800/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Important</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      Make sure to add the following scopes to your Google OAuth consent screen:
                    </p>
                    <ul className="text-xs text-amber-700 dark:text-amber-400 mt-1 list-disc list-inside">
                      <li>https://www.googleapis.com/auth/gmail.send</li>
                      <li>https://www.googleapis.com/auth/userinfo.email</li>
                      <li>https://www.googleapis.com/auth/userinfo.profile</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("domain")} className="rounded-full">
                  Back to Domain
                </Button>
                <Button type="submit" disabled={isLoading} className="rounded-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Configuration...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </form>
  )
}

