import express, { Express } from 'express'

import {
  setupRoutes,
  setupSwagger,
  setupMiddlewares,
} from '@/configurations'

export const setupApp = (): Express => {
  const app = express()

  setupSwagger(app)
  setupMiddlewares(app)
  setupRoutes(app)

  return app
}
