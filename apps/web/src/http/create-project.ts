import { api } from './api-client'

export interface CreateProjectRequest {
  name: string
  description: string | null
  organizationSlug: string
}

export type CreateProjectResponse = void

export async function createProject({
  name,
  description,
  organizationSlug,
}: CreateProjectRequest): Promise<CreateProjectResponse> {
  await api.post(`organizations/${organizationSlug}/projects`, {
    json: {
      name,
      description,
    },
  })
}
