import { api } from './api-client'

export interface GetProjectsResponse {
  projects: {
    name: string
    id: string
    organizationId: string
    slug: string
    avatarUrl: string | null
    createdAt: string
    ownerId: string
    description: string
    owner: {
      name: string | null
      id: string
      avatarUrl: string | null
    }
  }[]
}

export async function getProjects(organizationSlug: string) {
  const result = await api
    .get(`organizations/${organizationSlug}/projects`)
    .json<GetProjectsResponse>()

  return result
}
