import * as schemas from './schemas'
import * as accountsPaths from './paths/accounts'
import * as teamsPaths from './paths/teams'
import * as wrokspacesPaths from './paths/workspaces'

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
    '/sign-up': accountsPaths.signUpPath,
    '/sign-in': accountsPaths.signInPath,
    'refresh-token': accountsPaths.refreshTokenPath,
    '/accounts': accountsPaths.accountListPath,
    '/accounts/{id}': {
      delete: accountsPaths.accountRemovePath,
      put: accountsPaths.accountUpdatePath,
    },
    '/teams': {
      get: teamsPaths.teamsListPath,
      post: teamsPaths.teamCreatePath,
    },
    '/teams/{id}': {
      get: teamsPaths.teamGetPath,
      delete: teamsPaths.teamRemovePath,
      put: teamsPaths.teamUpdatePath,
    },
    '/workspaces': {
      get: wrokspacesPaths.workspaceListPath,
      post: wrokspacesPaths.workspaceCreatePath,
    },
    '/workspaces/{id}': {
      get: wrokspacesPaths.workspaceGetPath,
    },
  },
  schemas: {
    error: schemas.errorSchema,
    message: schemas.messageSchema,
    accountModel: schemas.accountModelSchema,
    accountCreateParams: schemas.accountCreateParamsSchema,
    accountCreateReturns: schemas.accountCreateReturnSchema,
    accountUpdateParams: schemas.accountUpdateParamsSchema,
    teamModel: schemas.teamModelSchema,
    teamModelParams: schemas.teamModelParamsSchema,
    workspaceModel: schemas.workspaceModelSchema,
    workspaceCreateParams: schemas.workspaceCreateParamsSchema,
    workspaceCreateReturns: schemas.workspaceCreateRetunrSchema,
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
