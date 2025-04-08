import { api } from './api-client'

export interface RemoveMemberRequest {
  organizationSlug: string
  memberId: string
}

export type RemoveMemberResponse = void

export async function removeMember({
  organizationSlug,
  memberId,
}: RemoveMemberRequest) {
  const result = await api
    .delete(`organizations/${organizationSlug}/members/${memberId}`, {
      next: {
        tags: [`${organizationSlug}/members`],
      },
    })
    .json<RemoveMemberResponse>()

  return result
}
