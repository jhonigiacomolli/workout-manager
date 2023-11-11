import * as schemas from './schemas'

import * as teamsPaths from './paths/teams'
import * as boardsPaths from './paths/boards'
import * as groupsPaths from './paths/groups'
import * as accountsPaths from './paths/accounts'
import * as elementsPaths from './paths/elements'
import * as workspacesPaths from './paths/workspaces'
import * as elementUpdatesPaths from './paths/element-updates'

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
    'Group',
    'Element',
    'Element Update',
  ],
  paths: {
    '/sign-up': accountsPaths.signUpPath,
    '/sign-in': accountsPaths.signInPath,
    '/refresh-token': accountsPaths.refreshTokenPath,
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
      delete: boardsPaths.boardRemovePath,
    },
    '/groups': {
      get: groupsPaths.groupListPath,
      post: groupsPaths.groupCreatePath,
    },
    '/groups/{id}': {
      get: groupsPaths.groupGetPath,
      put: groupsPaths.groupUpdatePath,
      delete: groupsPaths.groupRemovePath,
    },
    '/elements': {
      get: elementsPaths.elementListPath,
      post: elementsPaths.elementCreatePath,
    },
    '/elements/{id}': {
      get: elementsPaths.elementGetPath,
      put: elementsPaths.elementUpdatePath,
      delete: elementsPaths.elementRemovePath,
    },
    '/element-updates': {
      get: elementUpdatesPaths.elementUpdateListPath,
      post: elementUpdatesPaths.elementUpdateCreatePath,
    },
    '/element-updates/{id}': {
      get: elementUpdatesPaths.elementUpdateGetPath,
      put: elementUpdatesPaths.elementUpdateUpdatePath,
      delete: elementUpdatesPaths.elementUpdateRemovePath,
    },
  },
  schemas: {
    error: schemas.errorSchema,
    message: schemas.messageSchema,
    accountModel: schemas.accountModelSchema,
    accountCreateParams: schemas.accountCreateParamsSchema,
    accountCreateReturns: schemas.accountCreateReturnSchema,
    accountUpdateParams: schemas.accountUpdateJsonParamsSchema,
    accountUpdateParamsMultipart: schemas.accountUpdateMultipartParamsSchema,
    teamModel: schemas.teamModelSchema,
    teamModelParams: schemas.teamModelParamsSchema,
    workspaceModel: schemas.workspaceModelSchema,
    workspaceCreateParams: schemas.workspaceCreateParamsSchema,
    workspaceUpdateParams: schemas.workspaceUpdateParamsSchemaJson,
    workspaceUpdateParamsMultipart: schemas.workspaceUpdateParamsSchemaMultipart,
    workspaceCreateReturns: schemas.workspaceCreateRetunrSchema,
    boardModel: schemas.boardModelSchema,
    boardCreateParams: schemas.boardCreateParamsSchema,
    boardCreateReturns: schemas.boardCreateReturnSchema,
    groupModel: schemas.groupModelSchema,
    groupCreateParams: schemas.groupCreateParamsSchema,
    groupUpdateParams: schemas.groupUpdateParamsSchema,
    groupCreateReturns: schemas.groupCreateRetunrSchema,
    elementModel: schemas.elementModelSchema,
    elementCreateParams: schemas.elementCreateParamsSchema,
    elementUpdateParams: schemas.elementUpdateParamsSchema,
    elementCreateReturns: schemas.elementCreateReturnSchema,
    elementUpdateModel: schemas.elementUpdateModelSchema,
    elementUpdateCreateParams: schemas.elementUpdateCreateParamsSchema,
    elementUpdateUpdateJsonParams: schemas.elementUpdateUpdateParamsJsonSchema,
    elementUpdateUpdateMultipartParams: schemas.elementUpdateUpdateParamsMultipartSchema,
    elementUpdateCreateReturns: schemas.elementUpdateCreateReturnSchema,
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
