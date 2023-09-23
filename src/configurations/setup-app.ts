import express, { Express } from 'express'

import {
  setupRoutes,
  setupSwagger,
  setupMiddlewares,
  setupStaticFiles,
} from '@/configurations'

export const setupApp = (): Express => {
  const app = express()

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')

    // Set allowed HTTP methods
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

    // Set allowed headers
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
  })
  setupSwagger(app)
  setupMiddlewares(app)
  setupRoutes(app)
  setupStaticFiles(app)

  return app
}
