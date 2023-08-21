import { Account } from '@/protocols/use-cases/account'
import { NextFunction, Request, Response } from 'express'
import { Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

export const authenticate = async (request: Request, response: Response, next: NextFunction, account: Account, encrypter: Encrypter): Promise<void> => {
  const { authorization } = request.headers

  if (!authorization || !authorization.toLocaleLowerCase().includes('bearer')) {
    response.status(401).json({ error: 'Unauthorized' })
    return
  }

  const host = request.headers.host || 'http://localhost'

  const { data, status } = await encrypter.decrypt(authorization.split(' ')[1], host)

  if (!status.success) {
    response.status(401).json({ error: status.message })
    return
  }
  if (!data || !data.id) {
    response.status(401).json({ error: 'Unauthorized' })
    return
  }

  const isUser = await account.getUserById(data.id)

  if (!isUser) {
    response.status(401).json({ error: 'Unauthorized' })
    return
  }

  request.params.userId = data.id

  next()
}
