import { google } from "googleapis"
import { cookies } from "next/headers"

export async function getGmailClient(config?: Record<string, string>) {
  const cookieStore = cookies()
  const token = cookieStore.get("google_token")?.value

  if (!token) {
    return null
  }

  try {
    const tokenData = JSON.parse(token)

    // Use provided config or get from environment
    const clientId = config?.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
    const clientSecret = config?.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = config?.GOOGLE_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Missing Google OAuth configuration")
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

    oauth2Client.setCredentials(tokenData)

    return google.gmail({ version: "v1", auth: oauth2Client })
  } catch (error) {
    console.error("Failed to initialize Gmail client:", error)
    return null
  }
}

