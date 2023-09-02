import { accountListPath, accountRemovePath, accountUpdatePath, signUpPath, signInPath, refreshTokenPath } from './paths/accounts'
import { teamGetPath, teamsListPath } from './paths/teams'
import { teamCreatePath } from './paths/teams/team-create-path'
import { teamRemovePath } from './paths/teams/team-remove-path'
import { teamUpdatePath } from './paths/teams/team-update-path'
import { workspaceCreatePath } from './paths/workspaces/workspace-create-path'
import { workspaceListPath } from './paths/workspaces/workspace-list-path'
import { accountCreateReturnSchema, accountModelSchema, accountUpdateParamsSchema, errorSchema, messageSchema, teamModelSchema, workspaceCreateParamsSchema, workspaceCreateRetunrSchema, workspaceModelSchema } from './schemas'
import { accountCreateParamsSchema } from './schemas/accounts/create-account-parms-schema'
import { teamModelParamsSchema } from './schemas/teams/team-model--params-schema'

export const swaggerConfigurations = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Workout Manager API',
  },
  tags: [
    'Account',
    'Team',
    'Workspace',
  ],
  paths: {
    '/sign-up': signUpPath,
    '/sign-in': signInPath,
    'refresh-token': refreshTokenPath,
    '/accounts': accountListPath,
    '/accounts/{id}': {
      delete: accountRemovePath,
      put: accountUpdatePath,
    },
    '/teams': {
      get: teamsListPath,
      post: teamCreatePath,
    },
    '/teams/{id}': {
      get: teamGetPath,
      delete: teamRemovePath,
      put: teamUpdatePath,
    },
    '/workspaces': {
      get: workspaceListPath,
      post: workspaceCreatePath,
    },
  },
  schemas: {
    error: errorSchema,
    message: messageSchema,
    accountModel: accountModelSchema,
    accountCreateParams: accountCreateParamsSchema,
    accountCreateReturns: accountCreateReturnSchema,
    accountUpdateParams: accountUpdateParamsSchema,
    teamModel: teamModelSchema,
    teamModelParams: teamModelParamsSchema,
    workspaceModel: workspaceModelSchema,
    workspaceCreateParams: workspaceCreateParamsSchema,
    workspaceCreateReturns: workspaceCreateRetunrSchema,
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
  security: [
    {
      bearerAuth: [],
    },
  ],
}
