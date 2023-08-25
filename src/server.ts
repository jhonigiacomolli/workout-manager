import 'dotenv/config'
import './configurations/module-alias'

import express, { json } from 'express'
import { serve, setup } from 'swagger-ui-express'
import { useRouteController } from './helpers/http'
import { swaggerNoCache } from './middlewares/cache/swagger-no-cache'
import { swaggerConfigurations } from './documentation/configurations'
import { pagination } from './middlewares/pagination/pagination-middleware'
import { authentication } from './factories/middlewares/make-authentication-middleware'
import {
  makeAccountLoadAllItemsController,
  makeAccountRemoveController,
  makeAccountUpdateController,
  makeRefreshTokenController,
  makeSignInController,
  makeSignUpController,
  makeTeamCreateController,
  makeTeamLoadAllItemsController,
  makeTeamLoadItemController,
} from './factories/controllers'

export const app = express()
app.use('/docs', swaggerNoCache, serve, setup(swaggerConfigurations))
app.use(json())
app.use(pagination)

app.post('/sign-up', useRouteController(makeSignUpController()))
app.post('/sign-in', useRouteController(makeSignInController()))
app.post('/refresh-token', useRouteController(makeRefreshTokenController()))
app.get('/accounts', authentication, useRouteController(makeAccountLoadAllItemsController()))
app.put('/accounts/:id', authentication, useRouteController(makeAccountUpdateController()))
app.delete('/accounts/:id', authentication, useRouteController(makeAccountRemoveController()))
app.get('/teams/:id', authentication, useRouteController(makeTeamLoadItemController()))
app.get('/teams', authentication, useRouteController(makeTeamLoadAllItemsController()))
app.post('/teams', authentication, useRouteController(makeTeamCreateController()))

app.listen(3008, () => { console.log('Server is running on https://localhost:3008') })
