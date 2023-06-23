import { type Account } from '@/protocols/use-cases/account'
import { type Controller } from '@/protocols/models/controller'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'

import { httpResponse } from '@/helpers/http'

interface ConstructorProps {
  account: Account
}

export class AccountUdateController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) {
  }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    try {
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
    } catch {
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
