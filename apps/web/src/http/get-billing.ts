import { api } from './api-client'

export interface GetBillingResponse {
  billing: {
    seats: {
      amount: number
      unit: number
      price: number
    }
    projects: {
      amount: number
      unit: number
      price: number
    }
    total: number
  }
}

export async function getBilling(organizationSlug: string) {
  const result = await api
    .get(`organizations/${organizationSlug}/billing`)
    .json<GetBillingResponse>()

  return result
}
