import { cookies as nextCookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const redirectURL = request.nextUrl.clone()

  redirectURL.pathname = '/auth/sign-in'

  const cookies = await nextCookies()

  cookies.delete('token')

  return NextResponse.redirect(redirectURL)
}
