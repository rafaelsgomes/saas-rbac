import { api } from './api-client'

export interface UpdateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
  organizationSlug: string
}

export type UpdateOrganizationResponse = void

export async function updateOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
  organizationSlug,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  await api.put(`organizations/${organizationSlug}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
