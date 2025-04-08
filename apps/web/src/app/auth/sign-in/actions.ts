'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { acceptInvite } from '@/http/accept-invite'
import { signInWithPassword } from '@/http/sign-in-with-password'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address' }),
  password: z.string().min(6, { message: 'Please provide your password' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const formDataParsed = signInSchema.safeParse(Object.fromEntries(data))

  if (!formDataParsed.success) {
    const errors = formDataParsed.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password } = formDataParsed.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    const cookiesStore = await cookies()

    cookiesStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // seven days
    })

    const inviteId = cookiesStore.get('inviteId')?.value

    if (inviteId) {
      try {
        await acceptInvite(inviteId)
        cookiesStore.delete('inviteId')
      } catch {}
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    }
  }

  return {
    success: true,
    message: null,
    errors: null,
  }
}
