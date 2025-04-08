import type { Role } from '@saas/auth'

import { api } from './api-client'

export interface CreateInviteRequest {
  email: string
  role: Role
  organizationSlug: string
}

export type CreateInviteResponse = void

export async function createInvite({
  email,
  role,
  organizationSlug,
}: CreateInviteRequest): Promise<CreateInviteResponse> {
  await api.post(`organizations/${organizationSlug}/invites`, {
    json: {
      email,
      role,
    },
  })
}
