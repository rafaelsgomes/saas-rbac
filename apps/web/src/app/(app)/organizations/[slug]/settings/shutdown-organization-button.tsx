import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

import { getCurrentOrganization } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { shutdownOrganization } from '@/http/shutdown-organization'

export function ShutdownOrganizationButton() {
  async function shutdownOrganizationAction() {
    'use server'
    const currentOrganization = await getCurrentOrganization()

    await shutdownOrganization({ organizationSlug: currentOrganization! })

    redirect('/')
  }
  return (
    <form action={shutdownOrganizationAction}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="mr-2 size-4" />
        Shutdown Organization
      </Button>
    </form>
  )
}
