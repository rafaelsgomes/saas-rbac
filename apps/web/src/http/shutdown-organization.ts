import { api } from './api-client'

export interface ShutdownOrganizationRequest {
  organizationSlug: string
}

export type ShutdownOrganizationResponse = void

export async function shutdownOrganization({
  organizationSlug,
}: ShutdownOrganizationRequest) {
  const result = await api
    .delete(`organizations/${organizationSlug}`)
    .json<ShutdownOrganizationResponse>()

  return result
}
