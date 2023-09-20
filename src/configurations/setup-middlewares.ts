import { Express, json } from 'express'

import { pagination, multiPartFormDataParser } from '@/middlewares'

export const setupMiddlewares = (app: Express) => {
  app.use(json())
  app.use(pagination)
  app.use(multiPartFormDataParser)
}
