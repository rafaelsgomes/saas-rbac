import { Role } from '@saas/auth'

import { api } from './api-client'

export interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    userId: string
    organizationId: string
  }
}

export async function getMembership(organizationSlug: string) {
  const result = await api
    .get(`organizations/${organizationSlug}/membership`)
    .json<GetMembershipResponse>()

  return result
}
