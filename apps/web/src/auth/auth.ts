import { defineAbilityFor } from '@saas/auth'
import { cookies, cookies as nextCookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'

export async function isAuthenticated() {
  return !!(await nextCookies()).get('token')?.value
}

export async function getCurrentOrganization() {
  return (await cookies()).get('organization')?.value ?? null
}

export async function getCurrentMembership() {
  const organization = await getCurrentOrganization()

  if (!organization) {
    return null
  }

  const { membership } = await getMembership(organization)

  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}

export async function auth() {
  const cookies = await nextCookies()

  const token = cookies.get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const user = await getProfile()

    return user
  } catch {}
  redirect('/api/auth/sign-out')
}
