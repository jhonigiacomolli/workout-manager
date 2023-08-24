import { accountListPath, accountRemovePath, accountUpdatePath, signUpPath, signInPath, refreshTokenPath } from './paths/accounts'
import { teamGetPath, teamsListPath } from './paths/teams'
import { teamCreatePath } from './paths/teams/team-create-path'
import { teamRemovePath } from './paths/teams/team-remove-path'
import { accountCreateReturnSchema, accountModelSchema, accountUpdateParamsSchema, errorSchema, messageSchema, teamModelSchema } from './schemas'
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
