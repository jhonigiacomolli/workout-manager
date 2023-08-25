import { Express, json } from 'express'

import { pagination } from '@/middlewares'

export const setupMiddlewares = (app: Express) => {
  app.use(json())
  app.use(pagination)
}
