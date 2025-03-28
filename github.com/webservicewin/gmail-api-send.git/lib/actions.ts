"use server"
import type { EmailData, EmailHistoryItem, EmailTemplate } from "@/lib/types"
import { getGmailClient } from "@/lib/gmail"
import { kv } from "@vercel/kv"

// Environment variable management
export async function saveEnvironmentVariables(variables: Record<string, string>): Promise<void> {
  try {
    // In a real app, you would use a secure storage solution
    // For this example, we'll use Vercel KV (Redis)
    await kv.hset("app:config", variables)
  } catch (error) {
    console.error("Failed to save environment variables:", error)
    throw new Error("Failed to save configuration")
  }
}

export async function getEnvironmentVariables(): Promise<Record<string, string>> {
  try {
    // Get all environment variables from KV store
    const variables = ((await kv.hgetall("app:config")) as Record<string, string>) || {}
    return variables
  } catch (error) {
    console.error("Failed to get environment variables:", error)
    return {}
  }
}

export async function checkConfiguration(): Promise<{ configured: boolean }> {
  try {
    const variables = await getEnvironmentVariables()
    const requiredVars = ["APP_DOMAIN", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI"]

    // Check if all required variables are present
    const configured = requiredVars.every((varName) => variables[varName] && variables[varName].trim() !== "")

    return { configured }
  } catch (error) {
    console.error("Failed to check configuration:", error)
    return { configured: false }
  }
}

// Email sending functionality
export async function sendBatchEmails(emailsData: EmailData[]) {
  try {
    // Get environment variables
    const config = await getEnvironmentVariables()

    // Get Gmail client with dynamic config
    const gmail = await getGmailClient(config)

    if (!gmail) {
      throw new Error("Failed to initialize Gmail client. Please sign in again.")
    }

    // Create batch request
    const batch = gmail.newBatchRequest()

    // Track results
    const results = {
      success: 0,
      failures: [] as { index: number; error: string }[],
    }

    // Add each email to batch
    emailsData.forEach((emailData, index) => {
      try {
        // Create raw email message
        const message = createEmailMessage(emailData)

        // Add to batch
        batch.add(
          gmail.users.messages.send({
            userId: "me",
            requestBody: { raw: message },
          }),
          { id: index.toString() },
        )
      } catch (error) {
        results.failures.push({
          index,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    })

    // Execute batch if we have valid requests
    if (batch.size > 0) {
      const responses = await batch.execute()

      // Process responses
      if (responses && responses.length > 0) {
        responses.forEach((response) => {
          if (response && response.status === 200) {
            results.success++
          }
        })
      }
    }

    // Save to history
    await saveToHistory(emailsData, results)

    return results
  } catch (error) {
    console.error("Error sending batch emails:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to send emails")
  }
}

function createEmailMessage(emailData: EmailData): string {
  // Get user email from session
  const userEmail = "user@example.com" // This would come from the session

  // Create email parts
  const email =
    `From: ${userEmail}\r\n` +
    `To: ${emailData.to}\r\n` +
    `Subject: ${emailData.subject}\r\n` +
    "Content-Type: text/html; charset=UTF-8\r\n\r\n" +
    emailData.body

  // Base64 encode for Gmail API
  return Buffer.from(email).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function saveToHistory(emailsData: EmailData[], results: { success: number; failures: any[] }) {
  // In a real app, this would save to a database
  console.log("Saving to history:", { emailsData, results })
}

export async function getEmailHistory(): Promise<EmailHistoryItem[]> {
  // In a real app, this would fetch from a database
  return [
    {
      id: "1",
      subject: "Welcome Email",
      recipients: ["user1@example.com", "user2@example.com"],
      timestamp: new Date().toISOString(),
      success: true,
    },
    {
      id: "2",
      subject: "Failed Email",
      recipients: ["invalid@example.com"],
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      success: false,
      error: "Invalid recipient",
    },
  ]
}

export async function getTemplates(): Promise<EmailTemplate[]> {
  // In a real app, this would fetch from a database
  return [
    {
      id: "1",
      name: "Welcome Email",
      subject: "Welcome to our platform!",
      body: "<h1>Welcome!</h1><p>Thank you for joining our platform.</p>",
    },
    {
      id: "2",
      name: "Newsletter",
      subject: "Monthly Newsletter",
      body: "<h1>Newsletter</h1><p>Here are the latest updates...</p>",
    },
  ]
}

export async function saveTemplate(template: EmailTemplate): Promise<void> {
  // In a real app, this would save to a database
  console.log("Saving template:", template)
}

export async function deleteTemplate(id: string): Promise<void> {
  // In a real app, this would delete from a database
  console.log("Deleting template:", id)
}

