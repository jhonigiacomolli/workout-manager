import { accountListPath, accountRemovePath, accountUpdatePath, signUpPath } from './paths/accounts'
import { accountModelSchema } from './schemas/accounts/account-model-schema'
import { accountUpdateParamsSchema } from './schemas/accounts/update-account-params-schema'
import { errorSchema } from './schemas/error-schema'
import { messageSchema } from './schemas/message-schema'

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
