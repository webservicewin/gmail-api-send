import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { cookies } from "next/headers"
import { getEnvironmentVariables } from "@/lib/actions"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", request.url))
  }

  try {
    // Get dynamic configuration
    const config = await getEnvironmentVariables()

    const clientId = config.GOOGLE_CLIENT_ID
    const clientSecret = config.GOOGLE_CLIENT_SECRET
    const redirectUri = config.GOOGLE_REDIRECT_URI
    const domain = config.APP_DOMAIN || request.headers.get("host") || ""

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect(new URL("/?error=missing_config", request.url))
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    })

    const { data } = await oauth2.userinfo.get()

    // Store tokens in cookies
    cookies().set({
      name: "google_token",
      value: JSON.stringify(tokens),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Store user info in cookies
    cookies().set({
      name: "user_info",
      value: JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.picture,
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Redirect to the home page
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const baseUrl = `${protocol}://${domain}`

    return NextResponse.redirect(new URL("/", baseUrl))
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(new URL("/?error=auth_error", request.url))
  }
}

