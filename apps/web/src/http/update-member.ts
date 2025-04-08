import type { Role } from '@saas/auth'

import { api } from './api-client'

export interface UpdateMemberRequest {
  organizationSlug: string
  memberId: string
  role: Role
}

export type UpdateMemberResponse = void

export async function updateMember({
  organizationSlug,
  memberId,
  role,
}: UpdateMemberRequest): Promise<UpdateMemberResponse> {
  await api.put(`organizations/${organizationSlug}/members/${memberId}`, {
    json: {
      role,
    },
  })
}
