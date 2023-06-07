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
  const controller = new SignUpController({
    account: new PgAccountRepository(),
    emailValidator: new EmailValidatorRepository(),
    hasher: new BcryptRepository(12)
  })

  const httpResponse = await controller.handle(req || {})

  if(httpResponse.statusCode >=200 && httpResponse.statusCode < 300) {
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }else {
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message
    })
  }
})

app.listen(3008, () => console.log('Server is running on https://localhost:3008'))
