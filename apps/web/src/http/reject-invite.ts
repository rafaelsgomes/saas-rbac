import { api } from './api-client'

export interface RejectInviteRequest {
  inviteId: string
}

export type RejectInviteResponse = void

export async function rejectInvite({ inviteId }: RejectInviteRequest) {
  const result = await api
    .delete(`invites/${inviteId}/reject`)
    .json<RejectInviteResponse>()

  return result
}
