import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '../../../lib/prisma'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function ResetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Reset password',
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body
      const token = await prisma.token.findUnique({
        where: {
          id: code,
        },
      })

      if (!token) {
        throw new UnauthorizedError('Invalid token')
      }

      const passwordHash = await hash(password, 6)

      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: token.userId,
          },
          data: {
            passwordHash,
          },
        }),

        prisma.token.delete({
          where: {
            id: code,
          },
        }),
      ])

      return reply.status(204).send()
    },
  )
}
