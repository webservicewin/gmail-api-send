import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { getEnvironmentVariables } from "@/lib/actions"

export async function GET(request: NextRequest) {
  try {
    // Get dynamic configuration
    const config = await getEnvironmentVariables()

    const clientId = config.GOOGLE_CLIENT_ID
    const clientSecret = config.GOOGLE_CLIENT_SECRET
    const redirectUri = config.GOOGLE_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect(new URL("/?error=missing_config", request.url))
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

    const scopes = [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ]

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
    })

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("OAuth signin error:", error)
    return NextResponse.redirect(new URL("/?error=auth_error", request.url))
  }
}

