import 'dotenv/config'
import './configurations/module-alias'

import express from 'express'
import { useRouteController } from './helpers/http'
import { authentication } from './factories/middlewares'
import { setupMiddlewares, setupSwagger } from './configurations'

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

setupSwagger(app)
setupMiddlewares(app)

app.post('/sign-up', useRouteController(makeSignUpController()))
app.post('/sign-in', useRouteController(makeSignInController()))
app.post('/refresh-token', useRouteController(makeRefreshTokenController()))
app.get('/accounts', authentication, useRouteController(makeAccountLoadAllItemsController()))
app.put('/accounts/:id', authentication, useRouteController(makeAccountUpdateController()))
app.delete('/accounts/:id', authentication, useRouteController(makeAccountRemoveController()))
app.get('/teams', authentication, useRouteController(makeTeamLoadAllItemsController()))
app.post('/teams', authentication, useRouteController(makeTeamCreateController()))
app.get('/teams/:id', authentication, useRouteController(makeTeamLoadItemController()))

app.listen(3008, () => { console.log('Server is running on https://localhost:3008') })
