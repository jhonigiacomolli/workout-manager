import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'

import { swaggerNoCache } from '@/middlewares'
import { swaggerConfigurations } from '@/documentation/configurations'

export const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerNoCache, serve, setup(swaggerConfigurations))
}
