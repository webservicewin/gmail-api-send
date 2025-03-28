"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, Trash2, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { sendBatchEmails } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

type Recipient = {
  id: string
  email: string
  subject: string
}

export function EmailForm() {
  const { toast } = useToast()
  const [recipients, setRecipients] = useState<Recipient[]>([{ id: crypto.randomUUID(), email: "", subject: "" }])
  const [emailBody, setEmailBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addRecipient = () => {
    setRecipients([...recipients, { id: crypto.randomUUID(), email: "", subject: "" }])
  }

  const removeRecipient = (id: string) => {
    if (recipients.length === 1) return
    setRecipients(recipients.filter((recipient) => recipient.id !== id))
  }

  const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
    setRecipients(recipients.map((recipient) => (recipient.id === id ? { ...recipient, [field]: value } : recipient)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const invalidRecipients = recipients.filter((r) => !r.email || !r.subject)
    if (invalidRecipients.length > 0) {
      toast({
        title: "Missing information",
        description: "All recipients must have an email and subject",
        variant: "destructive",
      })
      return
    }

    if (!emailBody.trim()) {
      toast({
        title: "Missing email body",
        description: "Please enter an email body",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const emailsData = recipients.map((recipient) => ({
        to: recipient.email,
        subject: recipient.subject,
        body: emailBody,
      }))

      const result = await sendBatchEmails(emailsData)

      toast({
        title: "Emails sent successfully",
        description: `Successfully sent ${result.success} emails`,
      })

      // Reset form if all emails were sent successfully
      if (result.success === recipients.length) {
        setRecipients([{ id: crypto.randomUUID(), email: "", subject: "" }])
        setEmailBody("")
      }
    } catch (error) {
      toast({
        title: "Failed to send emails",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Recipients</h3>
          <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Recipient
          </Button>
        </div>

        {recipients.map((recipient, index) => (
          <Card key={recipient.id}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`email-${recipient.id}`}>Email</Label>
                  <Input
                    id={`email-${recipient.id}`}
                    type="email"
                    placeholder="recipient@example.com"
                    value={recipient.email}
                    onChange={(e) => updateRecipient(recipient.id, "email", e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`subject-${recipient.id}`}>Subject</Label>
                  <Input
                    id={`subject-${recipient.id}`}
                    placeholder="Email subject"
                    value={recipient.subject}
                    onChange={(e) => updateRecipient(recipient.id, "subject", e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6"
                  onClick={() => removeRecipient(recipient.id)}
                  disabled={recipients.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove recipient</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-body">Email Body (HTML supported)</Label>
        <Textarea
          id="email-body"
          placeholder="Enter your email content here..."
          className="min-h-[200px]"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Emails
          </>
        )}
      </Button>
    </form>
  )
}

