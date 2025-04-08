import { Role } from '@saas/auth'

import { api } from './api-client'

export interface GetUserOrganizationsResponse {
  organizations: {
    role: Role
    name: string
    id: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getUserOrganizations() {
  const result = await api
    .get('organizations')
    .json<GetUserOrganizationsResponse>()

  return result
}
