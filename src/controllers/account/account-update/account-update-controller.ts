import { type Account } from '@/protocols/use-cases/account'
import { type Controller } from '@/protocols/models/controller'
import { type Hasher } from '@/protocols/use-cases/cryptography/hashser'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'

import { httpResponse } from '@/helpers/http'
import { Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

interface ConstructorProps {
  account: Account
  hasher: Hasher
  encrypter: Encrypter
}

export class AccountUdateController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) {
  }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      if (!request.headers.authorization) {
        return httpResponse(401, 'Unauthorized')
      }

      const { id } = await this.dependencies.encrypter.decrypt<{ id: string }>(request.headers.authorization)

      if (!id) {
        return httpResponse(401, 'Unauthorized')
      }

      const requiredParams = ['id', 'name', 'email']

      for (const param of requiredParams) {
        if (!request.body[param]) {
          return httpResponse(400, `Empty param: ${param} is required`)
        }
      }

      const success = await this.dependencies.account.setUserById(request.body)

      if (!success) {
        return httpResponse(400, 'Account update fails')
      }

      return httpResponse(201, 'User updated successfully')
    } catch (err) {
      console.log(err)
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
