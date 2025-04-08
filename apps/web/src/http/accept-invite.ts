import { api } from './api-client'

export type AcceptInviteResponse = void

export async function acceptInvite(inviteId: string) {
  const result = await api
    .get(`invites/${inviteId}/accept`)
    .json<AcceptInviteResponse>()

  return result
}
