import { join } from 'path'
import { readdirSync } from 'fs'
import { Express, Router } from 'express'

export const setupRoutes = (app: Express) => {
  const router = Router()

  app.use('/', router)

  readdirSync(join(__dirname, './routes')).map(async file => {
    if (!file.endsWith('.map')) {
      (await import(`./routes/${file}`)).default(router)
    }
  })
}
