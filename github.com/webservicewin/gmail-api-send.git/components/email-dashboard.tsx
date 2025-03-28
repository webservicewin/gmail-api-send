"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmailForm } from "@/components/email-form"
import { EmailHistory } from "@/components/email-history"
import { EmailTemplates } from "@/components/email-templates"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { Mail, FileText, History } from "lucide-react"

export function EmailDashboard() {
  const { isAuthenticated, user } = useGoogleAuth()
  const [activeTab, setActiveTab] = useState("compose")

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-10 p-8 border-2 border-blue-100 dark:border-blue-900/30 rounded-lg shadow-lg bg-white dark:bg-gray-950 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sign in to continue</h2>
          <p className="mb-6 text-muted-foreground max-w-md mx-auto">
            You need to sign in with your Google account to send emails using the Gmail API.
          </p>
        </div>
        <div className="flex justify-center">
          <GoogleAuthButton />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {user?.image && (
            <img
              src={user.image || "/placeholder.svg"}
              alt={user.name || "User"}
              className="w-10 h-10 rounded-full border-2 border-blue-200 dark:border-blue-800"
            />
          )}
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger
            value="compose"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 py-3"
          >
            <Mail className="mr-2 h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 py-3"
          >
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 py-3"
          >
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="compose" className="animate-fade-in">
          <EmailForm />
        </TabsContent>
        <TabsContent value="templates" className="animate-fade-in">
          <EmailTemplates />
        </TabsContent>
        <TabsContent value="history" className="animate-fade-in">
          <EmailHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}

