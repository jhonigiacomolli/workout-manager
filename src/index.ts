import 'dotenv/config'
import './configurations/module-alias'

import express, { json } from 'express'
import { serve, setup } from 'swagger-ui-express'
import { useRouteController } from './helpers/http'
import { swaggerNoCache } from './middlewares/cache/swagger-no-cache'
import { pagination } from './middlewares/pagination/pagination-middleware'
import { makeSignInController } from './helpers/factories/controllers/make-sign-in-controller'
import { authentication } from './helpers/factories/middlewares/make-authentication-middleware'
import { makeLoadTeamController } from './helpers/factories/controllers/make-load-team.controller'
import { makeAccountUpdateController, makeSignUpController } from './helpers/factories/controllers'
import { makeRefreshTokenController } from './helpers/factories/controllers/make-refresh-token-controller'
import { makeLoadAllTeamsController } from './helpers/factories/controllers/make-load-all-teams.controller'
import { makeAccountRemoveController } from './helpers/factories/controllers/make-accoun-remove-controller'
import { makeLoadAllAccountsController } from './helpers/factories/controllers/make-load=all-uaccounts-controller'
import { swaggerConfigurations } from './documentation/configurations'

export const app = express()
app.use('/docs', swaggerNoCache, serve, setup(swaggerConfigurations))
app.use(json())
app.use(pagination)

app.post('/sign-up', useRouteController(makeSignUpController()))
app.post('/sign-in', useRouteController(makeSignInController()))
app.post('/refresh-token', useRouteController(makeRefreshTokenController()))
app.get('/accounts', authentication, useRouteController(makeLoadAllAccountsController()))
app.put('/accounts/:id', authentication, useRouteController(makeAccountUpdateController()))
app.delete('/accounts/:id', authentication, useRouteController(makeAccountRemoveController()))
app.get('/teams/:id', authentication, useRouteController(makeLoadTeamController()))
app.get('/teams', authentication, useRouteController(makeLoadAllTeamsController()))

app.listen(3008, () => { console.log('Server is running on https://localhost:3008') })
