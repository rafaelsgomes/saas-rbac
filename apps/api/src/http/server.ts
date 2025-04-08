import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { env } from '@saas/env'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { AuthenticateWithGithub } from './routes/auth/authenticate-with-github'
import { AuthenticateWithPassword } from './routes/auth/authenticate-with-password'
import { CreateAccount } from './routes/auth/create-account'
import { GetProfile } from './routes/auth/get-profile'
import { RequestPasswordRecover } from './routes/auth/request-password-recover'
import { ResetPassword } from './routes/auth/reset-password'
import { GetOrganizationBilling } from './routes/billing/get-organization-billing'
import { AcceptInvite } from './routes/invites/accept-invite'
import { CreateInvite } from './routes/invites/create-invite'
import { GetInvite } from './routes/invites/get-invite'
import { GetInvites } from './routes/invites/get-invites'
import { GetPendingInvites } from './routes/invites/get-pending-invites'
import { RejectInvite } from './routes/invites/reject-invite'
import { RevokeInvite } from './routes/invites/revoke-invite'
import { GetMembers } from './routes/members/get-members'
import { RemoveMember } from './routes/members/remove-member'
import { UpdateMember } from './routes/members/update-member'
import { CreateOrganization } from './routes/orgs/create-organization'
import { GetMembership } from './routes/orgs/get-membership'
import { GetOrganization } from './routes/orgs/get-organization'
import { GetOrganizations } from './routes/orgs/get-organizations'
import { ShutdownOrganization } from './routes/orgs/shutdown-organization'
import { TransferOrganization } from './routes/orgs/transfer-organization'
import { UpdateOrganization } from './routes/orgs/update-organization'
import { CreateProject } from './routes/projects/create-project'
import { DeleteProject } from './routes/projects/delete-project'
import { GetProject } from './routes/projects/get-project'
import { GetProjects } from './routes/projects/get-projects'
import { UpdateProject } from './routes/projects/update-project'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'SaaS Rbac',
      description: 'Full-stack SaaS app with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(CreateAccount)
app.register(AuthenticateWithPassword)
app.register(AuthenticateWithGithub)
app.register(GetProfile)
app.register(RequestPasswordRecover)
app.register(ResetPassword)

app.register(CreateOrganization)
app.register(GetMembership)
app.register(GetOrganization)
app.register(GetOrganizations)
app.register(UpdateOrganization)
app.register(ShutdownOrganization)
app.register(TransferOrganization)

app.register(CreateProject)
app.register(DeleteProject)
app.register(GetProject)
app.register(GetProjects)
app.register(UpdateProject)

app.register(GetMembers)
app.register(UpdateMember)
app.register(RemoveMember)

app.register(CreateInvite)
app.register(GetInvite)
app.register(GetInvites)
app.register(AcceptInvite)
app.register(RejectInvite)
app.register(RevokeInvite)
app.register(GetPendingInvites)

app.register(GetOrganizationBilling)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
})
