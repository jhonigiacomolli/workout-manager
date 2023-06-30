import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { Account } from '@/protocols/use-cases/account'

type AccountRemoveControllerProps = {
  account: Account
}

export class AccountRemoveController implements Controller {
  constructor(private readonly dependencies: AccountRemoveControllerProps) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      const id = request.params.id

      if (!id) {
        return httpResponse(400, 'Empty param: id is required')
      }

      const success = await this.dependencies.account.delete(id)

      if (!success) {
        return httpResponse(400, 'User removal failed')
      }

      return httpResponse(204, 'User removed')
    } catch {
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
