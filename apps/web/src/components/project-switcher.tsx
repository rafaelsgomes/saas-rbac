'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, Loader2, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { getProjects } from '@/http/get-projects'

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
import { Skeleton } from './ui/skeleton'

export function ProjectSwitcher() {
  const { slug: orgSlug, projectSlug } = useParams<{
    slug: string
    projectSlug: string
  }>()

  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, 'projects'],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
  })

  const projects = data?.projects

  const currentProject =
    projectSlug && projects
      ? projects.find((project) => project.slug === projectSlug)
      : null

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
          {isLoading ? (
            <>
              <Skeleton className="size-4 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </>
          ) : (
            <>
              {currentProject ? (
                <>
                  <Avatar className="size-4">
                    {currentProject.avatarUrl && (
                      <AvatarImage src={currentProject.avatarUrl} />
                    )}
                    <AvatarFallback />
                  </Avatar>
                  <span className="truncate text-left">
                    {currentProject.name}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">Select Project</span>
              )}
            </>
          )}
          {isLoading ? (
            <Loader2 className="text-muted-foreground ml-auto size-4 shrink-0 animate-spin" />
          ) : (
            <ChevronsUpDown className="text-muted-foreground ml-auto size-4 shrink-0" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          alignOffset={-16}
          sideOffset={12}
          className="w-[200px]"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Projects</DropdownMenuLabel>
            {projects?.map((project) => {
              return (
                <DropdownMenuItem key={project.id} asChild>
                  <Link
                    href={`/organizations/${orgSlug}/projects/${project.slug}`}
                  >
                    <Avatar className="mr-2 size-4">
                      {project.avatarUrl && (
                        <AvatarImage src={project.avatarUrl} />
                      )}
                      <AvatarFallback />
                    </Avatar>
                    <span className="line-clamp-1">{project.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/organizations/${orgSlug}/create-project`}>
              <PlusCircle className="mr-2 size-4" />
              Create new
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
