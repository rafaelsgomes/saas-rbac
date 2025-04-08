'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrganization } from '@/auth/auth'
import { createOrganization } from '@/http/create-organization'
import { updateOrganization } from '@/http/update-organization'

const organizationSchema = z
  .object({
    name: z.string().min(4, {
      message: 'Please include at least 4 characters',
    }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/

            return domainRegex.test(value)
          }

          return true
        },
        { message: 'Please, enter a valid domain' },
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === 'on' || value === true)
      .default(false),
  })
  .refine(
    (data) => {
      if (
        data.shouldAttachUsersByDomain === true &&
        (!data.domain || data.domain === '' || data.domain === undefined)
      ) {
        return false
      }

      return true
    },
    {
      message:
        'You must provide a domain if you want to attach users by domain',
      path: ['domain'],
    },
  )

export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(data: FormData) {
  const formDataParsed = organizationSchema.safeParse(Object.fromEntries(data))

  if (!formDataParsed.success) {
    const errors = formDataParsed.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { domain, name, shouldAttachUsersByDomain } = formDataParsed.data

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
    })

    revalidateTag('organizations')
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
    message: 'Successfully saved the Organization',
    errors: null,
  }
}

export async function updateOrganizationAction(data: FormData) {
  const currentOrganization = await getCurrentOrganization()
  const formDataParsed = organizationSchema.safeParse(Object.fromEntries(data))

  if (!formDataParsed.success) {
    const errors = formDataParsed.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { domain, name, shouldAttachUsersByDomain } = formDataParsed.data

  try {
    await updateOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
      organizationSlug: currentOrganization!,
    })

    revalidateTag('organizations')
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
    message: 'Successfully saved the Organization',
    errors: null,
  }
}
