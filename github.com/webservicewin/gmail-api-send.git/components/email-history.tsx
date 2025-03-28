"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEmailHistory } from "@/lib/actions"
import type { EmailHistoryItem } from "@/lib/types"

export function EmailHistory() {
  const [history, setHistory] = useState<EmailHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getEmailHistory()
        setHistory(data)
      } catch (error) {
        console.error("Failed to fetch email history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No email history found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{item.subject}</CardTitle>
                <CardDescription>{new Date(item.timestamp).toLocaleString()}</CardDescription>
              </div>
              <Badge variant={item.success ? "default" : "destructive"}>{item.success ? "Sent" : "Failed"}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p>
                <strong>Recipients:</strong> {item.recipients.join(", ")}
              </p>
              {!item.success && item.error && (
                <p className="text-destructive mt-2">
                  <strong>Error:</strong> {item.error}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

