import 'dotenv/config'
import './configurations/module-alias'

import express, { json } from 'express'
import { useRouteController } from './helpers/http'
import { makeSignUpController } from './helpers/factories/controllers'
import { makeSignInController } from './helpers/factories/controllers/make-sign-in-controller'

const app = express()

app.use(json())

app.post('/sign-up', useRouteController(makeSignUpController()))
app.post('/sign-in', useRouteController(makeSignInController()))

app.listen(3008, () => { console.log('Server is running on https://localhost:3008') })
