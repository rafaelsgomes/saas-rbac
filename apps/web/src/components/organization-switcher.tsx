import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { getCurrentOrganization } from '@/auth/auth'
import { getUserOrganizations } from '@/http/get-user-organizations'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export async function OrganizationSwitcher() {
  const currentOrganization = await getCurrentOrganization()
  const { organizations } = await getUserOrganizations()

  const currentOrg = organizations.find(
    (organization) => organization.slug === currentOrganization,
  )

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
          {currentOrg ? (
            <>
              <Avatar className="size-4">
                {currentOrg.avatarUrl && (
                  <AvatarImage src={currentOrg.avatarUrl} />
                )}
                <AvatarFallback />
              </Avatar>
              <span className="truncate text-left">{currentOrg.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select organization</span>
          )}
          <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          alignOffset={-16}
          sideOffset={12}
          className="w-[200px]"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            {organizations.map((organization) => {
              return (
                <DropdownMenuItem key={organization.id} asChild>
                  <Link href={`/organizations/${organization.slug}`}>
                    <Avatar className="mr-2 size-4">
                      {organization.avatarUrl && (
                        <AvatarImage src={organization.avatarUrl} />
                      )}
                      <AvatarFallback />
                    </Avatar>
                    <span className="line-clamp-1">{organization.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/create-organization">
              <PlusCircle className="mr-2 size-4" />
              Create new
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
