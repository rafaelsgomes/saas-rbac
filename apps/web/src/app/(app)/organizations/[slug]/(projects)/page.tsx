import { Plus } from 'lucide-react'
import Link from 'next/link'

import { ability, getCurrentOrganization } from '@/auth/auth'
import { Button } from '@/components/ui/button'

import { ProjectsList } from './project-list'

export default async function Projects() {
  const currentOrg = await getCurrentOrganization()
  const permissions = await ability()

  const canCreateProject = permissions?.can('create', 'Project')
  const canGetProjects = permissions?.can('get', 'Project')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {canCreateProject && (
          <Button size="sm" asChild>
            <Link href={`/organizations/${currentOrg!}/create-project`}>
              <Plus className="mr-2 size-4" /> Create Project
            </Link>
          </Button>
        )}
      </div>

      {canGetProjects ? (
        <ProjectsList />
      ) : (
        <p>You are not allowed to see organization projects.</p>
      )}
    </div>
  )
}
