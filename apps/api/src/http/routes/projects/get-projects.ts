import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '../../../lib/prisma'
import { getUserPermissions } from '../../../utils/get-user-permissions'
import { auth } from '../../middlewares/auth'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function GetProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get all organization Projects',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string().describe('Organization slug'),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
                  name: z.string(),
                  id: z.string().uuid(),
                  organizationId: z.string().uuid(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  ownerId: z.string().uuid(),
                  description: z.string(),
                  createdAt: z.date(),
                  owner: z.object({
                    id: z.string().uuid(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().url().nullable(),
                  }),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { slug } = request.params
        const { membership, organization } =
          await request.getUserMembership(slug)

        const projects = await prisma.project.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            ownerId: true,
            description: true,
            organizationId: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(
            'You are not allowed to see organization projects',
          )
        }

        return reply.status(200).send({ projects })
      },
    )
}
