import { XOctagon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { revokeInviteAction } from './actions'

export function RevokeInviteButton({ inviteId }: { inviteId: string }) {
  return (
    <form action={revokeInviteAction.bind(null, inviteId)}>
      <Button type="submit" size="sm" variant="destructive">
        <XOctagon className="mr-2 size-4" />
        Revoke Invite
      </Button>
    </form>
  )
}
