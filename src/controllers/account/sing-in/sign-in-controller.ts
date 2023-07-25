import { type Account } from '@/protocols/use-cases/account'
import { type Controller } from '@/protocols/models/controller'
import { type Hasher } from '@/protocols/use-cases/cryptography/hashser'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'
import { type Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

import { httpResponse } from '@/helpers/http'

interface ConstructorProps {
  account: Account
  hasher: Hasher
  encrypter: Encrypter
}

export class SignInController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      const requiredParams = ['email', 'password']

      const { email, password } = request.body

      for (const param of requiredParams) {
        if (!request.body[param]) {
          return httpResponse(400, `Empty param: ${param} is required`)
        }
      }

      const isValidUser = await this.dependencies.account.checkEmailInUse(email)

      if (!isValidUser) {
        return httpResponse(404, 'user not found')
      }

      const user = await this.dependencies.account.getUserByEmail(email)

      if (!user) {
        return httpResponse(404, 'user not found')
      }

      const isCorrectPassword = await this.dependencies.hasher.compare(password, user.password)

      if (!isCorrectPassword) {
        return httpResponse(403, 'wrong password')
      }

      const accessToken = await this.dependencies.encrypter.encrypt({ id: user.id }, { expire: 3600, issuer: request.headers.host })
      const refreshToken = await this.dependencies.encrypter.encrypt({ id: user.id }, { expire: 86400, issuer: request.headers.host })

      return httpResponse(200, {
        accessToken,
        refreshToken,
      })
    } catch (err) {
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
