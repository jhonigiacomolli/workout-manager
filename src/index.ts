import 'dotenv/config'
import './configurations/module-alias'

import express, { json } from 'express'
import { useRouteController } from './helpers/http'
import { makeAccountUpdateController, makeSignUpController } from './helpers/factories/controllers'
import { makeSignInController } from './helpers/factories/controllers/make-sign-in-controller'
import { authentication } from './helpers/factories/middlewares/make-authentication-middleware'

const app = express()

app.use(json())

app.post('/sign-up', useRouteController(makeSignUpController()))
app.post('/sign-in', useRouteController(makeSignInController()))
app.put('/account', authentication, useRouteController(makeAccountUpdateController()))

app.listen(3008, () => { console.log('Server is running on https://localhost:3008') })
