import 'dotenv/config'
import './configurations/module-alias'

import express, { json } from 'express'
import { useRouteController } from './helpers/http'
import { makeSignUpController } from './helpers/factories/controllers'

const app = express()

app.use(json())

app.post('/sign-up', useRouteController(makeSignUpController()))

app.listen(3008, () => { console.log('Server is running on https://localhost:3008') })
