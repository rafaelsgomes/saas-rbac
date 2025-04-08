import { api } from './api-client'

export interface GetOrganizationRequest {
  organizationSlug: string
}

export interface GetOrganizationResponse {
  organization: {
    name: string
    id: string
    slug: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
    ownerId: string
  }
}

export async function getOrganization({
  organizationSlug,
}: GetOrganizationRequest) {
  const result = await api
    .get(`organizations/${organizationSlug}`, {
      next: {
        tags: ['organizations'],
      },
    })
    .json<GetOrganizationResponse>()

  return result
}
