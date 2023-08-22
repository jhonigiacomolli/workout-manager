import { type Account } from '@/protocols/use-cases/account'
import { type Controller } from '@/protocols/models/controller'
import { type Hasher } from '@/protocols/use-cases/cryptography/hashser'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'
import { type Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

import { httpResponse } from '@/helpers/http'
import { BadRequestError, NotFoundError } from '@/helpers/errors'

interface ConstructorProps {
  account: Account
  hasher: Hasher
  encrypter: Encrypter
}

export class SignInController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const requiredParams = ['email', 'password']

    const { email, password } = request.body

    for (const param of requiredParams) {
      if (!request.body[param]) {
        throw new BadRequestError(`Empty param: ${param} is required`)
      }
    }

    const isValidUser = await this.dependencies.account.checkEmailInUse(email)

    if (!isValidUser) {
      throw new NotFoundError('user not found')
    }

    const user = await this.dependencies.account.getUserByEmail(email)

    if (!user) {
      throw new NotFoundError('user not found')
    }

    const isCorrectPassword = await this.dependencies.hasher.compare(password, user.password)

    if (!isCorrectPassword) {
      throw new BadRequestError('wrong password')
    }

    const accessToken = await this.dependencies.encrypter.encrypt({ id: user.id }, { expire: 3600, issuer: request.headers.host })
    const refreshToken = await this.dependencies.encrypter.encrypt({ id: user.id }, { expire: 86400, issuer: request.headers.host })

    return httpResponse(200, {
      accessToken,
      refreshToken,
    })
  }
}
