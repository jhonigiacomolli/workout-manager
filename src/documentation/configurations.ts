import { deleteAccountPath } from './paths/accounts/delete-account-path'
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
    '/accounts/{id}': deleteAccountPath,
  },
  schemas: {
    error: errorSchema,
  },
}
