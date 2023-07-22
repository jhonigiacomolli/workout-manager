import { accountListPath, accountRemovePath, accountUpdatePath } from './paths/accounts'
import { accountModelSchema } from './schemas/accounts/account-model-schema'
import { accountUpdateParamsSchema } from './schemas/accounts/update-account-params-schema'
import { errorSchema } from './schemas/error-schema'

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
    '/accounts': accountListPath,
    '/accounts/{id}': {
      ...accountRemovePath,
      ...accountUpdatePath,
    },
  },
  schemas: {
    error: errorSchema,
    accountModel: accountModelSchema,
    accountUpdateParams: accountUpdateParamsSchema,
  },
}
