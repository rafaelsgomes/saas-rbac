import { ability } from '@/auth/auth'

import { Invites } from './invites'
import { MembersList } from './members-list'

export default async function Members() {
  const permissions = await ability()

  const canGetMembers = permissions?.can('get', 'User')
  const canGetInvites = permissions?.can('get', 'Invite')
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>

      <div className="space-y-4">
        {canGetInvites && <Invites />}
        {canGetMembers && <MembersList />}
      </div>
    </div>
  )
}
