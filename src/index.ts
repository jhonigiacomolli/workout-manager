import 'dotenv/config'
import './configurations/module-alias'

import express, { json } from 'express'
import { SignUpController } from './controllers/account/sign-up-controller'
import { PgAccountRepository } from './repositories/acccount/postgres-account-repository'
import { EmailValidatorRepository } from './repositories/email-validator/email-validator-repository'
import { BcryptRepository } from './repositories/cryptography/hasher/bcrypt/bcrypt-hasher-repository'

const app = express()

app.use(json())

app.post('/sign-up', async (req, res) => {
  const params = req.body
  const account = new PgAccountRepository()
  const emailValidator = new EmailValidatorRepository()
  const hasher = new BcryptRepository(12)
  console.log('Params: ',  params)
  const controller = new SignUpController({ account, emailValidator, hasher })
  const httpResponse = await controller.handle(req || {})

  res.status(httpResponse.statusCode).json(httpResponse.body)
})

app.listen(3008, () => console.log('Server is running on https://localhost:3008'))
