import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckCircle, LayoutDashboard, LogIn, LogOut } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth, isAuthenticated } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { acceptInvite } from '@/http/accept-invite'
import { getInvite } from '@/http/get-invite'

dayjs.extend(relativeTime)

interface InvitePageProps {
  params: {
    id: string
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { id } = params
  const { invite } = await getInvite(id)
  const isUserAuthenticated = await isAuthenticated()
  const { user } = await auth()
  const userIsAuthenticatedWithSameEmailFromInvite = isUserAuthenticated
    ? user.email === invite.email
    : false

  async function signInFromInvite() {
    'use server'
    const cookieStore = await cookies()

    cookieStore.set('invite', id)

    redirect(`/auth/sign-in?email=${invite.email}`)
  }

  async function acceptInviteAction() {
    'use server'
    await acceptInvite(id)

    redirect(`/`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite.author?.avatarUrl && (
              <AvatarImage src={invite.author.avatarUrl} />
            )}
            <AvatarFallback />
          </Avatar>
          <p className="text-muted-foreground text-center leading-relaxed text-balance">
            <span className="text-foreground font-medium">
              {invite.author?.name ?? 'Someone'}
            </span>{' '}
            invited you to join{' '}
            <span className="text-foreground font-medium">
              {invite.organization.name}
            </span>
            .{' '}
            <span className="text-xs">
              {dayjs(invite.createdAt).fromNow()}{' '}
            </span>
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button type="submit" variant="secondary" className="w-full">
              <LogIn className="mr-2 size-4" />
              Sign in to accept the invite
            </Button>
          </form>
        )}

        {userIsAuthenticatedWithSameEmailFromInvite && (
          <form action={acceptInviteAction}>
            <Button type="submit" variant="secondary" className="w-full">
              <CheckCircle className="mr-2 size-4" />
              Join {invite.organization.name}
            </Button>
          </form>
        )}

        {isUserAuthenticated && !userIsAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center text-sm leading-relaxed text-balance">
              This invite was sent to{' '}
              <span className="text-foreground font-medium">
                {invite.email}
              </span>{' '}
              but your are currently authenticated with{' '}
              <span className="text-foreground font-medium">{user.email}</span>{' '}
            </p>
            <div className="space-y-2">
              <Button className="w-full" variant="secondary" asChild>
                <a href="/api/auth/sign-out">
                  <LogOut className="mr-2 size-4" />
                  Sign ou from {user.email}
                </a>
              </Button>

              <Button className="w-full" variant="outline" asChild>
                <Link href="/">
                  <LayoutDashboard className="mr-2 size-4" />
                  Back to dashboard
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
