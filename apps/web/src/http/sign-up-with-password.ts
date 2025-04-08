import { api } from './api-client'

export interface SignUpWithPasswordRequest {
  name: string
  email: string
  password: string
}

export type SignUpWithPasswordResponse = void

export async function signUpWithPassword({
  name,
  email,
  password,
}: SignUpWithPasswordRequest): Promise<SignUpWithPasswordResponse> {
  await api.post('users', {
    json: {
      name,
      email,
      password,
    },
  })
}
