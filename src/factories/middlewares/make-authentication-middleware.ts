import { authenticate } from '@/middlewares/authentication/authentication-middleware'
import { PgAccountRepository } from '@/repositories/acccount/postgres-account-repository'
import { JsonwebtokenRepository } from '@/repositories/cryptography/encrypter/jsonwebtoken/jsonwebtoken-repository'
import { NextFunction, Request, Response } from 'express'

export const authentication = (request: Request, response: Response, next: NextFunction) => {
  const account = new PgAccountRepository()
  const encrypter = new JsonwebtokenRepository()
  return authenticate(request, response, next, account, encrypter)
}
