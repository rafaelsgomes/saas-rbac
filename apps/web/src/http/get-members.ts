import type { Role } from '@saas/auth'

import { api } from './api-client'

export interface GetMembersRequest {
  organizationSlug: string
}

export interface GetMembersResponse {
  members: {
    name: string | null
    id: string
    role: Role
    userId: string
    avatarUrl: string | null
    email: string
  }[]
}

export async function getMembers({ organizationSlug }: GetMembersRequest) {
  const result = await api
    .get(`organizations/${organizationSlug}/members`)
    .json<GetMembersResponse>()

  return result
}
