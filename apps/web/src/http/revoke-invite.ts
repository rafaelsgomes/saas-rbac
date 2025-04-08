import { api } from './api-client'

export interface RevokeInviteRequest {
  organizationSlug: string
  inviteId: string
}

export type RevokeInviteResponse = void

export async function revokeInvite({
  organizationSlug,
  inviteId,
}: RevokeInviteRequest) {
  const result = await api
    .delete(`organizations/${organizationSlug}/invites/${inviteId}/revoke`, {
      next: {
        tags: [`${organizationSlug}/invites`],
      },
    })
    .json<RevokeInviteResponse>()

  return result
}
