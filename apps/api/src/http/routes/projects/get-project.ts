import { projectSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '../../../lib/prisma'
import { getUserPermissions } from '../../../utils/get-user-permissions'
import { auth } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function GetProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get a Project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string().describe('Organization slug'),
            projectSlug: z.string().uuid().describe('Project slug'),
          }),
          response: {
            200: z.object({
              project: z.object({
                name: z.string(),
                id: z.string().uuid(),
                organizationId: z.string().uuid(),
                slug: z.string(),
                avatarUrl: z.string().url().nullable(),
                ownerId: z.string().uuid(),
                description: z.string(),
                owner: z.object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().url().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { orgSlug, projectSlug } = request.params
        const { membership, organization } =
          await request.getUserMembership(orgSlug)

        const project = await prisma.project.findUnique({
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            ownerId: true,
            description: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found')
        }

        const authProject = projectSchema.parse(project)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', authProject)) {
          throw new UnauthorizedError('You are not allowed to see this project')
        }

        return reply.status(200).send({ project })
      },
    )
}
