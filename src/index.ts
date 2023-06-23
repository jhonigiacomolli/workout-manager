import 'dotenv/config'
import './configurations/module-alias'

import express, { json } from 'express'
import { useRouteController } from './helpers/http'
import { makeAccountUpdateController, makeSignUpController } from './helpers/factories/controllers'
import { makeSignInController } from './helpers/factories/controllers/make-sign-in-controller'
import { authentication } from './helpers/factories/middlewares/make-authentication-middleware'
import { makeLoadTeamController } from './helpers/factories/controllers/make-load-team.controller'
import { makeRefreshTokenController } from './helpers/factories/controllers/make-refresh-token-controller'

const app = express()

app.use(json())

app.post('/sign-up', useRouteController(makeSignUpController()))
app.post('/sign-in', useRouteController(makeSignInController()))
app.post('/refresh-token', useRouteController(makeRefreshTokenController()))
app.put('/account', authentication, useRouteController(makeAccountUpdateController()))
app.get('/team/:id', authentication, useRouteController(makeLoadTeamController()))

app.listen(3008, () => { console.log('Server is running on https://localhost:3008') })
