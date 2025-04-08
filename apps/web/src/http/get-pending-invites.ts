import type { Role } from '@saas/auth'

import { api } from './api-client'

export interface GetPendingInvitesResponse {
  invites: {
    id: string
    role: Role
    createdAt: string
    email: string
    author: {
      name: string | null
      id: string
    } | null
    organization: {
      name: string
    }
  }[]
}

export async function getPendingInvites() {
  const result = await api
    .get(`invites/pending-invites`)
    .json<GetPendingInvitesResponse>()

  return result
}
