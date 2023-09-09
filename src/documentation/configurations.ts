import * as schemas from './schemas'
import * as accountsPaths from './paths/accounts'
import * as teamsPaths from './paths/teams'
import * as workspacesPaths from './paths/workspaces'
import * as boardsPaths from './paths/boards'

export const swaggerConfigurations = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Workout Manager API',
  },
  tags: [
    'Account',
    'Board',
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
      get: workspacesPaths.workspaceListPath,
      post: workspacesPaths.workspaceCreatePath,
    },
    '/workspaces/{id}': {
      get: workspacesPaths.workspaceGetPath,
      put: workspacesPaths.workspaceUpdatePath,
      delete: workspacesPaths.workspaceRemovePath,
    },
    '/boards': {
      post: boardsPaths.boardCreatePath,
      get: boardsPaths.boardListPath,
    },
    '/boards/{id}': {
      get: boardsPaths.boardGetPath,
      put: boardsPaths.boardUpdatePath,
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
    boardModel: schemas.boardModelSchema,
    boardCreateParams: schemas.boardCreateParamsSchema,
    boardCreateReturns: schemas.boardCreateReturnSchema,
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
