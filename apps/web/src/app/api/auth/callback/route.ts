import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { acceptInvite } from '@/http/accept-invite'
import { signInWithGithub } from '@/http/sign-in-with-github'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      {
        message: 'Github OAuth code not found',
      },
      { status: 400 },
    )
  }

  const { token } = await signInWithGithub({
    code,
  })

  const cookiesStore = await cookies()

  cookiesStore.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // seven days
  })

  const inviteId = cookiesStore.get('inviteId')?.value

  if (inviteId) {
    try {
      await acceptInvite(inviteId)
      cookiesStore.delete('inviteId')
    } catch {}
  }

  const redirectURL = request.nextUrl.clone()

  redirectURL.pathname = '/'
  redirectURL.search = ''

  return NextResponse.redirect(redirectURL)
}
