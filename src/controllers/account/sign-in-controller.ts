import { httpResponse } from '@/helpers/http'
import { type Controller } from '@/protocols/models/controller'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'
import { type Account } from '@/protocols/use-cases/account'
import { type Encrypter } from '@/protocols/use-cases/cryptography/encrypter'
import { type Hasher } from '@/protocols/use-cases/cryptography/hashser'

interface ConstructorProps {
  account: Account
  hasher: Hasher
  encrypter: Encrypter
}

export class SignInController implements Controller {
  constructor (private readonly dependencies: ConstructorProps) { }

  async handle (request: HTTPRequest): Promise<HTTPResponse> {
    try {
      const requiredParams = ['username', 'password']

      const { username, password } = request.body

      for (const param of requiredParams) {
        if (!request.body[param]) {
          return httpResponse(400, `Empty param: ${param} is required`)
        }
      }

      const isValidUser = await this.dependencies.account.checkEmailInUse(username)

      if (!isValidUser) {
        return httpResponse(404, 'user not found')
      }
      const user = await this.dependencies.account.getUserByEmail(username)

      const isCorrectPassword = await this.dependencies.hasher.compare(password, user.password)

      if (!isCorrectPassword) {
        return httpResponse(403, 'wrong password')
      }

      const accessToken = await this.dependencies.encrypter.encrypt(user.id)

      return await Promise.resolve(httpResponse(200, {
        accessToken,
      }))
    } catch {
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
