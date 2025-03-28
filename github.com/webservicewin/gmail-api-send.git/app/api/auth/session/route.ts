import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const userInfo = cookies().get("user_info")?.value

  if (!userInfo) {
    return NextResponse.json({ user: null })
  }

  try {
    const user = JSON.parse(userInfo)
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}

