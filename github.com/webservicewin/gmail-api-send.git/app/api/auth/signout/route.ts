import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  cookies().delete("google_token")
  cookies().delete("user_info")

  return NextResponse.json({ success: true })
}

