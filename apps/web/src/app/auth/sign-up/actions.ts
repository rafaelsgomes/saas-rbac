'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signUpWithPassword } from '@/http/sign-up-with-password'

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please provide your full name',
    }),
    email: z
      .string()
      .email({ message: 'Please, provide a valid e-mail address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password confirmation does not match',
    path: ['password_confirmation'],
  })

export async function signUpWithEmailAndPassword(data: FormData) {
  const formDataParsed = signUpSchema.safeParse(Object.fromEntries(data))

  if (!formDataParsed.success) {
    const errors = formDataParsed.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password, name } = formDataParsed.data

  try {
    await signUpWithPassword({
      name,
      email,
      password,
    })
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
