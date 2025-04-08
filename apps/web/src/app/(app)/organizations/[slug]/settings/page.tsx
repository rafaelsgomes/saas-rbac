import { OrganizationForm } from '@/app/(app)/organizations/organization-form'
import { ability, getCurrentOrganization } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getOrganization } from '@/http/get-organization'

import { Billing } from './billing'
import { ShutdownOrganizationButton } from './shutdown-organization-button'

export default async function Settings() {
  const currentOrganization = await getCurrentOrganization()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canShutdownOrganization = permissions?.can('delete', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')

  const { organization } = await getOrganization({
    organizationSlug: currentOrganization!,
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Update your organization details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationForm
                isUpdating
                initialData={{
                  domain: organization.domain,
                  name: organization.name,
                  shouldAttachUsersByDomain:
                    organization.shouldAttachUsersByDomain,
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
      {canGetBilling && <Billing />}

      {canShutdownOrganization && (
        <Card>
          <CardHeader>
            <CardTitle>Shutdown Organization</CardTitle>
            <CardDescription>
              This will delete all organization data including all projects. You
              cannot undo this action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShutdownOrganizationButton />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
