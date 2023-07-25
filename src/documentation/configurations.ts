import { accountListPath, accountRemovePath, accountUpdatePath, signUpPath, signInPath, refreshTokenPath } from './paths/accounts'
import { accountModelSchema, accountUpdateParamsSchema, errorSchema, messageSchema } from './schemas'

export const swaggerConfigurations = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Workout Manager API',
  },
  tags: [
    'Account',
  ],
  paths: {
    '/sign-up': signUpPath,
    '/sign-in': signInPath,
    'refresh-token': refreshTokenPath,
    '/accounts': accountListPath,
    '/accounts/{id}': {
      ...accountRemovePath,
      ...accountUpdatePath,
    },
  },
  schemas: {
    error: errorSchema,
    message: messageSchema,
    accountModel: accountModelSchema,
    accountUpdateParams: accountUpdateParamsSchema,
  },
}
