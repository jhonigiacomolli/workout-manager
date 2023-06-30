import 'dotenv/config'
import './configurations/module-alias'

import express, { json } from 'express'
import { useRouteController } from './helpers/http'
import { makeAccountUpdateController, makeSignUpController } from './helpers/factories/controllers'
import { makeSignInController } from './helpers/factories/controllers/make-sign-in-controller'
import { authentication } from './helpers/factories/middlewares/make-authentication-middleware'
import { makeLoadTeamController } from './helpers/factories/controllers/make-load-team.controller'
import { makeRefreshTokenController } from './helpers/factories/controllers/make-refresh-token-controller'
import { makeLoadAllTeamsController } from './helpers/factories/controllers/make-load-all-teams.controller'
import { pagination } from './middlewares/pagination/pagination-middleware'

const app = express()

app.use(json())
app.use(pagination)

app.post('/sign-up', useRouteController(makeSignUpController()))
app.post('/sign-in', useRouteController(makeSignInController()))
app.post('/refresh-token', useRouteController(makeRefreshTokenController()))
app.put('/account', authentication, useRouteController(makeAccountUpdateController()))
app.get('/teams/:id', authentication, useRouteController(makeLoadTeamController()))
app.get('/teams', authentication, useRouteController(makeLoadAllTeamsController()))

app.listen(3008, () => { console.log('Server is running on https://localhost:3008') })
