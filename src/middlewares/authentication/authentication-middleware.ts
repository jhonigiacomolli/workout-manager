import { Account } from '@/protocols/use-cases/account'
import { NextFunction, Request, Response } from 'express'
import { Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

export const authenticate = async (request: Request, response: Response, next: NextFunction, account: Account, encrypter: Encrypter): Promise<void> => {
  const { authorization } = request.headers

  if (!authorization) {
    response.status(401).json({ error: 'Unauthorized' })
    return
  }

  const { data, status } = await encrypter.decrypt(authorization.split(' ')[0])

  if (!status.success) {
    response.status(401).json({ error: status.message })
    return
  }
  if (!data || !data.id) {
    response.status(401).json({ error: 'Unauthorized' })
    return
  }

  request.params.userId = data.id

  next()
}
