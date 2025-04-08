import type { Role } from '@saas/auth'

import { api } from './api-client'

export interface GetInvitesResponse {
  invites: {
    id: string
    role: Role
    createdAt: string
    email: string
    author: {
      name: string | null
      id: string
    } | null
  }[]
}

export async function getInvites(organizationSlug: string) {
  const result = await api
    .get(`organizations/${organizationSlug}/invites`)
    .json<GetInvitesResponse>()

  return result
}
